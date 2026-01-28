# main.tf - Instância EC2 com acesso via SSM (Sem SSH)

# -----------------------------
# Instruções de Uso
# -----------------------------

# Para conectar à instância via SSM:
# 1. Configure o AWS CLI com o mesmo profile do Terraform:
#    aws configure --profile bia-tf
#
# 2. Conecte usando o comando:
#    aws ssm start-session --target ${aws_instance.bia_dev_ssm.id}
#
# 3. Alternativamente, use o Console AWS:
#    AWS Console > Systems Manager > Session Manager > Start Session
#
# 4. Para ver os logs das sessões:
#    AWS Console > CloudWatch > Log groups > /aws/ssm/sessions/bia-instance

# Notas importantes:
# - Nenhuma porta SSH (22) está aberta
# - Acesso seguro via IAM permissions
# - Todas as sessões são logadas no CloudWatch
# - Funciona mesmo em subnets privadas

# main.tf - Instância EC2 com acesso apenas via SSM (configuração mínima)

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region  = "us-east-1"
  profile = "bia-tf"
}

# -----------------------------
# 1. AMI mais recente do Amazon Linux 2
# -----------------------------
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# -----------------------------
# 2. IAM Role para SSM
# -----------------------------
resource "aws_iam_role" "ec2_role" {
  name = "bia-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

# Política mínima para SSM funcionar
resource "aws_iam_role_policy_attachment" "ssm_core" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "bia-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

# # -----------------------------
# # 3. Security Group (apenas egress)
# # -----------------------------
# resource "aws_security_group" "allow_outbound" {
#   name        = "bia-allow-outbound"
#   description = "Allow outbound traffic only"

#   # ⚠️ Nenhuma regra ingress - acesso apenas via SSM

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }
# }

# -----------------------------
# 3. Security Group (Porta 3001 + SSM)
# -----------------------------
resource "aws_security_group" "bia_app_sg" {
  name        = "bia-app-security-group"
  description = "Allow port 3001 for app and SSM access"

  # Regra para sua aplicação (porta 3001)
  ingress {
    description = "Allow HTTP on port 3001"
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Permite todo tráfego de saída
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "bia-app-sg"
  }
}

# -----------------------------
# 4. EC2 Instance
# -----------------------------
resource "aws_instance" "bia_dev" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"

  # Associa o profile IAM com permissões SSM
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

  # Security Group que permite apenas saída
  vpc_security_group_ids = [aws_security_group.bia_app_sg.id]

  # User data a partir de arquivo externo
  user_data = file("userdata.sh")

  tags = {
    Name = "bia-ssm-instance"
  }
}

# -----------------------------
# 5. Output essencial
# -----------------------------
output "instance_id" {
  value = aws_instance.bia_dev.id
}

output "connect_command" {
  value = "aws ssm start-session --target ${aws_instance.bia_dev.id}"
}
