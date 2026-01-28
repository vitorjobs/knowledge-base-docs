# Configuração da AWS CLI
Este guia passo a passo ajudará você a instalar e configurar a AWS CLI (Command Line Interface) em seu sistema.
## Passo 1: Atualize o índice de pacotes e instale dependências
```bash
sudo apt update && sudo apt install -y unzip curl
```
## Passo 2: Baixe o instalador da AWS CLI v2
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
```
## Passo 3: Descompacte o arquivo
```bash
unzip awscliv2.zip
```
## Passo 4: Execute o script de instalação
```bash
sudo ./aws/install
```
## Passo 5: Verifique a instalação
```bash
aws --version
```
## Passo 6: Limpeza (opcional)
```bash
rm -rf awscliv2.zip aws
```
## Passo 7: Configure a CLI com suas credenciais
```bash
aws configure
```
Insira sua AWS Access Key ID, Secret Access Key, região padrão e formato de saída quando solicitado.
## Passo 8: Teste a configuração listando seus buckets S3
```bash
aws s3 ls
```
Isso deve retornar uma lista dos seus buckets S3, confirmando que a AWS CLI está configurada corretamente.

## Conclusão
```
Você instalou e configurou com sucesso a AWS CLI em seu sistema. Agora você pode usar a CLI para gerenciar seus serviços AWS diretamente do terminal.
```