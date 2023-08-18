/** @jsx jsx */
import { forwardRef } from 'react';

import { css, jsx } from '@emotion/react';

import { DN0, DN600, N0, N800 } from '@atlaskit/theme/colors';
import GlobalTheme from '@atlaskit/theme/components';
import { token } from '@atlaskit/tokens';

import TooltipPrimitive, { TooltipPrimitiveProps } from './TooltipPrimitive';

export interface TooltipContainerProps extends TooltipPrimitiveProps {}

const baseStyles = css({
  boxSizing: 'border-box',
  maxWidth: '240px',
  padding: `${token('space.025', '2px')} ${token('space.075', '6px')}`,
  top: token('space.0', '0px'),
  left: token('space.0', '0px'),
  borderRadius: token('border.radius', '3px'),
  fontSize: token('font.size.075', '12px'),
  lineHeight: 1.3,
  overflowWrap: 'break-word',
  wordWrap: 'break-word',
});

const truncateStyles = css({
  maxWidth: '420px',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  // Use "clip" overflow to allow ellipses on x-axis without clipping descenders
  '@supports not (overflow-x: clip)': {
    overflow: 'hidden',
  },
  '@supports (overflow-x: clip)': {
    overflowX: 'clip',
  },
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
