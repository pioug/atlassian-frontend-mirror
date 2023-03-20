import { AST } from 'refractor';

import getInlineLineNumber from '../../lib/process/get-inline-line-number';

describe('getInlineLineNumber', () => {
  it('should return an inline line number containing default properties', () => {
    const inlineLineNumber = getInlineLineNumber(1) as AST.Element;

    expect(inlineLineNumber).toEqual(
      expect.objectContaining({
        type: 'element',
        tagName: 'span',
      }),
    );
    expect(inlineLineNumber.children).toEqual([]);
    expect(inlineLineNumber.properties['data-ds--line-number']).toEqual(1);
    expect(inlineLineNumber.properties.className).toEqual([
      'comment',
      'linenumber',
      'ds-line-number',
    ]);
  });

  it('should apply passed lineNumber to properties key and children value', () => {
    const inlineLineNumber = getInlineLineNumber(5) as AST.Element;
    expect(inlineLineNumber.properties.key).toEqual('line-number--5');
    expect(inlineLineNumber.properties['data-ds--line-number']).toEqual(5);
  });
});
