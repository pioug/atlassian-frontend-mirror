/** @jsx jsx */
import { forwardRef } from 'react';

import { css, jsx } from '@emotion/core';

import { DN0, DN600, N0, N800 } from '@atlaskit/theme/colors';
import GlobalTheme from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import TooltipPrimitive, { TooltipPrimitiveProps } from './TooltipPrimitive';

export interface TooltipContainerProps extends TooltipPrimitiveProps {}

const baseStyles = css({
  boxSizing: 'border-box',
  maxWidth: '240px',
  padding: '2px 6px',
  top: 0,
  left: 0,
  borderRadius: `${borderRadius()}px`,
  fontSize: '12px',
  lineHeight: 1.3,
  overflowWrap: 'break-word',
  wordWrap: 'break-word',
});

const truncateStyles = css({
  maxWidth: '420px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const lightStyles = css({
  backgroundColor: token('color.background.neutral.bold', N800),
  color: token('color.text.inverse', N0),
});

const darkStyles = css({
  backgroundColor: token('color.background.neutral.bold', DN0),
  color: token('color.text.inverse', DN600),
});

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
              baseStyles,
              truncate ? truncateStyles : null,
              mode === 'light' ? lightStyles : darkStyles,
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
