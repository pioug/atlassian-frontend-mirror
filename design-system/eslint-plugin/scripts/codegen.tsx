import fs from 'fs/promises';
import { extname, join, relative } from 'path';

import camelCase from 'lodash/camelCase';
import { format, resolveConfig } from 'prettier';

import { createSignedArtifact } from '@atlassian/codegen';

import type { LintRule } from '../src/rules/utils/create-rule';

interface FoundRule {
  module: LintRule;
  moduleName: string;
}

interface GeneratedConfig {
  name: string;
  path: string;
}

/**
 * After moving the rule to the new createLintRule API remove it from this list.
 */
const legacyRulesExclusionList = [
  'ensure-design-token-usage-spacing',
  'no-deprecated-apis',
  'no-deprecated-imports',
];
const ignoreList = ['index.codegen.tsx', 'TEMPLATE.md', '__tests__', 'utils'];
const srcDir = join(__dirname, '../src');
const rulesDir = join(srcDir, 'rules');
const presetsDir = join(srcDir, 'presets');
const generatedConfigs: GeneratedConfig[] = [];

async function ruleDocsPath(name: string) {
  const absolutePath = join(rulesDir, name, 'README.md');
  const relativePath = '.' + absolutePath.replace(process.cwd(), '');

  try {
    const file = await fs.readFile(absolutePath, 'utf-8');
    return { path: relativePath, file };
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
            const { severity, recommended } = rule.module.meta?.docs || {};

            // `recommended` is a snowflake at this stage ... it can be a string at runtime
            // because of legacy `import { createRule } from 'utils/create-rule'` so we take
            // into account this possibility (as a fallback) until everything is moved over
            // to the new syntax
            const calculatedSeverity =
              severity ??
              (typeof recommended === 'string' ? String(recommended) : 'error');

            return `'@atlaskit/design-system/${rule.moduleName}': '${calculatedSeverity}'`;
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

async function generateRulesPageContent(
  destination: string,
  rules: FoundRule[],
) {
  const file = await fs.readFile(destination, 'utf-8');
  const ruleDocs: string[] = [];

  for (const rule of rules) {
    const { file } = await ruleDocsPath(rule.moduleName);

    if (file.match(/^# /)) {
      throw new Error(
        `invariant: ${rule.moduleName} doc should not include a heading as it is injected later.`,
      );
    }

    const ruleContent =
      // Inject a second level heading for the rule
      `## ${rule.moduleName}\n` +
      // Increase all found headings by one
      file
        .replace(/(##+) /g, (match) => `#${match}`)
        // Transform third level headings to a <h3> so it doesn't appear in the local nav
        .replace(
          /^### .+/gm,
          (match) => `<h3>${match.replace('### ', '')}</h3>`,
        );

    ruleDocs.push(ruleContent);
  }

  const found =
    /<!-- START_RULE_CONTENT_CODEGEN -->(.|\n)*<!-- END_RULE_CONTENT_CODEGEN -->/.exec(
      file,
    );

  if (!found) {
    throw new Error('invariant: could not find the partial codegen section');
  }

  const updatedFile = file.replace(
    found[0],
    '<!-- START_RULE_CONTENT_CODEGEN -->' +
      '\n<!-- @codegenCommand yarn workspace @atlaskit/eslint-plugin-design-system codegen -->' +
      '\n' +
      ruleDocs.join('\n\n') +
      '\n<!-- END_RULE_CONTENT_CODEGEN -->',
  );

  await writeFile(destination, updatedFile);
}

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
      const result = await ruleDocsPath(rule.moduleName);
      docsPath = result.path;
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

  const found =
    /<!-- START_RULE_TABLE_CODEGEN -->(.|\n)*<!-- END_RULE_TABLE_CODEGEN -->/.exec(
      file,
    );

  if (!found) {
    throw new Error('invariant: could not find the partial codegen section');
  }

  const updatedFile = file.replace(
    found[0],
    '<!-- START_RULE_TABLE_CODEGEN -->' +
      '\n<!-- @codegenCommand yarn workspace @atlaskit/eslint-plugin-design-system codegen -->' +
      code +
      '\n<!-- END_RULE_TABLE_CODEGEN -->',
  );

  await writeFile(filepath, updatedFile);
}

async function generate() {
  const rulePaths = await fs.readdir(rulesDir);
  const recommended: FoundRule[] = [];
  const rules: FoundRule[] = [];

  for (const filename of rulePaths) {
    if (ignoreList.includes(filename)) {
      continue;
    }

    const dirname = filename.replace(extname(filename), '');
    const filenameWithExt = filename.endsWith('.tsx')
      ? filename + '.tsx'
      : filename;

    const rule: LintRule = (await import(join(rulesDir, filenameWithExt)))
      .default;

    const foundRule = {
      module: rule,
      moduleName: dirname,
    };

    const lintRuleName = foundRule.module.name || foundRule.module.meta.name;
    if (typeof lintRuleName === 'string') {
      if (foundRule.moduleName !== lintRuleName) {
        throw new Error(
          `invariant: module name ${foundRule.moduleName} does not match lint rule name ${lintRuleName}`,
        );
      }
    } else {
      if (legacyRulesExclusionList.includes(foundRule.moduleName)) {
        // eslint-disable-next-line no-console
        console.warn(
          `  > The ${foundRule.moduleName} rule should move to the createLintRule() function.`,
        );
      } else {
        throw new Error(
          `  > invariant: The ${foundRule.moduleName} rule must use the createLintRule() function.`,
        );
      }
    }

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
  await generateRulesPageContent(
    join(srcDir, '../constellation/index/usage.mdx'),
    rules,
  );
}

generate();
