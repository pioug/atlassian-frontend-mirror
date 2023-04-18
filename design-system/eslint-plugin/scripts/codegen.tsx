import fs from 'fs/promises';
import { extname, join, relative } from 'path';

import type { Rule } from 'eslint';
import camelCase from 'lodash/camelCase';
import { format, resolveConfig } from 'prettier';

import { createSignedArtifact } from '@atlassian/codegen';

interface FoundRule {
  module: Rule.RuleModule;
  moduleName: string;
}

interface GeneratedConfig {
  name: string;
  path: string;
}

const ignore = ['index.codegen.tsx', '__tests__', 'utils'];
const srcDir = join(__dirname, '../src');
const rulesDir = join(srcDir, 'rules');
const presetsDir = join(srcDir, 'presets');
const generatedConfigs: GeneratedConfig[] = [];

async function ruleDocsPath(name: string): Promise<string> {
  const absolutePath = join(rulesDir, name, 'README.md');
  const relativePath = '.' + absolutePath.replace(process.cwd(), '');

  try {
    await fs.readFile(absolutePath);
    return relativePath;
  } catch (_) {
    throw new Error(
      `invariant: rule ${name} should have docs at ${absolutePath}`,
    );
  }
}

async function generateConfig(name: string, rules: FoundRule[]) {
  const code = `
    export default {
      plugins: ['@atlaskit/design-system'],
      rules: {
        ${rules
          .map((rule) => {
            let severity = 'error';

            if (
              String(rule.module.meta?.docs?.recommended) === 'warn' &&
              name !== 'all'
            ) {
              severity = 'warn';
            }

            return `'@atlaskit/design-system/${rule.moduleName}': '${severity}'`;
          })
          .join(',')}
      },
    }
  `;

  const filepath = join(presetsDir, `${name}.codegen.tsx`);
  await writeFile(filepath, code);

  generatedConfigs.push({
    name: camelCase(name),
    path: './' + relative(srcDir, join(presetsDir, `${name}.codegen`)),
  });
}

async function writeFile(filepath: string, code: string) {
  const config = await resolveConfig(filepath);
  await fs.writeFile(
    filepath,
    extname(filepath).includes('.md')
      ? format(code, {
          ...config,
          filepath,
        })
      : createSignedArtifact(
          format(code, {
            ...config,
            filepath,
          }),
          'yarn workspace @atlaskit/eslint-plugin-design-system codegen',
        ),
  );
}

async function generateRuleIndex(rules: FoundRule[]) {
  const code = `
    ${rules
      .map(
        (rule) =>
          `import ${camelCase(rule.moduleName)} from './${rule.moduleName}'`,
      )
      .join('\n')}

    export default {
    ${rules
      .map((rule) => `'${rule.moduleName}': ${camelCase(rule.moduleName)}`)
      .join(',')}
    }
  `;

  const filepath = join(rulesDir, 'index.codegen.tsx');
  await writeFile(filepath, code);
}

async function generatePluginIndex() {
  const code = `
    ${generatedConfigs
      .map((config) => `import ${config.name} from '${config.path}'`)
      .join('\n')}

    export { default as rules } from './rules/index.codegen'

    export const configs = {
      ${generatedConfigs.map((config) => `${config.name}`).join(',')}
    }
  `;

  const filepath = join(srcDir, 'index.codegen.tsx');
  await writeFile(filepath, code);
}

const conditional = (cond: string, content?: boolean | string) =>
  content ? cond : '';
const link = (content: string, url?: string) =>
  url ? `<a href="${url}">${content}</a>` : content;

async function generateRuleTable(
  filepath: string,
  linkTo: 'docs' | 'repo',
  rules: FoundRule[],
) {
  const file = await fs.readFile(filepath, 'utf-8');
  const rows: string[] = [];

  for (const rule of rules) {
    let docsPath = '';

    if (linkTo === 'repo') {
      docsPath = await ruleDocsPath(rule.moduleName);
    } else {
      docsPath = `#${rule.moduleName}`;
    }

    const row = `| ${link(rule.moduleName, docsPath)} | ${
      rule.module.meta?.docs?.description || ''
    } | ${conditional(
      'Yes',
      rule.module.meta?.docs?.recommended,
    )} | ${conditional('Yes', rule.module.meta?.fixable)} | ${conditional(
      'Yes',
      rule.module.meta?.hasSuggestions,
    )} |`;

    rows.push(row);
  }

  const code = `
| Rule | Description | Recommended | Fixable | Suggestions |
| ---- | -- | -- | -- | -- |
${rows.join('\n')}
  `;

  const found = /<!-- START_RULE_CODEGEN -->(.|\n)*<!-- END_CODEGEN -->/.exec(
    file,
  );

  if (!found) {
    throw new Error('invariant: could not find the partial codegen section');
  }

  const updatedFile = file.replace(
    found[0],
    '<!-- START_RULE_CODEGEN -->' +
      '\n<!-- @codegenCommand yarn workspace @atlaskit/eslint-plugin-design-system codegen -->' +
      code +
      '\n<!-- END_CODEGEN -->',
  );

  await writeFile(filepath, updatedFile);
}

async function generate() {
  const rulePaths = await fs.readdir(rulesDir);
  const recommended: FoundRule[] = [];
  const rules: FoundRule[] = [];

  for (const filename of rulePaths) {
    if (ignore.includes(filename)) {
      continue;
    }

    const dirname = filename.replace(extname(filename), '');
    const filenameWithExt = filename.endsWith('.tsx')
      ? filename + '.tsx'
      : filename;

    const rule: Rule.RuleModule = (
      await import(join(rulesDir, filenameWithExt))
    ).default;
    const foundRule = {
      module: rule,
      moduleName: dirname,
    };
    rules.push(foundRule);

    if (rule.meta?.docs?.recommended) {
      recommended.push(foundRule);
    }
  }

  await generateRuleIndex(rules);
  await generateConfig('all', rules);
  await generateConfig('recommended', recommended);
  await generatePluginIndex();
  await generateRuleTable(join(srcDir, '../README.md'), 'repo', rules);
  await generateRuleTable(
    join(srcDir, '../constellation/index/usage.mdx'),
    'docs',
    rules,
  );
}

generate();
