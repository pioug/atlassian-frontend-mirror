import j from 'jscodeshift';

import { getFunctionArgumentAtPos } from '../../utils/get-function-argument-at-pos';

describe('getFunctionArgumentAtPos', () => {
  it('captures references to the first argument given to the css function call', () => {
    const root = j(`const paddingStyles = css({ padding: '8px' });`);

    const result = getFunctionArgumentAtPos(
      {
        node: root.find(j.VariableDeclarator).get().value,
      } as Parameters<typeof getFunctionArgumentAtPos>[0],
      0,
    );

    expect(result).toBeDefined();
  });

  it('skips if parsing something else', () => {
    const root = j(`const paddingStyles = css({ padding: '8px' });`);

    const result = getFunctionArgumentAtPos(
      {
        node: root.find(j.ObjectExpression).get().value,
      } as Parameters<typeof getFunctionArgumentAtPos>[0],
      0,
    );

    expect(result).toBeUndefined();
  });

  it('skips if css function call has no arguments', () => {
    const root = j(`const paddingStyles = css();`);

    const result = getFunctionArgumentAtPos(
      {
        node: root.find(j.VariableDeclarator).get().value,
      } as Parameters<typeof getFunctionArgumentAtPos>[0],
      0,
    );

    expect(result).toBeUndefined();
  });
});
