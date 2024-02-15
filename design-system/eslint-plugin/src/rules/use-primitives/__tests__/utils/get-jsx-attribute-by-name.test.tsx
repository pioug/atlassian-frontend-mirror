import j from 'jscodeshift';

import { getJSXAttributeByName } from '../../utils/get-jsx-attribute-by-name';

describe('getJSXAttributeByName', () => {
  it('finds basic form', () => {
    const root = j(`(<Component css={myStyles} />)`);

    const result = getJSXAttributeByName(
      root.find(j.JSXOpeningElement).get().value,
      'css',
    );

    expect(result).toBeDefined();
  });

  it('ignores a variable spread with the same name', () => {
    const root = j(`(<Component {...css} />)`);

    const result = getJSXAttributeByName(
      root.find(j.JSXOpeningElement).get().value,
      'css',
    );

    expect(result).toBeUndefined();
  });
});
