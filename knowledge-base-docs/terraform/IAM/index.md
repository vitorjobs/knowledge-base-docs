Criação de profiles com IAM 

Para criar profiles com permissões específicas usando o AWS Identity and Access Management (IAM), siga os passos abaixo:
## Passo 1: Acesse o Console de Gerenciamento da AWS
Faça login no [Console de Gerenciamento da AWS](https://aws.amazon.com/console/).
## Passo 2: Navegue até o IAM
No console, procure por "IAM" na barra de serviços e clique para acessar o serviço IAM.
## Passo 3: Crie uma Nova Política IAM
1. No painel lateral, clique em "Policies" (Políticas).
2. Clique em "Create policy" (Criar política).
3. Use o editor visual ou JSON para definir as permissões desejadas para o profile. Por exemplo, para criar uma política que permita acesso somente leitura ao S3, você pode usar o seguinte JSON:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:Get*",
                "s3:List*"
            ],
            "Resource": "*"
        }
    ]
}
4. Clique em "Review policy" (Revisar política), dê um nome e uma descrição para a política, e clique em "Create policy" (Criar política).
```
## Passo 4: Crie um Novo Grupo IAM
1. No painel lateral, clique em "User groups" (Grupos de usuários).
2. Clique em "Create group" (Criar grupo).
3. Dê um nome ao grupo e clique em "Next: Permissions" (Próximo: Permissões).
4. Selecione a política que você criou no Passo 3 e clique em "Next: Tags" (Próximo: Tags).
5. (Opcional) Adicione tags ao grupo e clique em "Next: Review" (Próximo: Revisão).
6. Revise as configurações e clique em "Create group" (Criar grupo).
## Passo 5: Crie um Novo Usuário IAM
1. No painel lateral, clique em "Users" (Usuários).
2. Clique em "Add users" (Adicionar usuários).
3. Digite um nome de usuário e selecione o tipo de acesso (Programmatic access para acesso via API/CLI).
4. Clique em "Next: Permissions" (Próximo: Permissões).
5. Selecione "Add user to group" (Adicionar usuário ao grupo) e escolha o grupo que você criou no Passo 4.
6. Clique em "Next: Tags" (Próximo: Tags).
7. (Opcional) Adicione tags ao usuário e clique em "Next: Review" (Próximo: Revisão).
8. Revise as configurações e clique em "Create  user" (Criar usuário).
## Passo 6: Salve as Credenciais do Usuário
Após a criação do usuário, você verá uma tela com as credenciais de acesso (Access Key ID e Secret Access Key). Salve essas informações em um local seguro, pois você precisará delas para configurar o AWS CLI ou SDKs.
## Conclusão
Você criou com sucesso um profile IAM com permissões específicas. Agora você pode usar as credenciais do usuário para acessar os serviços da AWS conforme as permissões definidas na política associada ao grupo.
## Referências
- [Documentação Oficial do IAM da AWS](https://docs.aws.amazon.com/iam/index.html)
- [Criar Políticas IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html)
- [Criar Grupos e Usuários IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html)
  - [Guia de Instalação do Terraform](../index.md)
  - [Guia de Configuração da AWS CLI](../../aws/index.md)
  - [Lançar Instância EC2 com Terraform](../EC2/index.md)
  - [Documentação Oficial do Terraform](https://www.terraform.io/docs)
  - [Documentação Oficial da AWS](https://aws.amazon.com/documentation/)