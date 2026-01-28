# Comandos Ansible
Este documento lista alguns dos comandos mais comuns usados no Ansible para gerenciar e automatizar tarefas.
## Comandos Básicos
- `ansible <grupo> -m ping`: Verifica a conectividade com os hosts no grupo especificado.
- `ansible <grupo> -m setup`: Coleta informações detalhadas sobre os hosts no grupo.
- `ansible-playbook <playbook.yml>`: Executa um playbook Ansible.
## Gerenciamento de Inventário
- `ansible-inventory --list -i <inventario>`: Lista o inventário em formato JSON.
- `ansible-inventory --graph -i <inventario>`: Exibe a estrutura do inventário em formato gráfico.
## Gerenciamento de Configuração
- `ansible-config dump`: Exibe a configuração atual do Ansible.
- `ansible-config list`: Lista todas as opções de configuração disponíveis.
## Checagem de Sintaxe
- `ansible-playbook <playbook.yml> --syntax-check`: Verifica a sintaxe de um playbook sem executá-lo.
- `ansible-lint <playbook.yml>`: Verifica um playbook em busca de práticas recomendadas e erros comuns.

## Outros Comandos Úteis
- `ansible-doc -l`: Lista todos os módulos disponíveis no Ansible.
- `ansible-doc <modulo>`: Exibe a documentação detalhada para um módulo específico.
- `ansible-galaxy install <role>`: Instala uma role do Ansible Galaxy.
- `ansible-vault create <arquivo>`: Cria um arquivo criptografado com Ansible Vault.
- `ansible-vault decrypt <arquivo>`: Descriptografa um arquivo criptografado com Ansible Vault.
Esses comandos são essenciais para trabalhar com An sible e podem ser combinados para criar fluxos de trabalho de automação eficientes. Consulte a [Documentação Oficial do Ansible](https://docs.ansible.com/) para obter mais informações e exemplos avançados.
