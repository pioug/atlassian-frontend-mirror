/** @jsx jsx */
import type { ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { prefersReducedMotion } from '@atlaskit/motion';

import { TRANSITION_DURATION } from '../../../common/constants';
import { useIsSidebarCollapsing } from '../../../common/hooks';

type ResizableChildrenWrapperProps = {
  children: ReactNode;
  isFlyoutOpen?: boolean;
  isLeftSidebarCollapsed?: boolean;
  hasCollapsedState?: boolean;
};

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const prefersReducedMotionStyles = css(prefersReducedMotion());

/**
 * The transition duration is intentionally set to 0ms.
 *
 * A transition is being used here to delay the setting of
 * opacity and visibility so that it syncs collapsing sidebar.
 */
const hideLeftSidebarContentsStyles = css({
  opacity: 0,
  transition: `opacity 0ms linear, visibility 0ms linear`,
  transitionDelay: `${TRANSITION_DURATION - 100}ms`,
  visibility: 'hidden',
});

const resizableChildrenWrapperStyles = css({
  height: '100%',
  opacity: 1,
  overflow: 'hidden auto',
  transition: 'none',
  visibility: 'visible',
});

const fixedChildrenWrapperStyles = css({
  minWidth: 240,
  height: '100%',
});

const ResizableChildrenWrapper = ({
  children,
  isLeftSidebarCollapsed = false,
  hasCollapsedState = false,
  isFlyoutOpen = false,
}: ResizableChildrenWrapperProps) => {
  const isCollapsing = useIsSidebarCollapsing();
  const isCollapsed = isLeftSidebarCollapsed || hasCollapsedState;
  const isHidden = isCollapsing || (isCollapsed && !isFlyoutOpen);

  return (
    <div
      css={[
        resizableChildrenWrapperStyles,
        isHidden && hideLeftSidebarContentsStyles,
        prefersReducedMotionStyles,
      ]}
    >
      <div css={fixedChildrenWrapperStyles}>{children}</div>
    </div>
  );
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default ResizableChildrenWrapper;
