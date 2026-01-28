import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Documentação Geral",
  description: "Estudos Diversos em Tecnologia",
  base: 'DocumentacaoGeral/',
  ignoreDeadLinks: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Início', link: '/' },
      { text: 'Docs', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Ansible',
        items: [
          {
            collapsed: true,
            rel: 'noopener noreferrer',
            text: 'Projetos e Exemplos', link: '/Ansible/index.md',
            items: [
              { text: 'Stack de Monitoramento', link: '/Ansible/Projects/MonitoringWithDockerComposer/README.md' },
              // { text: 'Projeto 2 - Implantação de Aplicação Web', link: '/Ansible/Projects/Projeto2/README.md' },
              // { text: 'Projeto 3 - Gerenciamento de Usuários e Permissões', link: '/Ansible/Projects/Projeto3/README.md' },
            ]

          },
          // { text: 'Instalação Ansible', link: '/Ansible/instalacao-ansible.md' },
          // { text: 'Módulos Ansible', link: '/Ansible/modulos-ansible.md' },
          // { text: 'Playbooks Ansible', link: '/Ansible/playbooks-ansible.md' },
          // { text: 'Roles Ansible', link: '/Ansible/roles-ansible.md' },
          // { text: 'Inventário Ansible', link: '/Ansible/inventario-ansible.md' },
          // { text: 'Handlers Ansible', link: '/Ansible/handlers-ansible.md' },
          // { text: 'Templates Ansible', link: '/Ansible/templates-ansible.md' },
          // { text: 'Variáveis Ansible', link: '/Ansible/variaveis-ansible.md' },
          { text: 'Comandos Ansible', link: '/Ansible/comandos.md' },
          // { text: 'Fatos Ansible', link: '/Ansible/fatos-ansible.md' },
        ]
      },
      {
        text: 'AWS',
        items: [
          { text: 'Configuração CLI AWS', link: '/aws/index' },
        ]
      },
      {
        text: 'Terraform',
        items: [
          { text: 'Instalação Terraform', link: '/terraform/index' },
          { text: 'Lançar Instância EC2', link: '/terraform/EC2/index' },
        ]
      }
    ],

    docFooter: {
      prev: 'Página Anterior',
      next: 'Próxima Página'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
