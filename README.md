# DriveXpert - Sistema de Avaliação de Carros

Sistema web para avaliação de carros com diferentes perfis de usuários (cliente, vendedor e avaliador).

## Requisitos

- Node.js (versão 14 ou superior)
- PostgresSQL
- NPM ou Yarn

## Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd drivexpert
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o MongoDB:
- Certifique-se de que o MongoDB está instalado e rodando em sua máquina
- O sistema irá se conectar ao MongoDB na URL: `mongodb://localhost:27017/drivexpert`

## Como Executar

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse o sistema no navegador:
```
http://localhost:3001
```

## Funcionalidades Principais

1. **Sistema de Autenticação**
   - Login para diferentes tipos de usuários
   - Registro de novos usuários
   - Controle de sessão

2. **Gestão de Carros**
   - Cadastro de veículos
   - Visualização de detalhes
   - Atualização de informações

3. **Sistema de Avaliação**
   - Avaliação detalhada de veículos
   - Registro de preço estimado
   - Análise de diferentes aspectos do veículo

## Tipos de Usuários

1. **Cliente**
   - Pode visualizar avaliações
   - Solicitar avaliações de veículos

2. **Vendedor**
   - Cadastra veículos para avaliação
   - Gerencia veículos cadastrados
   - Visualiza avaliações

3. **Avaliador**
   - Realiza avaliações técnicas
   - Define preço estimado
   - Registra estado dos componentes

## Tecnologias Utilizadas

- Node.js
- Express.js
- MongoDB
- EJS (Template Engine)
- Bootstrap 5
- Express Session 
