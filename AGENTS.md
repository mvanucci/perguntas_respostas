# Repository Guidelines

## Estrutura do projeto

Este projeto de treinamento implementa perguntas e respostas com Node.js, Express, EJS e MySQL. `index.js` configura o servidor, os middlewares e as rotas. `database/` contém a conexão Sequelize e os modelos `Pergunta.js` e `Resposta.js`. Os templates ficam em `views/`, com elementos compartilhados em `views/partials/`.

Edite JavaScript, SCSS e CSS em `resources/`. O Laravel Mix, configurado em `webpack.mix.js`, gera os arquivos servidos em `public/js/` e `public/css/`, além de `mix-manifest.json`. Evite editar os bundles diretamente.

## Instalação, execução e build

- `npm ci`: instala as dependências conforme `package-lock.json`.
- `npm start`: inicia o servidor com nodemon na porta `8080`. O script exige nodemon disponível, mas ele não está declarado nas dependências.
- `npm run development`: compila os assets para desenvolvimento.
- `npm run dev`: compila os assets e depois executa `npm start`.
- `npm run watch`: recompila os assets quando os arquivos mudam.
- `npm run production`: gera os assets para produção; `npm run prod` é um alias.

Antes de executar, disponibilize o MySQL e crie o banco `perguntas_respostas`. Confira a conexão em `database/database.js`. Se algum comando falhar por incompatibilidade das opções do webpack, registre o erro na descrição da alteração.

## Estilo e nomenclatura

Use CommonJS (`require` e `module.exports`), ponto e vírgula e aspas simples no JavaScript. Prefira quatro espaços em código novo e preserve a indentação local ao editar trechos existentes. Use `camelCase` em variáveis e campos, nomes de modelos com inicial maiúscula e templates em minúsculas. Mantenha a terminologia existente, como `titulo`, `descricao` e `perguntaId`. Não há lint ou formatador configurado.

## Validação

Não há framework de testes, script `npm test` ou meta de cobertura configurados. Valide manualmente a listagem, a criação de perguntas, os detalhes, o envio de respostas e o redirecionamento para IDs inexistentes. Confirme a persistência no MySQL e a apresentação dos assets recompilados.

## Commits e pull requests

O histórico recente usa mensagens como `chore(deps): bump mysql2...` e `chore(deps-dev): bump...`. Siga o padrão `tipo(escopo): descrição`, com assunto curto. Nos PRs, descreva a mudança, informe como foi validada, vincule issues relacionadas e inclua capturas quando houver alterações visuais.

## Configuração e segurança

Não acrescente credenciais reais ao código ou aos commits. Ao alterar a conexão, prefira variáveis de ambiente e documente os nomes necessários. Os modelos sincronizam tabelas na inicialização; preserve `force: false` para evitar recriação destrutiva.
