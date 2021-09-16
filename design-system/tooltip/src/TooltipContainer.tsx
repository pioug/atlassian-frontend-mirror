/** @jsx jsx */
import { forwardRef } from 'react';

import { css, jsx } from '@emotion/core';

import { DN0, DN600, N0, N800 } from '@atlaskit/theme/colors';
import GlobalTheme from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

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
    {
      style,
      className,
      children,
      truncate,
      placement,
      testId,
      onMouseOut,
      onMouseOver,
      id,
    },
    ref,
  ) {
    return (
      <GlobalTheme.Consumer>
        {({ mode }) => (
          // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
          <TooltipPrimitive
            ref={ref}
            style={style}
            className={className}
            placement={placement}
            testId={testId}
            id={id}
            onMouseOut={onMouseOut}
            onMouseOver={onMouseOver}
            css={[
              baseCss,
              truncate ? truncateCss : null,
              css`
                background-color: ${mode === 'light'
                  ? token('color.background.boldNeutral.resting', N800)
                  : token('color.background.boldNeutral.resting', DN0)};
                color: ${mode === 'light'
                  ? token('color.text.onBold', N0)
                  : token('color.text.onBold', DN600)};
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
