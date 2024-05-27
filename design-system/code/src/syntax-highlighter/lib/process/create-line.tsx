import { type RefractorNode, type SyntaxHighlighterLineProps } from '../../types';

import createLineElement from './create-line-element';
import getInlineLineNumber from './get-inline-line-number';

function createLineGenerator(
  lineProps: SyntaxHighlighterLineProps,
  shouldCreateParentElementForLines: boolean,
  showLineNumbers: boolean,
): (
  children: RefractorNode[],
  lineNumber: number,
  className?: string[],
) => RefractorNode | RefractorNode[] {
  return (children, lineNumber, className = []) => {
    // Needed for more complex line creation
    if (shouldCreateParentElementForLines || className.length > 0) {
      return createLineElement({
        children,
        lineNumber,
        showLineNumbers,
        lineProps,
        className,
      });
    } else {
      // Simple line creation without the bells and whistles
      if (showLineNumbers && lineNumber) {
        children.unshift(getInlineLineNumber(lineNumber));
      }
      return children;
    }
  };
}

export default createLineGenerator;
