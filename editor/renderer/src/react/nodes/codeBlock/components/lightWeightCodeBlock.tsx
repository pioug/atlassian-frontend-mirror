/** @jsx jsx */
import React, { forwardRef, useMemo } from 'react';
import { css, jsx, useTheme } from '@emotion/react';

import { blockNodesVerticalMargin } from '@atlaskit/editor-shared-styles';
import {
  codeBlockSharedStyles,
  CodeBlockSharedCssClassName,
} from '@atlaskit/editor-common/styles';

import { useBidiWarnings } from '../../../hooks/use-bidi-warnings';
import { RendererCssClassName } from '../../../../consts';
import type { Props as CodeBlockProps } from '../codeBlock';

const lightWeightCodeBlockStyles = css`
  .${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER} {
    cursor: text;
  }
`;

export const LightWeightCodeBlockCssClassName = {
  CONTAINER: 'light-weight-code-block',
};

export const getLightWeightCodeBlockStylesForRootRendererStyleSheet = () => {
  // We overwrite the rule that clears margin-top for first nested codeblocks, as
  // our lightweight codeblock dom structure will always nest the codeblock inside
  // an extra container div which would constantly be targeted. Now, top-level
  // lightweight codeblock containers will not be targeted.
  // NOTE: This must be added after other .code-block styles in the root
  // Renderer stylesheet.
  return css`
    .${RendererCssClassName.DOCUMENT}
      > .${LightWeightCodeBlockCssClassName.CONTAINER}
      .${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER} {
      margin-top: ${blockNodesVerticalMargin};
    }
  `;
};

const LightWeightCodeBlock = forwardRef(
  (
    {
      text,
      codeBidiWarningTooltipEnabled = true,
      className,
    }: Pick<
      CodeBlockProps,
      'text' | 'codeBidiWarningTooltipEnabled' | 'className'
    >,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const theme = useTheme();
    const textRows = useMemo(() => (text ?? '').split('\n'), [text]);
    const { renderBidiWarnings } = useBidiWarnings({
      enableWarningTooltip: codeBidiWarningTooltipEnabled,
    });
    const classNames = [
      LightWeightCodeBlockCssClassName.CONTAINER,
      className,
    ].join(' ');

    return (
      <div
        className={classNames}
        ref={ref}
        css={[codeBlockSharedStyles(theme), lightWeightCodeBlockStyles]}
      >
        <div className={CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER}>
          <div
            className={CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER}
          >
            <div
              className={
                CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER
              }
            >
              {textRows.map((_, index) => (
                <span key={index} />
              ))}
            </div>
            <div className={CodeBlockSharedCssClassName.CODEBLOCK_CONTENT}>
              <code>{renderBidiWarnings(text)}</code>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default LightWeightCodeBlock;
