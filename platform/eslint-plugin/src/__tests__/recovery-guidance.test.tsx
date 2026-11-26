import { readFileSync } from 'fs';
import { join } from 'path';

import { Linter } from 'eslint';

import legacyFlags from '../rules/no-invalid-feature-flag-usage';

const linter = new Linter();
const ruleId = 'legacy-flags';
linter.defineRule(ruleId, legacyFlags);
const config: Linter.Config = {
	parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
	rules: { [ruleId]: 'error' },
};

test('the no-invalid-feature-flag-usage recovery example fails before repair and passes after', () => {
	const readme = readFileSync(
		join(__dirname, '../rules/no-invalid-feature-flag-usage/README.md'),
		'utf8',
	);
	const incorrect = readme.split('## Incorrect')[1].split('## Correct')[0];
	const correct = readme.split('## Correct')[1];
	const snippets = (section: string) =>
		Array.from(section.matchAll(/```js\n([\s\S]*?)```/g), (match) => match[1]);
	expect(snippets(incorrect)).toHaveLength(1);
	expect(snippets(correct)).toHaveLength(1);
	expect(linter.verify(snippets(incorrect)[0], config)).toEqual([
		expect.objectContaining({ ruleId }),
	]);
	expect(linter.verify(snippets(correct)[0], config)).toEqual([]);
});
