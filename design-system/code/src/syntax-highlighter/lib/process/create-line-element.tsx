import { AST, RefractorNode, SyntaxHighlighterLineProps } from '../../types';

import getInlineLineNumber from './get-inline-line-number';

export type CreateLineElementProps = {
  children: RefractorNode[];
  lineNumber: number;
  // eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
  showLineNumbers?: boolean;
  lineProps?: SyntaxHighlighterLineProps;
  className?: string[];
};

export default function createLineElement({
  children,
  lineNumber,
  showLineNumbers,
  lineProps = {},
  className = [],
}: CreateLineElementProps): AST.Element {
  const propsPassedInFromCodeBlock =
    typeof lineProps === 'function' ? lineProps(lineNumber) : lineProps;
  const properties = { ...propsPassedInFromCodeBlock, className };

  let currentChildren = children;

  if (lineNumber && showLineNumbers) {
    // When syntax highlighting is NOT turned on, the entire LOC is just a single
    // child. We can then happily create the line number and the LOC as siblings...
    if (currentChildren.length === 1) {
      currentChildren = [getInlineLineNumber(lineNumber), ...currentChildren];
    } else {
      // ... However, when syntax highlighting IS on, a span is created for each
      // tokenised node in the AST (eg. <span>import</span><span>React</span>).
      // When shouldWrapLongLines is true, the row becomes `display: flex` and
      // forces all its children to be equal height. This can be a source of
      // visual bugs where a LOC is broken up weirdly into segments.
      //
      //  +---------------------------------------+
      //  | row                                   |
      //  |  +----+ +-------+ +--------+ +------+ |
      //  |  |line| |key    | |keywords| |key   | |
      //  |  |no. | |word   | |        | |word  | |
      //  |  |    | |       | |        | |      | |
      //  |  +----+ +-------+ +--------+ +------+ |
      //  +---------------------------------------+
      //
      // Nesting the children one layer deeper (i.e. creating an extra span)
      // ensures that the line number and the ENTIRE line of code are aligned by
      // the parent flexbox (the row).
      //
      //  +---------------------------------------------+
      //  | row                                         |
      //  | +----+  +--------------------------------+  |
      //  | |line|  | extra span we are creating     |  |
      //  | |no. |  |  +-------+ +--------+ +------+ |  |
      //  | |    |  |  |key    | |keywords| |key   | |  |
      //  | |    |  |  |word   | |        | |word  | |  |
      //  | |    |  |  |       | |        | |      | |  |
      //  | |    |  |  +-------+ +--------+ +------+ |  |
      //  | +----+  +--------------------------------+  |
      //  +---------------------------------------------+
      //
      currentChildren = [
        getInlineLineNumber(lineNumber),
        {
          type: 'element',
          tagName: 'span',
          properties: { className: [] },
          children: currentChildren,
        },
      ];
    }
  }

  return {
    type: 'element',
    tagName: 'span',
    properties,
    children: currentChildren,
  };
}
