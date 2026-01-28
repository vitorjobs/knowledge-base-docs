# Instalando o Terraform no Ubuntu
Siga os passos abaixo para instalar o Terraform no Ubuntu utilizando o repositório oficial da HashiCorp.
## Passo 1: Atualize os pacotes do sistema e instale dependências
```bash
sudo apt update && sudo apt install -y gnupg software-properties-common curl
```
## Passo 2: Adicione a chave GPG da HashiCorp
```bash
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
```
## Passo 3: Adicione o repositório oficial da HashiCorp
```bash
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
```
## Passo 4: Atualize a lista de pacotes e instale o Terraform
```bash
sudo apt update && sudo apt install -y terraform
```
## Passo 5: Verifique a instalação
```bash
terraform --version
```
Isso confirmará que o Terraform foi instalado corretamente e está acessível a partir do seu PATH. 