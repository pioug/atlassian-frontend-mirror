/** @jsx jsx */
import { forwardRef, MouseEventHandler, ReactNode, Ref } from 'react';

import { css, jsx } from '@emotion/react';

import { easeOut, prefersReducedMotion } from '@atlaskit/motion';

import {
  COLLAPSED_LEFT_SIDEBAR_WIDTH,
  LEFT_SIDEBAR_FLYOUT_WIDTH,
  LEFT_SIDEBAR_WIDTH,
  TRANSITION_DURATION,
} from '../../../common/constants';
import { useIsSidebarDragging } from '../../../common/hooks';
import { getPageLayoutSlotSelector } from '../../../common/utils';

import SlotFocusRing from './slot-focus-ring';

type LeftSidebarOuterProps = {
  children: ReactNode;
  isFixed?: boolean;
  isFlyoutOpen?: boolean;
  testId?: string;
  id?: string;
  onMouseOver?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
};

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const prefersReducedMotionStyles = css(prefersReducedMotion());

const outerStyles = css({
  width: LEFT_SIDEBAR_WIDTH,
  marginLeft: 0,
  position: 'relative',
  zIndex: 1,
  transition: `width ${TRANSITION_DURATION}ms ${easeOut} 0s`,
  ':hover': {
    '--ds--resize-button--opacity': 1,
  },
});

const draggingStyles = css({
  cursor: 'ew-resize',
  // Make sure drag to resize does not animate as the user drags
  transition: 'none',
});

/**
 * In fixed mode this element's child is taken out of the document flow.
 * It doesn't take up the width as expected,
 * so the pseudo element forces it to take up the necessary width.
 */
const fixedStyles = css({
  '::after': {
    display: 'inline-block',
    width: `${LEFT_SIDEBAR_WIDTH}`,
    content: "''",
  },
});

const flyoutStyles = css({
  width: LEFT_SIDEBAR_FLYOUT_WIDTH,
});

const flyoutFixedStyles = css({
  width: COLLAPSED_LEFT_SIDEBAR_WIDTH,
});

const selector = getPageLayoutSlotSelector('left-sidebar');

const LeftSidebarOuter = (
  {
    children,
    isFixed = false,
    isFlyoutOpen = false,
    testId,
    onMouseLeave,
    onMouseOver,
    id,
  }: LeftSidebarOuterProps,
  ref: Ref<HTMLDivElement>,
) => {
  const isDragging = useIsSidebarDragging();

  return (
    <SlotFocusRing isSidebar>
      {({ className }) => (
        /**
         * The mouse handlers control flyout behavior, a mouse-only experience.
         */
        // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
        <div
          css={[
            outerStyles,
            isFixed && fixedStyles,
            isFlyoutOpen && flyoutStyles,
            isFlyoutOpen && isFixed && flyoutFixedStyles,
            isDragging && draggingStyles,
            prefersReducedMotionStyles,
          ]}
          className={className}
          data-testid={testId}
          id={id}
          onMouseOver={onMouseOver}
          onMouseLeave={onMouseLeave}
          ref={ref}
          {...selector}
        >
          {children}
        </div>
      )}
    </SlotFocusRing>
  );
};

export default forwardRef(LeftSidebarOuter);
