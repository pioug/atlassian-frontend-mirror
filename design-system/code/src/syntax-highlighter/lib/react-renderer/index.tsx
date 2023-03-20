import React from 'react';

import { CodeBidiWarningConfig, RefractorNode } from '../../types';

import createElement from './create-element';

/**
 * __React Renderer__
 *
 * A component that receives processed code lines and renders them into the code
 * rows inside the wrapping span and nested code tag, applying passed props and
 * code bidi warning config settings.
 */
export default function ReactRenderer({
  containerProps,
  codeTagProps,
  rows,
  codeBidiWarningConfig,
}: {
  containerProps: React.HTMLProps<HTMLElement>;
  codeTagProps: React.HTMLProps<HTMLElement>;
  rows: RefractorNode[];
  codeBidiWarningConfig: CodeBidiWarningConfig;
}): JSX.Element {
  const renderedRows = rows.map((node: RefractorNode, i: number) =>
    createElement({
      node,
      codeBidiWarningConfig,
      key: `code-segment${i}`,
    }),
  );

  return (
    <span {...containerProps}>
      <code {...codeTagProps}>{renderedRows}</code>
    </span>
  );
}
