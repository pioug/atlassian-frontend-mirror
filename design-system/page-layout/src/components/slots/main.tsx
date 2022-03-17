/** @jsx jsx */
import { useContext } from 'react';

import { css, jsx } from '@emotion/core';

import { prefersReducedMotion } from '@atlaskit/motion/accessibility';
import { easeOut } from '@atlaskit/motion/curves';

import {
  COLLAPSED_LEFT_SIDEBAR_WIDTH,
  DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH,
  TRANSITION_DURATION,
  VAR_LEFT_SIDEBAR_FLYOUT,
} from '../../common/constants';
import { useIsSidebarDragging } from '../../common/hooks';
import { SlotWidthProps } from '../../common/types';
import { getPageLayoutSlotSelector } from '../../common/utils';
import { SidebarResizeContext, useSkipLink } from '../../controllers';

import SlotFocusRing from './internal/slot-focus-ring';

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const prefersReducedMotionStyles = css(prefersReducedMotion());

const mainStyles = css({
  minWidth: 0,
  marginLeft: 0,
  // Prevent flex container from blowing up when there's super wide content.
  flexGrow: 1,
  // Transition negative margin on main in sync with the increase in width of leftSidebar.
  transition: `margin-left ${TRANSITION_DURATION}ms ${easeOut} 0s`,
});

const draggingStyles = css({
  cursor: 'ew-resize',
  // Make sure drag to resize remains snappy.
  transition: 'none',
});

/**
 * Adds a negative left margin to main,
 * which transitions at the same speed as the left sidebar's width increase.
 * This give an illusion that the flyout is appearing on top of the main content,
 * while main remains in place.
 */
const flyoutStyles = css({
  marginLeft: `calc(-1 * var(--${VAR_LEFT_SIDEBAR_FLYOUT}, ${DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH}px) + ${COLLAPSED_LEFT_SIDEBAR_WIDTH}px)`,
});

const Main = (props: SlotWidthProps) => {
  const { children, testId, id, skipLinkTitle } = props;

  useSkipLink(id, skipLinkTitle);

  const isDragging = useIsSidebarDragging();
  const {
    leftSidebarState: { isFlyoutOpen, isFixed },
  } = useContext(SidebarResizeContext);

  return (
    <SlotFocusRing>
      {({ className }) => (
        <div
          data-testid={testId}
          css={[
            mainStyles,
            isDragging && draggingStyles,
            isFlyoutOpen && !isFixed && flyoutStyles,
            prefersReducedMotionStyles,
          ]}
          className={className}
          id={id}
          {...getPageLayoutSlotSelector('main')}
        >
          {children}
        </div>
      )}
    </SlotFocusRing>
  );
};

export default Main;
