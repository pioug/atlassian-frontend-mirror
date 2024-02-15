import type { Rule } from 'eslint';
import j from 'jscodeshift';

import { CompiledStyled } from '../../../transformers';

jest.mock('eslint-codemod-utils', () => ({
  __esModule: true,
  ...jest.requireActual('eslint-codemod-utils'),
  getIdentifierInParentScope: jest.fn(),
}));

const dummyContext = {
  getScope: jest.fn(),
  getSourceCode: () => ({ ast: { body: [] } }),
} as any as Rule.RuleContext;
const mockFixer = {
  replaceText: jest.fn(),
  insertTextAfter: jest.fn(),
  insertTextBefore: jest.fn(),
} as any as Rule.RuleFixer;

describe('CompiledStyled', () => {
  describe('_fix', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('transforms a simple example', () => {
      // ARRANGE
      const root = j(
        `
      import { styled } from '@compiled/react';
      const MyContainer = styled.div({ padding: '8px' });
      <MyContainer>Hello, World!</MyContainer>
      `,
      );

      // ACT
      const jsxElement = root.find(j.JSXElement).get().value;
      CompiledStyled._fix(
        {
          styles: root.find(j.VariableDeclarator).get().value,
          jsxElement,
        },
        dummyContext,
      )(mockFixer);

      // ASSERT
      expect(mockFixer.replaceText).toHaveBeenCalledTimes(5);
      expect(mockFixer.insertTextAfter).toHaveBeenCalledTimes(1);

      // replaces `css` function call with `xcss`, also renaming the receiving variable
      expect(mockFixer.replaceText).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ name: 'MyContainer' }),
        'myContainerStyles',
      );
      expect(mockFixer.replaceText).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          object: expect.objectContaining({ name: 'styled' }),
          property: expect.objectContaining({ name: 'div' }),
        }),
        'xcss',
      );

      // replaces pixel values with tokens
      expect(mockFixer.replaceText).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({ value: '8px' }),
        "'space.100'",
      );

      // replaces component name with Box
      expect(mockFixer.replaceText).toHaveBeenNthCalledWith(
        4,
        expect.objectContaining({ name: 'MyContainer' }),
        'Box',
      );

      // adds `xcss` prop
      expect(mockFixer.insertTextAfter).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ name: 'MyContainer' }),
        ' xcss={myContainerStyles}',
      );
    });

    it('transforms a tokenised example', () => {
      // ARRANGE
      const root = j(
        `
      import { styled } from '@compiled/react';
      const MyContainer = styled.div({ padding: token('space.100', '8px') });
      <MyContainer>Hello, World!</MyContainer>
      `,
      );

      // ACT
      const jsxElement = root.find(j.JSXElement).get().value;
      CompiledStyled._fix(
        {
          styles: root.find(j.VariableDeclarator).get().value,
          jsxElement,
        },
        dummyContext,
      )(mockFixer);

      // ASSERT
      expect(mockFixer.replaceText).toHaveBeenCalledTimes(5);
      expect(mockFixer.insertTextAfter).toHaveBeenCalledTimes(1);

      // replaces `css` function call with `xcss`, also renaming the receiving variable
      expect(mockFixer.replaceText).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ name: 'MyContainer' }),
        'myContainerStyles',
      );
      expect(mockFixer.replaceText).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          object: expect.objectContaining({ name: 'styled' }),
          property: expect.objectContaining({ name: 'div' }),
        }),
        'xcss',
      );

      // replaces pixel values with tokens
      expect(mockFixer.replaceText).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          callee: expect.objectContaining({ name: 'token' }),
          arguments: expect.arrayContaining([
            expect.objectContaining({ value: 'space.100' }),
          ]),
        }),
        "'space.100'",
      );

      // replaces component name with Box
      expect(mockFixer.replaceText).toHaveBeenNthCalledWith(
        4,
        expect.objectContaining({ name: 'MyContainer' }),
        'Box',
      );

      // adds `xcss` prop
      expect(mockFixer.insertTextAfter).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ name: 'MyContainer' }),
        ' xcss={myContainerStyles}',
      );
    });
  });
});
