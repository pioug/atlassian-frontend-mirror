import j from 'jscodeshift';

import { getAttributeValueIdentifier } from '../../utils/get-attribute-value-identifier';

describe('getAttributeValueIdentifier', () => {
  it('captures single and direct variable reference', () => {
    const root = j(`<Component css={variableName} />`);

    const result = getAttributeValueIdentifier(
      root.find(j.JSXAttribute).get().value,
    );

    expect(result).toEqual('variableName');
  });

  it('skips if multiple styles are provided', () => {
    const root = j(`<Component css={[oneStyles, twoStyles]} />`);

    const result = getAttributeValueIdentifier(
      root.find(j.JSXAttribute).get().value,
    );

    expect(result).toBeUndefined();
  });

  it('skips if spread syntax is used', () => {
    const root = j(`<Component css={{...myStyles}} />`);

    const result = getAttributeValueIdentifier(
      root.find(j.JSXAttribute).get().value,
    );

    expect(result).toBeUndefined();
  });

  it('skips mapped styles', () => {
    const root = j(`<Component css={mapStyles.default} />`);

    const result = getAttributeValueIdentifier(
      root.find(j.JSXAttribute).get().value,
    );

    expect(result).toBeUndefined();
  });

  it('skips inline styles', () => {
    const root = j(`<Component css={css({ padding: '8px' })} />`);

    const result = getAttributeValueIdentifier(
      root.find(j.JSXAttribute).get().value,
    );

    expect(result).toBeUndefined();
  });

  it('skips empty styles', () => {
    const root = j(`<Component css={""} />`);

    const result = getAttributeValueIdentifier(
      root.find(j.JSXAttribute).get().value,
    );

    expect(result).toBeUndefined();
  });
});
