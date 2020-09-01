/** @jsx jsx */
import { forwardRef } from 'react';

import { css, jsx } from '@emotion/core';

import { DN0, DN600, N0, N800 } from '@atlaskit/theme/colors';
import GlobalTheme, { GlobalThemeTokens } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';

import TooltipPrimitive, { TooltipPrimitiveProps } from './TooltipPrimitive';

export interface TooltipContainerProps extends TooltipPrimitiveProps {}

const baseCss = css`
  border-radius: ${borderRadius()}px;
  box-sizing: border-box;
  font-size: 12px;
  left: 0;
  line-height: 1.3;
  max-width: 240px;
  padding: 2px 6px;
  top: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;
const truncateCss = css`
  max-width: 420px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TooltipContainer = forwardRef<HTMLDivElement, TooltipContainerProps>(
  function TooltipContainer(
    { style, className, children, truncate, placement, testId },
    ref,
  ) {
    return (
      <GlobalTheme.Consumer>
        {({ mode }: GlobalThemeTokens) => (
          <TooltipPrimitive
            ref={ref}
            style={style}
            className={className}
            placement={placement}
            testId={testId}
            css={[
              baseCss,
              truncate ? truncateCss : null,
              css`
                background-color: ${mode === 'light' ? N800 : DN0};
                color: ${mode === 'light' ? N0 : DN600};
              `,
            ]}
          >
            {children}
          </TooltipPrimitive>
        )}
      </GlobalTheme.Consumer>
    );
  },
);

TooltipContainer.displayName = 'TooltipContainer';

export default TooltipContainer;
