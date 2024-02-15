import j from 'jscodeshift';

import { containsOnlySupportedAttrs } from '../../../transformers/emotion-css/contains-only-supported-attrs';

describe('containsOnlySupportedAttrs', () => {
  it('accepts when `css` is the only prop present', () => {
    const root = j(`(<Component css={myStyles} />)`);

    const result = containsOnlySupportedAttrs(
      root.find(j.JSXElement).get().value,
    );

    expect(result).toEqual(true);
  });

  it('accepts when component takes no props', () => {
    const root = j(`(<Component />)`);

    const result = containsOnlySupportedAttrs(
      root.find(j.JSXElement).get().value,
    );

    expect(result).toEqual(true);
  });

  it('rejects when component takes extra props', () => {
    const root = j(`(<Component id="test" />)`);

    const result = containsOnlySupportedAttrs(
      root.find(j.JSXElement).get().value,
    );

    expect(result).toEqual(false);
  });
});
