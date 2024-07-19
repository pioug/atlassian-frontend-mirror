import fs from 'fs/promises';
import { extname, join, relative } from 'path';

import camelCase from 'lodash/camelCase';
import outdent from 'outdent';

import format from '@af/formatting/sync';
import type { LintRule } from '@atlaskit/eslint-utils/create-rule';
import { createSignedArtifact } from '@atlassian/codegen';

interface FoundRule {
	module: LintRule;
	/**
	 * Same as the directory name
	 */
	moduleName: string;
	/**
	 *  Friendly name that can include special characters
	 */
	ruleName: string;
}

interface GeneratedConfig {
	name: string;
	path: string;
}

/**
 * After moving the rule to the new createLintRule API remove it from this list.
 */
const legacyRulesExclusionList = ['no-deprecated-apis', 'no-deprecated-imports'];
const ignoreList = ['index.codegen.tsx', 'TEMPLATE.md', '__tests__', 'utils'];
const ruleNameExceptionList = ['ensure-design-token-usage/preview'];
const srcDir = join(__dirname, '../src');
const rulesDir = join(srcDir, 'rules');
const presetsDir = join(srcDir, 'presets');
const generatedConfigs: GeneratedConfig[] = [];

/**
 * Get the path to, and file contents for, a rule's README.md file.
 */
async function ruleDocsPath(name: string) {
	const absolutePath = join(rulesDir, name, 'README.md');
	const relativePath = '.' + absolutePath.replace(process.cwd(), '');

	try {
		const file = await fs.readFile(absolutePath, 'utf-8');
		return { path: relativePath, file };
	} catch (_) {
		throw new Error(`invariant: rule ${name} should have docs at ${absolutePath}`);
	}
}

/**
 * Generates the preset config, eg. `src/presets/all.codegen.tsx` and `src/presets/recommended.codegen.tsx`
 */
async function generatePresetConfig(name: 'all' | 'recommended', rules: FoundRule[]) {
	const code = outdent`
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
							severity ?? (typeof recommended === 'string' ? String(recommended) : 'error');

						return `'@atlaskit/design-system/${rule.ruleName}': '${calculatedSeverity}'`;
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

/**
 * Write contents to a given file, creating a signed artifact if it's not a markdown file.
 */
async function writeFile(filepath: string, code: string) {
	await fs.writeFile(
		filepath,
		extname(filepath).includes('.md')
			? format(code, 'markdown')
			: createSignedArtifact(
					format(code, 'typescript'),
					'yarn workspace @atlaskit/eslint-plugin-design-system codegen',
				),
	);
}

/**
 * Generates the `src/rules/index.codegen.tsx` entrypoint, exporting all rules.
 */
async function generateRuleIndex(rules: FoundRule[]) {
	const code = outdent`
    ${rules
			.map((rule) => `import ${camelCase(rule.moduleName)} from './${rule.moduleName}'`)
			.join('\n')}

    export default {
    ${rules.map((rule) => `'${rule.ruleName}': ${camelCase(rule.moduleName)}`).join(',')}
    }
  `;

	const filepath = join(rulesDir, 'index.codegen.tsx');
	await writeFile(filepath, code);
}

/**
 * Generates the `src/index.codegen.tsx` entrypoint, exporting all the preset configs.
 */
async function generatePluginIndex() {
	const code = outdent`
    ${generatedConfigs.map((config) => `import ${config.name} from '${config.path}'`).join('\n')}

    export { default as rules } from './rules/index.codegen'

    export const configs = {
      ${generatedConfigs.map((config) => `${config.name}`).join(',')}
    }
  `;

	const filepath = join(srcDir, 'index.codegen.tsx');
	await writeFile(filepath, code);
}

const conditional = (cond: string, content?: boolean | string) => (content ? cond : '');
const optionallyLinkTo = (content: string, url?: string) =>
	url ? `<a href="${url}">${content}</a>` : content;

/**
 * Generate each individual rules' documentation pages, eg. `constellation/icon-label/usage.mdx`
 */
async function generateRulePages(rules: FoundRule[]): Promise<void> {
	const docsDir = join(srcDir, '../constellation');

	for await (const rule of rules) {
		const { file } = await ruleDocsPath(rule.moduleName);
		const ruleDir = join(docsDir, rule.moduleName);
		const destination = join(ruleDir, 'usage.mdx');

		await fs.mkdir(ruleDir, { recursive: true });

		if (file.match(/^# /)) {
			throw new Error(
				`invariant: ${rule.moduleName} README doc should not include a h1 heading as it is injected automatically.`,
			);
		}

		const ruleContent = outdent`
      # ${rule.ruleName}
      ${file}
    `;

		await writeFile(destination, ruleContent);
	}
}

/**
 * Generates the `RULE_TABLE_CODEGEN` in `constellation/index/usage.mdx` and `README.md`.
 * This is the list of all rules and their metadata.
 */
async function generateRuleTable(filepath: string, linkTo: 'docs' | 'repo', rules: FoundRule[]) {
	const file = await fs.readFile(filepath, 'utf-8');
	const rows: string[] = [];

	for (const rule of rules) {
		let docsPath = '';

		if (linkTo === 'repo') {
			const result = await ruleDocsPath(rule.moduleName);
			docsPath = result.path;
		} else {
			docsPath = `/components/eslint-plugin-design-system/${rule.moduleName}/usage`;
		}

		const link = optionallyLinkTo(rule.ruleName, docsPath);
		const description = rule.module.meta?.docs?.description || '';
		const recommended = conditional('Yes', rule.module.meta?.docs?.recommended);
		const fixable = conditional('Yes', rule.module.meta?.fixable);
		const suggestions = conditional('Yes', rule.module.meta?.hasSuggestions);

		rows.push(outdent`
      | ${link} | ${description} | ${recommended} | ${fixable} | ${suggestions} |
    `);
	}

	const code = outdent`
    | Rule | Description | Recommended | Fixable | Suggestions |
    | ---- | -- | -- | -- | -- |
    ${rows.join('\n')}
  `;

	const found = /<!-- START_RULE_TABLE_CODEGEN -->(.|\n)*<!-- END_RULE_TABLE_CODEGEN -->/.exec(
		file,
	);

	if (!found) {
		throw new Error('invariant: could not find the partial codegen section');
	}

	const updatedFile = file.replace(
		found[0],
		outdent`
      <!-- START_RULE_TABLE_CODEGEN -->
      <!-- @codegenCommand yarn workspace @atlaskit/eslint-plugin-design-system codegen -->
      ${code}
      <!-- END_RULE_TABLE_CODEGEN -->
    `,
	);

	await writeFile(filepath, updatedFile);
}

/**
 * Fetch all rules in `rules/*` and generate all associated contents.
 */
async function generate() {
	const rulePaths = await fs.readdir(rulesDir);
	const recommended: FoundRule[] = [];
	const rules: FoundRule[] = [];

	for (const filename of rulePaths) {
		if (ignoreList.includes(filename)) {
			continue;
		}

		const dirname = filename.replace(extname(filename), '');
		const filenameWithExt = filename.endsWith('.tsx') ? filename : join(filename, 'index.tsx');

		// default.default is bacause of the way esbuild-register exposes dynamically imported modules.
		const rule: LintRule = (await import(join(rulesDir, filenameWithExt))).default.default;

		const foundRule = {
			module: rule,
			moduleName: dirname,
			ruleName: rule.name || rule.meta.name,
		};

		if (typeof foundRule.ruleName === 'string') {
			// Exception list exists to support nested rules (e.g. ensure-design-token-usage/preview)
			if (!ruleNameExceptionList.includes(foundRule.ruleName)) {
				if (foundRule.moduleName !== foundRule.ruleName) {
					throw new Error(
						`invariant: module name ${foundRule.moduleName} does not match lint rule name ${foundRule.ruleName}`,
					);
				}
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
			foundRule.ruleName = foundRule.moduleName;
		}

		rules.push(foundRule);

		if (rule.meta?.docs?.recommended) {
			recommended.push(foundRule);
		}
	}

	// NOTE: Some of these could be awaited in parallel, but it's not worth the complexity for <1s diff.
	await generateRuleIndex(rules);
	await generatePresetConfig('all', rules);
	await generatePresetConfig('recommended', recommended);
	await generatePluginIndex();
	await generateRulePages(rules);
	await generateRuleTable(join(srcDir, '../README.md'), 'repo', rules);
	await generateRuleTable(join(srcDir, '../constellation/index/usage.mdx'), 'docs', rules);
}

generate();
