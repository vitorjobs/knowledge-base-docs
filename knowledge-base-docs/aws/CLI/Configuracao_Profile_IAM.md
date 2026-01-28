Configuração de usuário já criado no recurso IAM via comando AWS CLI.
Para configurar a AWS CLI com um usuário IAM já existente, siga os passos abaixo:
## Passo 1: Obtenha as Credenciais do Usuário IAM
Certifique-se de ter a Access Key ID e a Secret Access Key do usuário IAM que você deseja configurar. Essas credenciais são necessárias para autenticar a AWS CLI.
## Passo 2: Abra o Terminal
Abra o terminal ou prompt de comando em seu sistema.
## Passo 3: Execute o Comando de Configuração
No terminal, execute o seguinte comando:
```bash
aws configure
```
## Passo 4: Insira as Credenciais e Configurações
Você será solicitado a inserir as seguintes informações:
- **AWS Access Key ID**: Insira a Access Key ID do usuário IAM.
- **AWS Secret Access Key**: Insira a Secret Access Key do usuário IAM.
- **Default region name**: Insira a região padrão que você deseja usar (por exemplo, `us-west-2`, `us-east-1`, etc.).
- **Default output format**: Insira o formato de saída desejado (por exemplo, `json`, `text`, ou `table`).
## Passo 5: Verifique a Configuração
Para garantir que a AWS CLI foi configurada corretamente, você pode executar um comando simples, como listar os buckets S3:
```bash
aws s3 ls
```
Se a configuração estiver correta, você verá a lista dos seus buckets S3 (se houver).
## Conclusão
Você configurou com sucesso a AWS CLI para usar um usuário IAM existente. Agora você pode usar a AWS CLI para interagir com os serviços da AWS usando as permissões associadas ao usuário IAM.
## Referências
- [Documentação Oficial da AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)
- [Gerenciar Usuários IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_manage.html)
  <!-- - [Guia de Instalação do Terraform](../terraform/index.md)
  - [Lançar Instância EC2 com Terraform](../terraform/EC2/index.md) -->
  - [Documentação Oficial do Terraform](https://www.terraform.io/docs)
  - [Documentação Oficial da AWS](https://aws.amazon.com/documentation/)
  <!-- - [Criar Profiles com IAM](../terraform/IAM/index.md)# main.tf - Instância EC2 com acesso via SSM (Sem SSH) -->