import { type RefractorNode } from '../../types';

export default function getInlineLineNumber(lineNumber: number): RefractorNode {
  return {
    type: 'element',
    tagName: 'span',
    properties: {
      key: `line-number--${lineNumber}`,
      className: ['comment', 'linenumber', 'ds-line-number'],
      // We're placing the lineNumber in a data-attr on an empty span (hence the
      // empty children array below). This allows CodeBlock to use CSS to
      // generate the content in a pseudo-element, which is a fix for a bug
      // where line numbers were being copied (CSS content can't be copied)
      // https://product-fabric.atlassian.net/browse/DSP-2729
      'data-ds--line-number': lineNumber,
    },
    children: [],
  };
}
