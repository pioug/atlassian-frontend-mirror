/** @jsx jsx */
import { useEffect } from 'react';

import { css, jsx } from '@emotion/core';

import {
  BANNER_HEIGHT,
  DEFAULT_RIGHT_SIDEBAR_WIDTH,
  RIGHT_PANEL_WIDTH,
  RIGHT_SIDEBAR_WIDTH,
  TOP_NAVIGATION_HEIGHT,
  VAR_RIGHT_SIDEBAR_WIDTH,
} from '../../common/constants';
import { SlotWidthProps } from '../../common/types';
import {
  getPageLayoutSlotSelector,
  resolveDimension,
} from '../../common/utils';
import { publishGridState, useSkipLink } from '../../controllers';

import SlotFocusRing from './internal/slot-focus-ring';
import SlotDimensions from './slot-dimensions';

/**
 * This inner wrapper is required to allow the sidebar to be `position: fixed`.
 *
 * If we were to apply `position: fixed` to the outer wrapper, it will be popped
 * out of its flex container and Main would stretch to occupy all the space.
 */
const fixedInnerStyles = css({
  /**
   * This width on the inner wrapper is required when it is using fixed
   * positioning. Otherwise its width is slightly off.
   */
  width: RIGHT_SIDEBAR_WIDTH,
  position: 'fixed',
  top: `calc(${BANNER_HEIGHT} + ${TOP_NAVIGATION_HEIGHT})`,
  right: `calc(${RIGHT_PANEL_WIDTH})`,
  bottom: 0,
});

const staticInnerStyles = css({ height: '100%' });

const outerStyles = css({ width: RIGHT_SIDEBAR_WIDTH });

/**
 * In fixed mode this element's child is taken out of the document flow.
 * It doesn't take up the width as expected,
 * so the pseudo element forces it to take up the necessary width.
 */
const fixedOuterStyles = css({
  '&::after': {
    display: 'inline-block',
    width: RIGHT_SIDEBAR_WIDTH,
    content: "''",
  },
});

const RightSidebar = (props: SlotWidthProps) => {
  const {
    children,
    width = DEFAULT_RIGHT_SIDEBAR_WIDTH,
    isFixed,
    shouldPersistWidth,
    testId,
    id,
    skipLinkTitle,
  } = props;

  const rightSidebarWidth = resolveDimension(
    VAR_RIGHT_SIDEBAR_WIDTH,
    width,
    shouldPersistWidth,
  );

  useEffect(() => {
    publishGridState({ [VAR_RIGHT_SIDEBAR_WIDTH]: rightSidebarWidth });
    return () => {
      publishGridState({ [VAR_RIGHT_SIDEBAR_WIDTH]: 0 });
    };
  }, [rightSidebarWidth, id]);

  useSkipLink(id, skipLinkTitle);

  return (
    <SlotFocusRing isSidebar>
      {({ className }) => (
        <div
          data-testid={testId}
          css={[outerStyles, isFixed && fixedOuterStyles]}
          className={className}
          id={id}
          {...getPageLayoutSlotSelector('right-sidebar')}
        >
          <SlotDimensions
            variableName={VAR_RIGHT_SIDEBAR_WIDTH}
            value={rightSidebarWidth}
          />
          <div
            css={[isFixed && fixedInnerStyles, !isFixed && staticInnerStyles]}
          >
            {children}
          </div>
        </div>
      )}
    </SlotFocusRing>
  );
};

export default RightSidebar;
