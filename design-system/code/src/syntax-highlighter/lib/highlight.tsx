import { memo } from 'react';

import {
  CodeBidiWarningConfig,
  RefractorNode,
  SyntaxHighlighterProps,
} from '../types';

import processLines from './process';
import ReactRenderer from './react-renderer';

/**
 * Takes in a code string and (in the default behaviour):
 * - Uses refractor to turn it into a tree structure with highlighting metadata
 * - Collapses this tree into lines for a renderer
 * - Passes these lines to a React renderer
 *
 * In future, the final step could have a custom renderer.
 */
const Highlight = memo(function Highlight({
  language = 'text',
  testId,
  text = '',
  codeTagProps = {
    className: `language-${language}`,
  },
  showLineNumbers = false,
  shouldCreateParentElementForLines = false,
  shouldWrapLongLines = false,
  lineProps = {},
  codeBidiWarnings,
  codeBidiWarningLabel,
  codeBidiWarningTooltipEnabled,
  astGenerator = null,
  ...rest
}: SyntaxHighlighterProps): JSX.Element {
  // TODO maybe we call this code or text everywhere; for now we match the API in
  // @atlaskit/codeblock
  const code = text;
  const generatorClassName = 'prismjs';
  const containerProps = {
    ...rest,
    'data-testid': testId,
    className: rest.className
      ? `${generatorClassName} ${rest.className}`
      : generatorClassName,
  };
  if (shouldWrapLongLines) {
    codeTagProps.style = {
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    };
  } else {
    codeTagProps.style = { whiteSpace: 'pre' };
  }

  const codeBidiWarningConfig: CodeBidiWarningConfig = {
    codeBidiWarnings,
    codeBidiWarningLabel,
    codeBidiWarningTooltipEnabled,
  };

  // Tree + logic into rows
  const rows: RefractorNode[] = processLines({
    astGenerator,
    code,
    language,
    shouldCreateParentElementForLines:
      shouldCreateParentElementForLines || !!shouldWrapLongLines,
    lineProps,
    showLineNumbers,
  });

  // Rows + logic into a renderer
  return ReactRenderer({
    containerProps,
    codeTagProps,
    rows,
    codeBidiWarningConfig,
  });
});

export default Highlight;
