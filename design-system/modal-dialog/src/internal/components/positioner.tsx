/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import { CSSProperties, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { easeInOut } from '@atlaskit/motion/curves';
import { mediumDurationMs } from '@atlaskit/motion/durations';
import { media } from '@atlaskit/primitives';
import { layers } from '@atlaskit/theme/constants';

import { gutter, verticalOffset } from '../constants';

const maxWidthDimensions = `calc(100vw - ${gutter * 2}px)`;
const maxHeightDimensions = `calc(100vh - ${gutter * 2 - 1}px)`;

// Flex and min-content are set to constrain the height of the body and support multi-column scrolling experiences
const positionerStyles = css({
  display: 'flex',
  width: '100%',
  maxWidth: '100%',
  height: '100%',
  position: 'fixed',
  zIndex: layers.modal(),
  flexDirection: 'column',
  insetBlockStart: 0,
  insetInlineStart: 0,
});

const viewportScrollStyles = css({
  height: 'auto',
  position: 'relative',
  [media.above.xs]: {
    margin: `${gutter}px auto`,
    pointerEvents: 'none',
  },
});

const bodyScrollStyles = css({
  [media.above.xs]: {
    maxWidth: maxWidthDimensions,
    maxHeight: maxHeightDimensions,
    position: 'absolute',
    insetBlockStart: `${gutter}px`,
    insetInlineEnd: 0,
    insetInlineStart: 0,
    marginInlineEnd: 'auto',
    marginInlineStart: 'auto',
    pointerEvents: 'none',
  },
});

const stackTransitionStyles = css({
  transitionDuration: `${mediumDurationMs}ms`,
  transitionProperty: 'transform',
  transitionTimingFunction: easeInOut,

  /**
   * Duplicated from @atlaskit/motion/accessibility
   * because @repo/internal/styles/consistent-style-ordering
   * doesn't work well with object spreading.
   */
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

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Positioner;
