# perguntas_respostas
Projeto de Treinamento NodeJS

Projeto prático para treinamento de nodeJS.

## Desenvolvimento

Use Node.js 22 ou superior. A aplicação usa SQLite via Sequelize e não precisa
de servidor de banco, usuário ou senha.

- `npm ci`: instala as versões do lockfile.
- `npm run dev`: compila os assets e inicia o Express na porta 8080.
- `npm run development`: compila JavaScript e SCSS com esbuild e Sass.
- `npm run production`: gera os mesmos assets com minificação.
- `npm run watch`: recompila quando arquivos em `resources/` mudam.
- `npm run hot`: alias de `watch`; recarregue o navegador manualmente.
- `npm start`: inicia o servidor com o modo watch nativo do Node.js.
- `npm audit`: verifica vulnerabilidades conhecidas.
- `npm test`: testa os formulários e a persistência SQLite em um arquivo
  temporário; deixe a porta 8080 livre antes de executar.

O build escreve `public/js/app.js` e `public/css/app.css`. O arquivo
`mix-manifest.json` é um legado; os templates usam os caminhos diretamente.

## Banco de dados SQLite

Ao iniciar, a aplicação cria `database/perguntas_respostas.sqlite` e as tabelas
automaticamente, antes de abrir a porta 8080. Os dados permanecem nesse arquivo
entre execuções; ele e seus arquivos auxiliares são ignorados pelo Git.

Para usar outro arquivo, defina `SQLITE_STORAGE` com um caminho cujo diretório
já exista. No PowerShell:

```powershell
$env:SQLITE_STORAGE = 'C:\dados\estudos.sqlite'
npm start
```

Para testes temporários, use `SQLITE_STORAGE=:memory:`. A troca não importa
dados do antigo MySQL: o SQLite começa vazio. Para fazer backup, pare a aplicação
e copie o arquivo `.sqlite`.

## Dependências de segurança

O Laravel Mix foi substituído para remover sua cadeia de ferramentas vulneráveis.
O override de `uuid` no Sequelize fixa a série 11 corrigida e compatível com
CommonJS e com as chamadas `v1()` e `v4()` usadas pelo ORM. Reavalie o override
quando o Sequelize atualizar essa dependência. Não use `npm audit fix --force`
para rebaixar o Sequelize automaticamente.
