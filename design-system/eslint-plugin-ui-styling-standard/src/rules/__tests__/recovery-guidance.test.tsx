import { readFileSync } from 'fs';
import { join } from 'path';

import { Linter } from 'eslint';

import noStyled from '../no-styled';
import useCompiled from '../use-compiled';

const linter = new Linter();
linter.defineRule('no-styled', noStyled);
linter.defineRule('use-compiled', useCompiled);

const config: Linter.Config = {
	parserOptions: { ecmaVersion: 2020, sourceType: 'module', ecmaFeatures: { jsx: true } },
	rules: { 'no-styled': 'error', 'use-compiled': 'error' },
};

const readme = readFileSync(join(__dirname, '../no-styled/README.md'), 'utf8');
const correctExamples = readme.split('### Correct')[1].split('## FAQ')[0];
const snippets = Array.from(
	correctExamples.matchAll(/```tsx\n([\s\S]*?)```/g),
	(match) => match[1],
);

test('no-styled recovery examples use supported styling engines', () => {
	expect(snippets).toHaveLength(2);
	for (const snippet of snippets) {
		expect(linter.verify(snippet, config)).toEqual([]);
	}
});

test('the previous Emotion recovery example is rejected by the engine migration rule', () => {
	const errors = linter.verify(
		"import { css } from '@emotion/react'; const styles = css({ color: 'red' });",
		config,
	);
	expect(errors).toEqual([
		expect.objectContaining({ ruleId: 'use-compiled', messageId: 'use-compiled' }),
	]);
});
