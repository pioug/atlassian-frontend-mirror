import j from 'jscodeshift';

import { findValidStyledComponentCall } from '../../../transformers/compiled-styled/find-valid-styled-component-call';

describe('findValidStyledComponentCall', () => {
  it('returns reference to a suitable styled component', () => {
    // ARRANGE
    const root = j(`const MyContainer = styled.div({ padding: '8px' });`);
    const node = root.find(j.CallExpression).get().value;
    node.parent = root.find(j.VariableDeclarator).get().value;

    // ACT
    const result = findValidStyledComponentCall(node);

    // ASSERT
    expect(result).toBeDefined();
  });

  ['styled3', 'someStyled'].map((o) =>
    it(`skips if object used is not styled or styled2 (test for: ${o})`, () => {
      // ARRANGE
      const root = j(`const MyContainer = ${o}.div({ padding: '8px' });`);
      const node = root.find(j.CallExpression).get().value;
      node.parent = root.find(j.VariableDeclarator).get().value;

      // ACT
      const result = findValidStyledComponentCall(node);

      // ASSERT
      expect(result).toBeUndefined();
    }),
  );

  it('skips if styled component is being exported', () => {
    // ARRANGE
    const root = j(
      `export const MyContainer = styled.div({ padding: '8px' });`,
    );
    const node = root.find(j.CallExpression).get().value;
    const parent = root.find(j.VariableDeclarator).get().value;
    parent.parent = root.find(j.ExportNamedDeclaration).get().value;
    node.parent = parent;

    // ACT
    const result = findValidStyledComponentCall(node);

    // ASSERT
    expect(result).toBeUndefined();
  });
});
