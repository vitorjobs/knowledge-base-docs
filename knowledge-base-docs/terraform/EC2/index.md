# Configuração de Instâncias EC2 com Terraform
Este guia irá orientá-lo na criação e configuração de instâncias EC2 na AWS utilizando o Terraform.
## Pré-requisitos
Antes de começar, certifique-se de que você tenha o seguinte:
- Uma conta ativa na AWS.
  - Acesso ao AWS Management Console.
  - Credenciais de usuário com permissões para criar instâncias EC2.
- Terraform instalado em sua máquina local. (Consulte o guia de instalação do Terraform [aqui](../index.md)).
## Passo 1: Configurar o Provedor AWS
Crie um arquivo chamado `main.tf` e adicione a configuração do provedor AWS:
```hclprovider "aws" {
  region = "us-west-2" # Substitua pela região desejada
}
```
## Passo 2: Definir a Instância EC2
Adicione a configuração da instância EC2 ao arquivo `main.tf`:
```hclresource "aws_instance" "example" {
  ami           = "ami-0c55b159cbfafe1f0" # Substitua pelo ID da AMI desejada
  instance_type = "t2.micro "  # Tipo de instância. Substitua conforme necessário.
  tags = {
    Name = "ExampleInstance"
  }
}
```
## Passo 3: Inicializar o Terraform
No terminal, navegue até o diretório onde o arquivo `main.tf` está localizado e execute o comando:
```bash
terraform init
```
Isso inicializará o diretório do Terraform e baixará os plugins necessários.

## Passo 4: Planejar a Infraestrutura
Execute o comando a seguir para visualizar o plano de execução:
```bash
terraform plan
```
Revise a saída para garantir que a configuração está correta.
## Passo 5: Aplicar a Configuração
Para criar a instância EC2, execute o comando:
```bash
terraform apply
```
Digite `yes` quando solicitado para confirmar a aplicação das mudanças.
## Passo 6: Verificar a Instância
Após a aplicação bem-sucedida, você pode verificar a criação da instância EC2 no AWS Management Console.
## Passo 7: Limpar os Recursos
Para remover a instância EC2 criada, execute o comando:
```bash
terraform destroy
```
Digite `yes` quando solicitado para confirmar a destruição dos recursos.

## configuração completa do arquivo main.tf
Aqui está a configuração completa do arquivo `main.tf` para referência:
```bash 
```
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "us-east-1"
  profile = "PROFILE"
}

resource "aws_instance" "bia-dev" {
  ami = "ami-02f3f602d23f1659d"
  instance_type = "t3.micro"
  tags = {
    Name = "bia-terraform"
  }
  vpc_security_group_ids = [ "SECURITY_GROUP" ]
  user_data = file("userdata.sh")
  iam_instance_profile = "ROLE"
}
```
## Conclusão
Você configurou com sucesso uma instância EC2 na AWS usando o Terraform. Agora você pode expandir essa configuração adicionando mais recursos conforme necessário. Consulte a documentação oficial do Terraform e da AWS para mais informações e práticas recomendadas.
## Referências
- [Documentação do Terraform para AWS](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Documentação da AWS sobre Instâncias EC2](https://docs.aws.amazon.com/ec2/index.html)
- [Guia de Instalação do Terraform](../index.md)
- [Guia de Configuração da AWS CLI](../../aws/index.md)
- [Documentação Oficial do Terraform](https://www.terraform.io/docs)  