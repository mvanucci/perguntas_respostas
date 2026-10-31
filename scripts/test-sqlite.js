const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { mkdtemp, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { once } = require('node:events');

test('SQLite: formulários, redirecionamentos e persistência após reiniciar', { timeout: 30000 }, async () => {
    const directory = await mkdtemp(path.join(tmpdir(), 'perguntas-sqlite-'));
    let server;

    async function start() {
        server = spawn(process.execPath, ['index.js'], {
            cwd: path.join(__dirname, '..'),
            env: { ...process.env, SQLITE_STORAGE: path.join(directory, 'test.sqlite') },
            stdio: ['ignore', 'pipe', 'pipe']
        });
        await new Promise((resolve, reject) => {
            let output = '';
            server.stdout.on('data', chunk => {
                output += chunk;
                if (output.includes('App rodando na porta')) resolve();
            });
            server.stderr.on('data', chunk => { output += chunk; });
            server.once('error', reject);
            server.once('exit', code => reject(new Error(`Servidor encerrou (${code}): ${output}`)));
        });
    }

    async function stop() {
        if (server && server.exitCode === null && server.signalCode === null) {
            const exited = once(server, 'exit');
            server.kill();
            await exited;
        }
    }

    async function post(route, values) {
        const response = await fetch(`http://localhost:8080${route}`, {
            method: 'POST',
            body: new URLSearchParams(values),
            redirect: 'manual'
        });
        assert.equal(response.status, 302);
        return response.headers.get('location');
    }

    try {
        await start();
        assert.equal((await fetch('http://localhost:8080/perguntar')).status, 200);
        assert.equal(await post('/salvarpergunta', { titulo: 'Pergunta SQLite', descricao: 'Descrição persistente' }), '/');
        const home = await (await fetch('http://localhost:8080/')).text();
        assert.match(home, /Pergunta SQLite/);
        const route = home.match(/href="(\/pergunta\/\d+)"/)[1];
        const id = route.split('/').pop();
        assert.equal(await post('/responder', { corpo: 'Resposta persistente', pergunta: id }), route);
        await stop();
        await start();
        const detail = await (await fetch(`http://localhost:8080${route}`)).text();
        assert.match(detail, /Pergunta SQLite/);
        assert.match(detail, /Descrição persistente/);
        assert.match(detail, /Resposta persistente/);
        const missing = await fetch('http://localhost:8080/pergunta/999999', { redirect: 'manual' });
        assert.equal(missing.status, 302);
        assert.equal(missing.headers.get('location'), '/');
    } finally {
        await stop();
        await rm(directory, { recursive: true, force: true });
    }
});
