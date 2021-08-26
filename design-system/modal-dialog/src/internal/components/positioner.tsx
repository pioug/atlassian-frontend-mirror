/** @jsx jsx */
import { CSSProperties, ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { easeInOut } from '@atlaskit/motion/curves';
import { mediumDurationMs } from '@atlaskit/motion/durations';
import { layers } from '@atlaskit/theme/constants';

import { gutter, verticalOffset } from '../constants';

const maxWidthDimensions = `calc(100vw - ${gutter * 2}px)`;
const maxHeightDimensions = `calc(100vh - ${gutter * 2 - 1}px)`;

const positionerStyles = css({
  width: '100%',
  maxWidth: '100%',
  height: '100%',
  position: 'fixed',
  zIndex: layers.modal(),
  top: 0,
  left: 0,
});

const viewportScrollStyles = css({
  width: 'max-content',
  height: 'auto',
  position: 'relative',
  '@media (min-width: 480px)': {
    margin: `${gutter}px auto`,
  },
});

const bodyScrollStyles = css({
  '@media (min-width: 480px)': {
    width: 'max-content',
    maxWidth: maxWidthDimensions,
    maxHeight: maxHeightDimensions,

    marginRight: 'auto',
    marginLeft: 'auto',

    position: 'absolute',
    top: `${gutter}px`,
    right: 0,
    left: 0,

    pointerEvents: 'none',
  },
});

const stackTransitionStyles = css({
  transitionDuration: `${mediumDurationMs}ms`,
  transitionProperty: 'transform',
  transitionTimingFunction: easeInOut,

  /** Duplicated from @atlaskit/motion/accessibility
   * because @repo/internal/styles/consistent-style-ordering
   * doesn't work well with object spreading. */
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
    transition: 'none',
  },
});

const stackTransformStyles = css({
  transform: 'translateY(var(--modal-dialog-translate-y))',
});

const stackIdleStyles = css({
  transform: 'none',
});

interface PositionerProps {
  children?: ReactNode;
  stackIndex: number;
  shouldScrollInViewport: boolean;
  testId?: string;
}

const Positioner = (props: PositionerProps) => {
  const { children, stackIndex, shouldScrollInViewport, testId } = props;

  return (
    <div
      style={
        {
          '--modal-dialog-translate-y': `${
            stackIndex * (verticalOffset / 2)
          }px`,
        } as CSSProperties
      }
      css={[
        positionerStyles,
        stackTransitionStyles,
        /* We only want to apply transform on modals shifting to the back of the stack. */
        stackIndex > 0 ? stackTransformStyles : stackIdleStyles,
        shouldScrollInViewport ? viewportScrollStyles : bodyScrollStyles,
      ]}
      data-testid={testId && `${testId}--positioner`}
    >
      {children}
    </div>
  );
};

export default Positioner;
