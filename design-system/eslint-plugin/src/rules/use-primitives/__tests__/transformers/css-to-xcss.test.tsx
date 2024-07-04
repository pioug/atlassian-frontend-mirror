import { type Rule } from 'eslint';
import * as eslintCodemodUtils from 'eslint-codemod-utils';
import j from 'jscodeshift';

import { cssToXcssTransformer, styledObjectToXcssTokens } from '../../transformers/css-to-xcss';
import * as utils from '../../utils';

jest.mock('eslint-codemod-utils', () => ({
	__esModule: true,
	...jest.requireActual('eslint-codemod-utils'),
	getIdentifierInParentScope: jest.fn(),
}));
jest.mock('../../utils', () => ({
	__esModule: true,
	...jest.requireActual('../../utils'),
	getVariableDefinitionValue: jest.fn(),
}));

const dummyContext = {
	getScope: jest.fn(),
} as any as Rule.RuleContext;
const mockFixer = {
	replaceText: jest.fn(),
} as any as Rule.RuleFixer;

describe('cssToXcssTransformer', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		jest.mocked(eslintCodemodUtils.getIdentifierInParentScope).mockReturnValue(null);
	});

	it('transforms a simple example', () => {
		// ARRANGE
		const root = j(
			`
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <div css={paddingStyles}></div>
      `,
		);
		jest.mocked(utils.getVariableDefinitionValue).mockReturnValue({
			node: root.find(j.VariableDeclarator).get().value,
		} as ReturnType<typeof utils.getVariableDefinitionValue>);

		// ACT
		const result = cssToXcssTransformer(
			root.find(j.JSXElement).get().value,
			dummyContext,
			mockFixer,
		);

		// ASSERT
		expect(result).toHaveLength(2);
		expect(mockFixer.replaceText).toHaveBeenCalledTimes(2);

		// replaces `css` function call with `xcss`
		expect(mockFixer.replaceText).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({ name: 'css' }),
			'xcss',
		);
		// replaces pixel values with tokens
		expect(mockFixer.replaceText).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({ value: '8px' }),
			"'space.100'",
		);
	});

	it('transforms negative spacing tokens', () => {
		// ARRANGE
		const root = j(
			`
      import { css } from '@emotion/react';
      const marginStyles = css({ margin: '-8px' });
      <div css={marginStyles}></div>
      `,
		);
		jest.mocked(utils.getVariableDefinitionValue).mockReturnValue({
			node: root.find(j.VariableDeclarator).get().value,
		} as ReturnType<typeof utils.getVariableDefinitionValue>);

		// ACT
		const result = cssToXcssTransformer(
			root.find(j.JSXElement).get().value,
			dummyContext,
			mockFixer,
		);

		// ASSERT
		expect(result).toHaveLength(2);
		expect(mockFixer.replaceText).toHaveBeenCalledTimes(2);

		// replaces `css` function call with `xcss`
		expect(mockFixer.replaceText).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({ name: 'css' }),
			'xcss',
		);
		// replaces pixel values with tokens
		expect(mockFixer.replaceText).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({ value: '-8px' }),
			"'space.negative.100'",
		);
	});

	it('does not transform negative spacing tokens on unsupported properties', () => {
		// ARRANGE
		const root = j(
			`
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '-8px' });
      <div css={paddingStyles}></div>
      `,
		);
		jest.mocked(utils.getVariableDefinitionValue).mockReturnValue({
			node: root.find(j.VariableDeclarator).get().value,
		} as ReturnType<typeof utils.getVariableDefinitionValue>);

		// ACT
		const result = cssToXcssTransformer(
			root.find(j.JSXElement).get().value,
			dummyContext,
			mockFixer,
		);

		// ASSERT
		expect(result).toHaveLength(2);
		expect(mockFixer.replaceText).toHaveBeenCalledTimes(2);

		// replaces `css` function call with `xcss`
		expect(mockFixer.replaceText).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({ name: 'css' }),
			'xcss',
		);
		// replaces pixel values with tokens
		expect(mockFixer.replaceText).not.toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({ value: '-8px' }),
			"'space.negative.100'",
		);
	});
});

describe('styledObjectToXcssTokens', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('transforms a simple example', () => {
		// ARRANGE
		const root = j(
			`
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <div css={paddingStyles}></div>
      `,
		);
		jest.mocked(utils.getVariableDefinitionValue).mockReturnValue({
			node: root.find(j.VariableDeclarator).get().value,
		} as ReturnType<typeof utils.getVariableDefinitionValue>);

		// ACT
		const result = styledObjectToXcssTokens(root.find(j.ObjectExpression).get().value, mockFixer);

		// ASSERT
		expect(result).toHaveLength(1);
		expect(mockFixer.replaceText).toHaveBeenCalledTimes(1);

		// replaces pixel values with tokens
		expect(mockFixer.replaceText).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({ value: '8px' }),
			"'space.100'",
		);
	});
});
