import { readFileSync } from 'fs';
import { join } from 'path';

import { Linter } from 'eslint';

import noHtmlAnchor from '../no-html-anchor';
import noHtmlButton from '../no-html-button';
import noHtmlCheckbox from '../no-html-checkbox';
import noHtmlCode from '../no-html-code';
import noHtmlHeading from '../no-html-heading';
import noHtmlImage from '../no-html-image';
import noHtmlRadio from '../no-html-radio';
import noHtmlRange from '../no-html-range';
import noHtmlSelect from '../no-html-select';
import noHtmlTextInput from '../no-html-text-input';
import noHtmlTextarea from '../no-html-textarea';
import noInvalidCssMap from '../no-invalid-css-map';
import noUnsafeDesignTokenUsage from '../no-unsafe-design-token-usage';

const linter = new Linter();
linter.defineRule('no-invalid-css-map', noInvalidCssMap);
linter.defineRule('no-unsafe-design-token-usage', noUnsafeDesignTokenUsage);

const config: Linter.Config = {
	parserOptions: { ecmaVersion: 2020, sourceType: 'module', ecmaFeatures: { jsx: true } },
	rules: { 'no-invalid-css-map': 'error', 'no-unsafe-design-token-usage': 'error' },
};

test.each([
	['shape tokens', 'use-tokens-shape', '### Correct', 'See the available'],
	[
		'cssMap variants',
		'consistent-css-prop-usage',
		'**Technically correct usage',
		'**Create composite',
	],
])(
	'%s recovery examples parse and use valid tokens and static styles',
	(_name, rule, start, end) => {
		const readme = readFileSync(join(__dirname, '..', rule, 'README.md'), 'utf8');
		const section = readme.split(start)[1].split(end)[0];
		const snippets = Array.from(
			section.matchAll(/```(?:js|jsx)\n([\s\S]*?)```/g),
			(match) => match[1],
		);
		expect(snippets).toHaveLength(1);
		for (const snippet of snippets) {
			expect(linter.verify(snippet, config)).toEqual([]);
		}
	},
);

const componentRules = {
	'no-html-anchor': noHtmlAnchor,
	'no-html-button': noHtmlButton,
	'no-html-checkbox': noHtmlCheckbox,
	'no-html-code': noHtmlCode,
	'no-html-heading': noHtmlHeading,
	'no-html-image': noHtmlImage,
	'no-html-radio': noHtmlRadio,
	'no-html-range': noHtmlRange,
	'no-html-select': noHtmlSelect,
	'no-html-text-input': noHtmlTextInput,
	'no-html-textarea': noHtmlTextarea,
};
const componentLinter = new Linter();
componentLinter.defineRules(componentRules);
const componentConfig: Linter.Config = {
	parserOptions: config.parserOptions,
	rules: Object.fromEntries(Object.keys(componentRules).map((name) => [name, 'error' as const])),
};

test.each(Object.keys(componentRules))(
	'%s recovery examples parse and satisfy the component rules',
	(rule) => {
		const readme = readFileSync(join(__dirname, '..', rule, 'README.md'), 'utf8');
		const section = readme.split('### Correct')[1];
		const snippets = Array.from(section.matchAll(/```jsx\n([\s\S]*?)```/g), (match) => match[1]);
		expect(snippets).toHaveLength(1);
		for (const snippet of snippets) {
			expect(componentLinter.verify(snippet, componentConfig)).toEqual([]);
		}
	},
);

test('the component example checks still reject a native text input', () => {
	expect(componentLinter.verify('<input type="text" />;', componentConfig)).toEqual([
		expect.objectContaining({ ruleId: 'no-html-text-input' }),
	]);
});
