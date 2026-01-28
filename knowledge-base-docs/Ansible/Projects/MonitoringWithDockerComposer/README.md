# Documentação do Projeto Ansible - Monitoring Stack

## 📋 Visão Geral

Este projeto Ansible automatiza a criação e gerenciamento de uma stack de monitoramento baseada em Docker, integrando **Prometheus** para coleta de métricas e **Grafana** para visualização de dados. O projeto segue as melhores práticas do Ansible, incluindo uso de roles, templates Jinja2 e variáveis centralizadas.

### Objetivo Principal
Provisionar rapidamente uma infraestrutura de monitoramento dockerizada em máquinas locais ou remotas através de playbooks Ansible, facilitando a gestão de containers e configurações de forma idempotente.

---

## 📁 Estrutura do Projeto

### Repositório GITHUB: ```https://github.com/vitorjobs/ansible-prom-grafana-stack```

```
monitoring-ansible/
├── ansible.cfg                          # Configuração global do Ansible
├── playbook_create.yml                  # Playbook para criar stack
├── playbook_destroy.yml                 # Playbook para destruir stack
├── test-vars.yml                        # Playbook para testar variáveis
├── README.MD                            # Documentação inicial
├── DOCUMENTACAO.md                      # Esta documentação
├── ansible.cfg                          # Configuração do Ansible
├── inventory/
│   └── hosts.ini                        # Inventário de hosts
├── group_vars/
│   └── all.yml                          # Variáveis aplicadas a todos os hosts
└── roles/
    └── monitoring/
        ├── tasks/
        │   ├── main.yml                 # Tasks principais de criação
        │   └── destroy_containers.yml   # Tasks de destruição
        ├── templates/
        │   ├── docker-compose.yml.j2    # Template Docker Compose
        │   └── prometheus.yml.j2        # Template Prometheus
        └── files/                       # Diretório para arquivos estáticos (vazio)
```

---

## 📄 Descrição Detalhada dos Arquivos

### 1. **ansible.cfg**
<!-- **Localização:** [ansible.cfg](ansible.cfg) -->

**Responsabilidade:** Arquivo de configuração global do Ansible que define comportamentos padrão para toda a execução.

**Conteúdo:**
```ini
[defaults]
inventory = inventory/hosts.ini         # Arquivo de inventário padrão
host_key_checking = False               # Desativa verificação de chaves SSH
interpreter_python = auto               # Detecta automaticamente Python disponível
```

**Papel:**
- Define o inventário padrão para que não seja necessário especificá-lo em cada comando
- Desativa a verificação de chaves SSH para evitar prompts interativos
- Garante compatibilidade entre diferentes versões de Python

**Boas Práticas Aplicadas:**
- ✅ Configuração centralizada evita repetição em comandos
- ✅ `interpreter_python = auto` aumenta compatibilidade

---

### 2. **inventory/hosts.ini**
<!-- **Localização:** [inventory/hosts.ini](inventory/hosts.ini) -->

**Responsabilidade:** Define os hosts alvo e suas configurações de conexão.

**Conteúdo:**
```ini
[monitoring]
localhost ansible_connection=local
localhost ansible_connection=local ansible_python_interpreter=/usr/bin/python3
```

**Papel:**
- Agrupa hosts sob o grupo `monitoring`
- Define `localhost` como alvo com conexão local (sem SSH)
- Especifica o interpretador Python da máquina local

**Boas Práticas Aplicadas:**
- ✅ Uso de grupos para organizar hosts
- ✅ Flexibilidade para adicionar hosts remotos
- ✅ Configuração específica do interpretador Python

**Como Adicionar um Host Remoto:**
```ini
[monitoring]
localhost ansible_connection=local
remote_host ansible_host=192.168.1.100 ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/id_rsa
```

---

### 3. **group_vars/all.yml**
**Localização:** [group_vars/all.yml](group_vars/all.yml)

**Responsabilidade:** Define variáveis aplicadas a **todos os hosts** do inventário.

**Papel:**
- Centraliza configurações de ambiente
- Define parâmetros dos containers (imagens, portas, IPs)
- Especifica volumes Docker e configurações de rede
- Fornece valores reutilizáveis para templates

**Variáveis Principais:**

| Variável                            | Descrição                     | Valor Padrão                          |
| ----------------------------------- | ----------------------------- | ------------------------------------- |
| `project_name`                      | Nome do projeto               | `monitoring`                          |
| `project_path`                      | Caminho do projeto na máquina | `/home/{{ ansible_user }}/monitoring` |
| `docker_network.subnet`             | Subnet da rede Docker         | `172.30.0.0/16`                       |
| `containers.prometheus.image`       | Imagem Docker Prometheus      | `prom/prometheus:latest`              |
| `containers.prometheus.ip_address`  | IP fixo Prometheus            | `172.30.0.10`                         |
| `containers.prometheus.host_port`   | Porta exposta Prometheus      | `9090`                                |
| `containers.grafana.image`          | Imagem Docker Grafana         | `grafana/grafana:latest`              |
| `containers.grafana.ip_address`     | IP fixo Grafana               | `172.30.0.20`                         |
| `containers.grafana.host_port`      | Porta exposta Grafana         | `3000`                                |
| `containers.grafana.admin_user`     | Usuário admin Grafana         | `admin`                               |
| `containers.grafana.admin_password` | Senha admin Grafana           | `admin123`                            |
| `docker_volumes`                    | Lista de volumes Docker       | `["prometheus_data", "grafana_data"]` |

**Boas Práticas Aplicadas:**
- ✅ Separação de configurações de código
- ✅ Uso de variáveis dinâmicas (ex: `{{ ansible_user }}`)
- ✅ Estrutura hierárquica com dicionários
- ⚠️ **Segurança:** Senhas em arquivo de configuração (usar Vault em produção!)

**Como Usar em Produção:**
```bash
# Encriptar variáveis sensíveis com Ansible Vault
ansible-vault encrypt group_vars/all.yml
```

---

### 4. **playbook_create.yml**
**Localização:** [playbook_create.yml](playbook_create.yml)

**Responsabilidade:** Playbook principal que orquestra a criação da stack de monitoramento.

**Papel:**
- Executa todas as tasks do role `monitoring`
- Exibe informações de diagnóstico e troubleshooting
- Fornece comandos manual para verificação

**Estrutura:**
```yaml
- name: Setup Stack de Monitoramento com Docker Compose
  hosts: monitoring                      # Alvo: grupo monitoring
  roles:
    - monitoring                         # Carrega o role monitoring
  
  post_tasks:
    - name: Exibir resumo e troubleshooting
      debug: ...                         # Exibe instruções pós-criação
```

**O que Acontece na Execução:**
1. ✅ Cria diretório do projeto
2. ✅ Cria diretório de configuração Prometheus
3. ✅ Renderiza `prometheus.yml` a partir do template
4. ✅ Renderiza `docker-compose.yml` a partir do template
5. ✅ Executa `docker compose up -d` para iniciar containers
6. ✅ Exibe mensagens de diagnóstico

---

### 5. **playbook_destroy.yml**
**Localização:** [playbook_destroy.yml](playbook_destroy.yml)

**Responsabilidade:** Playbook para limpeza completa da stack de monitoramento.

**Papel:**
- Remove containers, redes e volumes Docker
- Deleta o diretório do projeto
- Fornece feedback da operação

**Estrutura:**
```yaml
- name: Destruir stack de monitoramento (Docker Compose)
  hosts: monitoring
  vars:
    project_path: "/home/{{ ansible_user }}/{{ project_name }}"
  tasks:
    - include_role:
        name: monitoring
        tasks_from: destroy_containers.yml
```

---

### 6. **test-vars.yml**
**Localização:** [test-vars.yml](test-vars.yml)

**Responsabilidade:** Playbook para validação e debug de variáveis.

**Papel:**
- Verifica se as variáveis estão sendo carregadas corretamente
- Útil para troubleshooting e desenvolvimento

**Como Usar:**
```bash
ansible-playbook test-vars.yml
```

---

### 7. **roles/monitoring/tasks/main.yml**
**Localização:** [roles/monitoring/tasks/main.yml](roles/monitoring/tasks/main.yml)

**Responsabilidade:** Define as tasks principais para criar a stack de monitoramento.

**Tasks Executadas:**

| #   | Task                          | Módulo     | Descrição                               |
| --- | ----------------------------- | ---------- | --------------------------------------- |
| 1   | Criar diretório do projeto    | `file`     | Cria `/home/user/monitoring`            |
| 2   | Criar diretório Prometheus    | `file`     | Cria `/home/user/monitoring/prometheus` |
| 3   | Renderizar prometheus.yml     | `template` | Gera config Prometheus dinamicamente    |
| 4   | Renderizar docker-compose.yml | `template` | Gera docker-compose dinamicamente       |
| 5   | Subir stack                   | `command`  | Executa `docker compose up -d`          |
| 6   | Exibir resumo                 | `debug`    | Mostra URLs e informações               |

**Módulos Utilizados:**
- `file`: Gerenciar arquivos e diretórios
- `template`: Renderizar templates Jinja2
- `command`: Executar comandos shell
- `debug`: Exibir mensagens

---

### 8. **roles/monitoring/tasks/destroy_containers.yml**
**Localização:** [roles/monitoring/tasks/destroy_containers.yml](roles/monitoring/tasks/destroy_containers.yml)

**Responsabilidade:** Define as tasks para destruição da stack.

**Tasks Executadas:**

| #   | Task                | Módulo    | Descrição                                  |
| --- | ------------------- | --------- | ------------------------------------------ |
| 1   | Verificar diretório | `stat`    | Verifica se `/home/user/monitoring` existe |
| 2   | Parar containers    | `command` | Executa `docker compose down -v`           |
| 3   | Remover diretório   | `file`    | Deleta o diretório inteiro                 |
| 4   | Exibir resumo       | `debug`   | Confirma remoção                           |

**Flags Importantes:**
- `-v`: Remove volumes associados
- `--remove-orphans`: Remove containers órfãos

---

### 9. **roles/monitoring/templates/docker-compose.yml.j2**
<!-- **Localização:** [roles/monitoring/templates/docker-compose.yml.j2](roles/monitoring/templates/docker-compose.yml.j2) -->

**Responsabilidade:** Template Jinja2 para gerar o arquivo `docker-compose.yml`.

**Papel:**
- Define serviços Prometheus e Grafana
- Configura volumes, redes, portas e variáveis de ambiente
- Renderizado dinamicamente com valores de `all.yml`

**Componentes:**

**Volumes:**
```jinja2
volumes:
{% for volume in docker_volumes %}
  {{ volume }}:
{% endfor %}
```
Gera volumes: `prometheus_data:` e `grafana_data:`

**Rede:**
```jinja2
networks:
  monitoring:
    driver: bridge
    ipam:
      config:
        - subnet: {{ docker_network.subnet }}
```
Cria rede com subnet `172.30.0.0/16`

**Serviço Prometheus:**
- Imagem: `prom/prometheus:latest`
- IP: `172.30.0.10`
- Porta: `9090:9090`
- Volume: `./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml`
- Restart: `unless-stopped`

**Serviço Grafana:**
- Imagem: `grafana/grafana:latest`
- IP: `172.30.0.20`
- Porta: `3000:3000`
- Usuário Admin: `admin`
- Senha Admin: `admin123`
- Dependência: Prometheus
- Restart: `unless-stopped`

---

### 10. **roles/monitoring/templates/prometheus.yml.j2**
<!-- **Localização:** [roles/monitoring/templates/prometheus.yml.j2](roles/monitoring/templates/prometheus.yml.j2) -->

**Responsabilidade:** Template Jinja2 para gerar a configuração do Prometheus.

**Papel:**
- Define intervalo de scrape (15 segundos)
- Especifica o job `prometheus` para auto-monitoramento
- Configurável para adicionar mais targets

**Conteúdo Gerado:**
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets:
          - "localhost:9090"
```

---

## 🔄 Relacionamentos Entre Arquivos

```
ansible.cfg
    ↓
    └─→ Referencia: inventory/hosts.ini
            ↓
            └─→ Grupo: [monitoring]
                    ↓
                    └─→ Usa variáveis: group_vars/all.yml
                            ↓
                            ├─→ playbook_create.yml
                            │       ↓
                            │       └─→ Role: monitoring
                            │               ↓
                            │               ├─→ tasks/main.yml
                            │               │       ├─→ Template: docker-compose.yml.j2
                            │               │       └─→ Template: prometheus.yml.j2
                            │               │
                            │               └─→ tasks/destroy_containers.yml
                            │
                            └─→ playbook_destroy.yml
                                    ↓
                                    └─→ Role: monitoring
                                            ↓
                                            └─→ tasks/destroy_containers.yml
```

---

## 🚀 Guia de Execução

### Pré-requisitos

```bash
# Instalar Ansible (3.0+)
sudo apt-get install ansible

# Instalar Docker
sudo apt-get install docker.io

# Instalar Docker Compose
sudo apt-get install docker-compose

# (Opcional) Instalar coleta community.docker
ansible-galaxy collection install community.docker

# Adicionar usuário ao grupo docker (para evitar sudo)
sudo usermod -aG docker $USER
newgrp docker
```

### 1️⃣ Executar o Playbook de Criação

```bash
# Execução padrão
ansible-playbook playbook_create.yml

# Com mais verbosidade (para debug)
ansible-playbook -v playbook_create.yml

# Bem verboso (debug detalhado)
ansible-playbook -vvv playbook_create.yml

# Especificar inventário (se não quiser usar o padrão)
ansible-playbook -i inventory/hosts.ini playbook_create.yml

# Especificar tags (se implementadas)
ansible-playbook playbook_create.yml --tags "setup"
```

**Esperado:**
- ✅ Diretório `/home/user/monitoring/` criado
- ✅ Arquivo `docker-compose.yml` gerado
- ✅ Arquivo `prometheus/prometheus.yml` gerado
- ✅ Containers Prometheus e Grafana inicializados
- ✅ URLs de acesso exibidas no final

### 2️⃣ Verificar Status dos Containers

```bash
# Listar containers em execução
docker ps

# Ver logs dos containers
docker compose -f ~/monitoring/docker-compose.yml logs

# Ver logs em tempo real
docker compose -f ~/monitoring/docker-compose.yml logs -f

# Inspecionar container específico
docker inspect prometheus_ansible

# Verificar uso de recursos
docker stats
```

### 3️⃣ Acessar as Interfaces Web

```
🟢 Prometheus:  http://localhost:9090
🔵 Grafana:     http://localhost:3000
   Usuário:     admin
   Senha:       admin123
```

### 4️⃣ Testar Variáveis

```bash
# Validar carregamento de variáveis
ansible-playbook test-vars.yml

# Esperado:
# "project_path: /home/guedes/monitoring"
# "project_name: monitoring"
```

### 5️⃣ Executar o Playbook de Destruição

```bash
# Remover toda a stack
ansible-playbook playbook_destroy.yml

# Esperado:
# ✅ Containers parados e removidos
# ✅ Volumes removidos
# ✅ Redes removidas
# ✅ Diretório deletado
```

---

## ✅ Validação e Testes

### Syntax Check

```bash
# Validar sintaxe de playbooks
ansible-playbook --syntax-check playbook_create.yml
ansible-playbook --syntax-check playbook_destroy.yml

# Validar sintaxe do inventário
ansible-inventory --list -i inventory/hosts.ini

# Listar hosts que serão afetados
ansible-inventory -i inventory/hosts.ini --list
```

### Dry Run (Simular Execução)

```bash
# Executar em "modo check" sem fazer mudanças reais
ansible-playbook playbook_create.yml --check

# Com debug verbose
ansible-playbook playbook_create.yml --check -v

# Combinado com diff (mostra o que seria alterado)
ansible-playbook playbook_create.yml --check --diff
```

### Validar Conectividade

```bash
# Testar conexão com hosts
ansible all -i inventory/hosts.ini -m ping

# Coletar fatos sobre os hosts
ansible all -i inventory/hosts.ini -m setup

# Executar comando ad-hoc
ansible monitoring -i inventory/hosts.ini -m command -a "docker --version"
```

### Validar Templates

```bash
# Renderizar template sem aplicar
ansible-playbook playbook_create.yml --check --diff

# Verificar arquivo gerado manualmente
cat ~/monitoring/docker-compose.yml
cat ~/monitoring/prometheus/prometheus.yml

# Validar yaml do docker-compose
cd ~/monitoring && docker compose config
```

---

## 🔐 Boas Práticas Ansible

### 1. **Segurança - Gestão de Senhas**

❌ **NÃO FAZER:** Armazenar senhas em texto plano
```yaml
# ❌ RUIM
admin_password: "admin123"
```

✅ **FAZER:** Usar Ansible Vault
```bash
# Criar arquivo com variáveis sensíveis
cat > group_vars/monitoring/vault.yml << EOF
vault_grafana_password: "senha_segura_aqui"
EOF

# Encriptar
ansible-vault encrypt group_vars/monitoring/vault.yml

# Usar no playbook
- name: Setup Grafana
  set_fact:
    grafana_password: "{{ vault_grafana_password }}"

# Executar com prompt de senha
ansible-playbook playbook_create.yml --ask-vault-pass

# Ou usar arquivo de senha
ansible-playbook playbook_create.yml --vault-password-file=.vault_pass
```

### 2. **Idempotência**

✅ **AÇÃO:** As tasks devem ser idempotentes (mesmos resultados ao executar múltiplas vezes)

**Atual:**
```yaml
- name: Subir stack de monitoramento
  command: docker compose up -d
```

**Melhorado (Idempotente):**
```yaml
- name: Subir stack de monitoramento
  community.docker.docker_compose:
    project_src: "{{ project_path }}"
    state: present
  when: project_dir.stat.exists
```

### 3. **Nomeação Descritiva**

✅ **FAZER:** Nomes claros e estruturados para tasks
```yaml
- name: "Criar diretório do projeto: {{ project_path }}"
```

### 4. **Tratamento de Erros**

✅ **FAZER:** Capturar e lidar com erros apropriadamente

**Exemplo no projeto:**
```yaml
- name: Parar e remover containers
  command: docker compose down -v
  args:
    chdir: "{{ project_path }}"
  when: project_dir.stat.exists
  register: destroy_output
  failed_when: false  # Não falha se comando falha
  changed_when: "'Removing' in destroy_output.stdout"  # Define quando há mudança
```

### 5. **Uso de Handlers para Reinicializações**

❌ **Atual:** Task executa sempre

✅ **Melhorado:** Usar handlers
```yaml
- name: Atualizar config Prometheus
  template:
    src: prometheus.yml.j2
    dest: "{{ project_path }}/prometheus/prometheus.yml"
  notify: "Restart Prometheus"

- name: Restart Prometheus
  command: docker compose restart prometheus
  args:
    chdir: "{{ project_path }}"
  listen: "Restart Prometheus"
```

### 6. **Organização com Tags**

✅ **FAZER:** Adicionar tags para seletividade

```yaml
- name: Criar diretórios
  file:
    path: "{{ item }}"
    state: directory
  loop:
    - "{{ project_path }}"
    - "{{ project_path }}/prometheus"
  tags:
    - setup
    - directories

- name: Renderizar templates
  template:
    src: "{{ item.src }}"
    dest: "{{ item.dest }}"
  loop:
    - { src: "docker-compose.yml.j2", dest: "{{ project_path }}/docker-compose.yml" }
    - { src: "prometheus.yml.j2", dest: "{{ project_path }}/prometheus/prometheus.yml" }
  tags:
    - setup
    - templates

# Executar apenas tags específicas
ansible-playbook playbook_create.yml --tags setup,templates
```

### 7. **Variáveis Bem Estruturadas**

✅ **FAZER:** Usar dicionários e listas estruturadas
```yaml
# ✅ BOM
containers:
  prometheus:
    image: "prom/prometheus:latest"
    port: 9090
    ip_address: "172.30.0.10"
```

✅ **FAZER:** Validar variáveis obrigatórias
```yaml
- name: Validar variáveis obrigatórias
  assert:
    that:
      - project_name is defined
      - project_path is defined
      - containers is defined
    fail_msg: "Variáveis obrigatórias não definidas"
  tags: validate
```

### 8. **Documentação no Código**

✅ **FAZER:** Comentar tasks complexas
```yaml
# Criar a rede Docker com subnet específica para evitar conflitos
# com outras redes e permitir IPs fixos para containers
- name: Criar rede Docker para monitoramento
  community.docker.docker_network:
    name: "{{ docker_network.name }}"
    driver: bridge
    ipam_config:
      - subnet: "{{ docker_network.subnet }}"
```

### 9. **Versionamento de Roles**

✅ **FAZER:** Usar requirements.yml para gerenciar roles externas
```yaml
# roles/requirements.yml
roles:
  - name: geerlingguy.docker
    version: 5.0.1
```

```bash
ansible-galaxy install -r roles/requirements.yml
```

### 10. **Logging e Auditoria**

✅ **FAZER:** Habilitar logs
```bash
# No ansible.cfg
[defaults]
log_path = ./ansible.log
```

```bash
# Ver logs
tail -f ansible.log
```

---

## 📊 Estrutura Recomendada para Produção

```
monitoring-ansible/
├── ansible.cfg
├── inventory/
│   ├── hosts.ini
│   ├── group_vars/
│   │   ├── all.yml
│   │   ├── monitoring/
│   │   │   ├── vault.yml          # ← Variáveis sensíveis encriptadas
│   │   │   └── vars.yml
│   │   └── production/
│   │       └── vars.yml
│   └── host_vars/
│       └── localhost.yml
├── roles/
│   ├── requirements.yml
│   └── monitoring/
│       ├── README.md
│       ├── meta/
│       │   └── main.yml
│       ├── defaults/
│       │   └── main.yml
│       ├── tasks/
│       ├── templates/
│       ├── files/
│       ├── handlers/
│       └── tests/
│           └── test.yml
├── playbooks/
│   ├── create.yml
│   ├── destroy.yml
│   └── validate.yml
├── .vault_pass                  # ← Nunca committar!
├── .gitignore
└── README.md
```

---

## 🐛 Troubleshooting

### Problema: "Variáveis não definidas"

```bash
# Solução: Testar variáveis
ansible-playbook test-vars.yml

# Debug detalhado
ansible-playbook playbook_create.yml -vvv | grep -i variable
```

### Problema: "Docker compose command not found"

```bash
# Solução: Verificar instalação
docker compose version

# Se não tiver, instalar
sudo apt-get install docker-compose-plugin
```

### Problema: "Permission denied ao usar Docker"

```bash
# Solução: Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
newgrp docker

# Ou usar become: true no playbook
- name: Subir stack
  command: docker compose up -d
  become: true
```

### Problema: "Containers não iniciam"

```bash
# Verificar logs
docker compose -f ~/monitoring/docker-compose.yml logs

# Validar docker-compose.yml
docker compose -f ~/monitoring/docker-compose.yml config

# Verificar recursos disponíveis
docker system df
```

### Problema: "Ports already in use"

```bash
# Encontrar processo usando porta 3000
lsof -i :3000

# Liberar porta ou mudar em group_vars/all.yml
# containers.grafana.host_port: 3001
```

---

## 📚 Referências Externas

- [Documentação Ansible](https://docs.ansible.com/)
- [Ansible Best Practices](https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html)
- [Docker Compose Specification](https://compose-spec.io/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Ansible Vault](https://docs.ansible.com/ansible/latest/user_guide/vault.html)

---

## 📝 Checklist de Implantação

- [ ] Instalar Ansible 3.0+
- [ ] Instalar Docker e Docker Compose
- [ ] Clonar/baixar o projeto
- [ ] Revisar `group_vars/all.yml` e ajustar conforme necessário
- [ ] Validar sintaxe: `ansible-playbook --syntax-check playbook_create.yml`
- [ ] Testar conectividade: `ansible all -m ping`
- [ ] Executar dry-run: `ansible-playbook playbook_create.yml --check`
- [ ] Executar playbook: `ansible-playbook playbook_create.yml`
- [ ] Validar containers: `docker ps`
- [ ] Acessar Prometheus e Grafana
- [ ] Configurar dashboards no Grafana
- [ ] Documentar customizações
- [ ] Setup de backup de volumes
- [ ] Implementar monitoramento e alertas

---

## 📞 Suporte e Contribuições

Para dúvidas, problemas ou sugestões, consulte:
- Documentação do projeto (este arquivo)
- Logs do Ansible: `ansible.log`
- Logs dos containers: `docker compose logs`

**Última atualização:** 27 de janeiro de 2026
