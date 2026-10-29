import { readFileSync } from 'fs';
import { join } from 'path';

import { Linter } from 'eslint';

import noPlaceholder from '../no-placeholder';
import useSimpleForm from '../use-simple-form';

const linter = new Linter();
linter.defineRules({ 'no-placeholder': noPlaceholder, 'use-simple-form': useSimpleForm });
const config: Linter.Config = {
	parserOptions: { ecmaVersion: 2020, sourceType: 'module', ecmaFeatures: { jsx: true } },
	rules: { 'no-placeholder': 'error', 'use-simple-form': 'error' },
};

test.each(['no-placeholder', 'use-simple-form'])(
	'%s examples reproduce the violation and pass after recovery',
	(name) => {
		const readme = readFileSync(join(__dirname, '..', name, 'README.md'), 'utf8');
		const incorrect = readme.split('## Incorrect')[1].split('## Correct')[0];
		const correct = readme.split('## Correct')[1];
		const snippets = (section: string) =>
			Array.from(section.matchAll(/```jsx\n([\s\S]*?)```/g), (match) => match[1]);
		expect(snippets(incorrect).length).toBeGreaterThan(0);
		for (const snippet of snippets(incorrect)) {
			expect(linter.verify(snippet, config)).toEqual([expect.objectContaining({ ruleId: name })]);
		}
		expect(snippets(correct).length).toBeGreaterThan(0);
		for (const snippet of snippets(correct)) {
			expect(linter.verify(snippet, config)).toEqual([]);
		}
	},
);
