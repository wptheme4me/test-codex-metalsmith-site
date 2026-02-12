import { copyFileSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import Metalsmith from 'metalsmith';
import markdown from '@metalsmith/markdown';
import layouts from '@metalsmith/layouts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');

function loadJson(path) {
  return JSON.parse(readFileSync(join(root, path), 'utf-8'));
}

function walk(dir, rel = '') {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const entryRel = rel ? `${rel}/${entry.name}` : entry.name;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(fullPath, entryRel));
    } else if (entry.isFile()) {
      out.push({ fullPath, relPath: entryRel });
    }
  }
  return out;
}

function copyPublicToDist() {
  const publicDir = join(root, 'public');
  if (!statSync(publicDir, { throwIfNoEntry: false })) {
    return;
  }

  for (const sourceFile of walk(publicDir)) {
    const destination = join(root, 'dist', sourceFile.relPath);
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(sourceFile.fullPath, destination);
  }
}

function rulesRouting() {
  return (files, _metalsmith, done) => {
    for (const fileName of Object.keys(files)) {
      const match = /^content\/rules\/(lt|en|ru)\.md$/u.exec(fileName);
      if (!match) {
        continue;
      }

      const lang = match[1];
      const file = files[fileName];
      file.lang = lang;
      file.rulePath = `/rules/${lang}.html`;
      file.layout = 'rules.njk';
      const target = `rules/${lang}.md`;
      files[target] = file;
      delete files[fileName];
    }
    done();
  };
}

function loadMetadata() {
  return (_files, metalsmith, done) => {
    metalsmith.metadata({
      itemsData: loadJson('data/items.json'),
      uiTextsData: loadJson('data/ui-texts.json'),
      shippingData: loadJson('data/shipping.json')
    });
    done();
  };
}

Metalsmith(root)
  .clean(true)
  .source('.')
  .destination('dist')
  .ignore([
    'dist/**',
    'node_modules/**',
    'codex/**',
    'agents/**',
    'build/**',
    'data/**',
    'public/**',
    'AGENTS.md',
    'README.md',
    'netlify.toml',
    'package.json',
    'package-lock.json',
    'src/layouts/**',
    '*.log'
  ])
  .use(loadMetadata())
  .use(rulesRouting())
  .use(markdown())
  .use(layouts({
    transform: 'nunjucks',
    directory: 'src/layouts',
    default: 'index.njk',
    pattern: ['**/*.html']
  }))
  .build((err) => {
    if (err) {
      throw err;
    }
    copyPublicToDist();
    process.stdout.write('Build complete. Output in dist/\n');
  });
