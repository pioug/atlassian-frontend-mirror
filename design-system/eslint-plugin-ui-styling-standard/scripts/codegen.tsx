import { existsSync } from 'fs';
import fs from 'fs/promises';
import { extname, join, relative } from 'path';

// @ts-expect-error - this isn't declared in the types
import { Legacy } from '@eslint/eslintrc';
import type { Linter } from 'eslint';
import camelCase from 'lodash/camelCase';
import outdent from 'outdent';

import format from '@af/formatting/sync';
import { getPathSafeName, type LintRule } from '@atlaskit/eslint-utils/create-rule';
import { createSignedArtifact } from '@atlassian/codegen';

import { type ExternalRuleMeta, externalRules } from '../src/rules/external-rules';

const { naming }: { naming: ESLintRCNaming } = Legacy;

const packagePluginName = '@atlaskit/eslint-plugin-ui-styling-standard';
const pluginName = '@atlaskit/ui-styling-standard';
const pluginPath = 'eslint-plugin-ui-styling-standard';
const codegenCommand = `yarn workspace ${packagePluginName} codegen`;

interface FoundRule {
	module: LintRule | { meta: ExternalRuleMeta };
	/**
	 * This is used for the directory name, import path, and urls
	 */
	pathSafeName: string;
	/**
	 *  Friendly name that can include special characters
	 */
	ruleName: string;
}

/**
 * A rule that is externally referenced and distributed via dependencies rather than local.
 * These come from `rules/external-rules.tsx`
 */
interface ExternalRule extends FoundRule {
	module: { meta: ExternalRuleMeta };
}
interface InternalRule extends FoundRule {
	module: LintRule;
}

interface GeneratedConfig {
	name: string;
	path: string;
	flatPath: string;
}

const ignoreList = ['index.codegen.tsx', 'TEMPLATE.md', '__tests__', 'utils', 'external-rules.tsx'];
const srcDir = join(__dirname, '../src');
const rulesDir = join(srcDir, 'rules');
const presetsDir = join(srcDir, 'presets');
const generatedConfigs: GeneratedConfig[] = [];

function ruleIsExternal(rule: FoundRule | ExternalRule): rule is ExternalRule {
	return 'isExternal' in rule.module.meta && !!rule.module.meta.isExternal;
}
function ruleIsInternal(rule: FoundRule | ExternalRule): rule is InternalRule {
	return !ruleIsExternal(rule);
}

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
	const externalScopes = externalRules.flatMap((rule) => {
		const groups = rule.name.split('/');
		if (groups.length > 1) {
			// Take the first part of the name, eg. `@atlaskit/design-system` and wrap it in quotes to be
			return groups.slice(0, groups.length - 1).join('/');
		}

		return [];
	});

	// // NOTE: Given we have external plugins, we must include them as plugins as well./
	// const pluginList = [`'${pluginName}'`, ...Array.from(new Set(externalScopes))];

	const externalPlugins = Array.from(new Set([...externalScopes])).map((externalScope) => ({
		name: naming.getShorthandName(externalScope, 'eslint-plugin'),
		specifier: naming.normalizePackageName(externalScope, 'eslint-plugin'),
		identifier: `${camelCase(naming.getShorthandName(externalScope, 'eslint-plugin'))}Plugin`,
	}));

	const ruleConfig = rules.reduce<Linter.RulesRecord>((rulesRecord, rule) => {
		if (rule.module.meta?.docs?.removeFromPresets !== true) {
			const { severity, recommended, pluginConfig } = rule.module.meta?.docs || {};

			// `recommended` is a snowflake at this stage ... it can be a string at runtime
			// because of legacy `import { createRule } from 'utils/create-rule'` so we take
			// into account this possibility (as a fallback) until everything is moved over
			// to the new syntax
			const calculatedSeverity =
				severity ?? (typeof recommended === 'string' ? String(recommended) : 'error');

			const ruleName = ruleIsInternal(rule) ? `${pluginName}/${rule.ruleName}` : rule.ruleName;

			rulesRecord[ruleName] =
				typeof pluginConfig === 'object' && pluginConfig
					? [calculatedSeverity, pluginConfig]
					: calculatedSeverity;
		}

		return rulesRecord;
	}, {});

	const legacyCode = format(
		`
import type { ESLint } from "eslint";

const config: ESLint.ConfigData = ${JSON.stringify(
			{
				plugins: [pluginName, ...Array.from(externalPlugins.map((p) => p.name))],
				rules: ruleConfig,
			},
			null,
			2,
		)};

export default config;`,
		'typescript',
	);

	const flatCode = format(
		`

		${externalPlugins
			.map(
				(plugin) => `import type { Linter } from 'eslint';

import * as ${plugin.identifier} from '${plugin.specifier}';`,
			)
			.join('\n')}

const config: Linter.FlatConfig = {
		plugins: {
				// NOTE: The reference to this plugin is inserted dynamically while creating the plugin in \`index.codegen.tsx\`
				${externalPlugins.map((plugin) => `'${plugin.name}': ${plugin.identifier}`).join(',\n')}
		},
		rules: ${JSON.stringify(ruleConfig, null, 2)},
		};

export default config;`,
		'typescript',
	);

	await writeFile(join(presetsDir, `${name}-flat.codegen.tsx`), flatCode);
	await writeFile(join(presetsDir, `${name}.codegen.tsx`), legacyCode);

	generatedConfigs.push({
		name: camelCase(name),
		path: './' + relative(srcDir, join(presetsDir, `${name}.codegen`)),
		flatPath: './' + relative(srcDir, join(presetsDir, `${name}-flat.codegen`)),
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
			: createSignedArtifact(format(code, 'typescript'), codegenCommand),
	);
}

/**
 * Generates the `src/rules/index.codegen.tsx` entrypoint, exporting all rules.
 */
async function generateRuleIndex(rules: FoundRule[]) {
	const internalRules = rules.filter(ruleIsInternal);

	const code = outdent`
import type { Rule } from 'eslint';

    ${internalRules
			.map((rule) => `import ${camelCase(rule.pathSafeName)} from './${rule.pathSafeName}'`)
			.join('\n')}

    export const rules: Record<string, Rule.RuleModule> = {
    ${internalRules.map((rule) => `'${rule.ruleName}': ${camelCase(rule.pathSafeName)}`).join(',')}
    }
  `;

	await writeFile(join(srcDir, 'rules/index.codegen.tsx'), code);
}

/**
 * Generates the `src/index.codegen.tsx` entrypoint, exporting all the preset configs.
 */
async function generatePluginIndex() {
	const code = format(
		`
import type { ESLint } from 'eslint';

	${generatedConfigs
		.flatMap((config) => [
			`import ${config.name}Flat from '${config.flatPath}';`,
			`import ${config.name} from '${config.path}';`,
		])
		.join('\n')}
		import { rules } from './rules/index.codegen';

		// this uses require because not all node versions this package supports use the same import assertions/attributes
		// eslint-disable-next-line import/no-extraneous-dependencies
		const pkgJson = require('${packagePluginName}/package.json');

		const { version, name }: { name: string; version: string; } = pkgJson;

		export const plugin: ESLint.Plugin = {
			meta: {
				name,
				version,
			},
			rules,
			// flat configs need to be done like this so they can get a reference to the plugin.
			// see here: https://eslint.org/docs/latest/extend/plugins#configs-in-plugins
			// they cannot use \`Object.assign\` because it will not work with the getter
			configs: {
				${generatedConfigs
					.flatMap(
						(config) => `${config.name}, 'flat/${config.name}': {
							...${config.name}Flat,
							plugins: {
								...${config.name}Flat.plugins,
								get '${pluginName}'() {
									return plugin;
								}
							}
						}`,
					)
					.join(',')}
			},
		} as const;

		export { rules } from './rules/index.codegen';
		export const configs: ESLint.Plugin['configs'] = plugin.configs;
		export const meta: ESLint.Plugin['meta'] = plugin.meta;

		export default plugin;

  `,
		'typescript',
	);

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
		const ruleDir = join(docsDir, rule.pathSafeName);
		const destination = join(ruleDir, 'usage.mdx');
		await fs.mkdir(ruleDir, { recursive: true });

		if (ruleIsExternal(rule)) {
			await generateExternalRulePage(rule, destination);
		} else if (ruleIsInternal(rule)) {
			await generateInternalRulePage(rule, destination);
		} else {
			throw new Error(`invariant: found an unexpected rule type ${rule.ruleName}`);
		}
	}
}

async function generateExternalRulePage(rule: ExternalRule, destination: string) {
	if (existsSync(destination)) {
		return true;
	}

	const ruleContent = outdent`
      # ${rule.ruleName}
      ${rule.module.meta?.docs?.description || ''}

      ${
				rule.module.meta?.docs?.externalUrl
					? `This rule is maintained by another package and configured here; refer to ${rule.module.meta.docs.externalUrl} for more details.`
					: ''
			}
    `;

	await writeFile(destination, ruleContent);
}

async function generateInternalRulePage(rule: InternalRule, destination: string) {
	const { file } = await ruleDocsPath(rule.pathSafeName);
	if (file.match(/^# /)) {
		throw new Error(
			`invariant: ${rule.pathSafeName} README doc should not include a h1 heading as it is injected automatically.`,
		);
	}

	const ruleContent = outdent`
      # ${rule.ruleName}
      ${file}
    `;

	await writeFile(destination, ruleContent);
}

/**
 * Generates the `RULE_TABLE_CODEGEN` in `constellation/index/usage.mdx` and `README.md`.
 * This is the list of all rules and their metadata.
 */
async function generateRuleTable(filepath: string, linkTo: 'docs' | 'repo', rules: FoundRule[]) {
	const file = await fs.readFile(filepath, 'utf-8');
	const rows: string[] = [];

	for (const rule of rules) {
		let docsPath: string | undefined;

		if (linkTo === 'docs') {
			docsPath = `/components/${pluginPath}/${rule.pathSafeName}/usage`;
		} else if (ruleIsInternal(rule)) {
			const result = await ruleDocsPath(rule.pathSafeName);
			docsPath = result.path;
		} else {
			docsPath = rule.module.meta?.docs?.url;
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
		throw new Error(`invariant: could not find the partial codegen section in ${filepath}`);
	}

	const updatedFile = file.replace(
		found[0],
		outdent`
      <!-- START_RULE_TABLE_CODEGEN -->
      <!-- @codegenCommand ${codegenCommand} -->
      ${code}
      <!-- END_RULE_TABLE_CODEGEN -->
    `,
	);

	await writeFile(filepath, updatedFile);
}

const validateInternalRule = (rule: InternalRule) => {
	if (typeof rule.ruleName !== 'string' || !rule.ruleName) {
		throw new Error(
			`invariant: The ${rule.pathSafeName} rule must use the createLintRule() function`,
		);
	}

	if (ruleIsInternal(rule) && rule.pathSafeName !== rule.ruleName) {
		throw new Error(
			`invariant: module name ${rule.pathSafeName} does not match lint rule name ${rule.ruleName}`,
		);
	}

	if (rule.pathSafeName.includes('@') || rule.pathSafeName.includes('/')) {
		throw new Error(`invariant: name ${rule.pathSafeName} is not valid, specify a path-safe name`);
	}
};

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

		const rule: LintRule = (await import(join(rulesDir, filenameWithExt))).default;

		const foundRule: InternalRule = {
			module: rule,
			pathSafeName: dirname,
			ruleName: rule.name || rule.meta.name,
		};

		validateInternalRule(foundRule);

		rules.push(foundRule);
	}

	for (const rule of externalRules) {
		const foundRule: ExternalRule = {
			module: { meta: rule },
			pathSafeName: rule.displayName || getPathSafeName(rule.name),
			ruleName: rule.name,
		};

		// We don't validate these; types should do their job instead.
		rules.push(foundRule);
	}

	rules.forEach((rule) => {
		if (rule.module.meta?.docs?.recommended) {
			recommended.push(rule);
		}
	});

	// NOTE: Some of these could be awaited in parallel, but it's not worth the complexity for <1s diff.
	await generateRuleIndex(rules);
	await generatePresetConfig('all', rules);
	await generatePresetConfig('recommended', recommended);
	await generatePluginIndex();
	await generateRulePages(rules);
	await generateRuleTable(join(srcDir, '../README.md'), 'repo', rules);
	await generateRuleTable(join(srcDir, '../constellation/index/overview.mdx'), 'docs', rules);
}

generate();

/**
 * These are taken from here:
 * https://github.com/eslint/eslintrc/blob/fc9837d3c4eb6c8c97bd5594fb72ea95b6e32ab8/lib/shared/naming.js
 */
interface ESLintRCNaming {
	/**
	 * Brings package name to correct format based on prefix
	 * @param name The name of the package.
	 * @param prefix Can be either "eslint-plugin", "eslint-config" or "eslint-formatter"
	 * @returns Normalized name of the package
	 */
	normalizePackageName(name: string, prefix: string): string;

	/**
	 * Removes the prefix from a fullname.
	 * @param fullname The term which may have the prefix.
	 * @param prefix The prefix to remove.
	 * @returns The term without prefix.
	 */
	getShorthandName(fullname: string, prefix: string): string;
}
