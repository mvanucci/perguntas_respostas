const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');
const sass = require('sass');

process.chdir(path.join(__dirname, '..'));
const production = process.argv.includes('--production');

async function build() {
    const css = sass.compile('resources/scss/app.scss', {
        loadPaths: ['node_modules'],
        style: production ? 'compressed' : 'expanded',
        silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
        quietDeps: true
    });
    const result = await esbuild.build({
        entryPoints: ['resources/js/app.js'],
        bundle: true,
        outfile: 'public/js/app.js',
        minify: production,
        write: false
    });
    fs.mkdirSync('public/js', { recursive: true });
    fs.mkdirSync('public/css', { recursive: true });
    fs.writeFileSync('public/css/app.css', css.css);
    for (const output of result.outputFiles) fs.writeFileSync(output.path, output.contents);
    console.log('Assets compilados.');
}

async function main() {
    await build();
    if (process.argv.includes('--watch')) {
        let timer;
        fs.watch('resources', { recursive: true }, () => {
            clearTimeout(timer);
            timer = setTimeout(() => build().catch(console.error), 150);
        });
        console.log('Aguardando alterações em resources/.');
    }
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
