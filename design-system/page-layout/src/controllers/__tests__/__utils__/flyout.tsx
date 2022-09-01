import {
  COLLAPSED_LEFT_SIDEBAR_WIDTH,
  DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH,
  IS_SIDEBAR_COLLAPSING,
  VAR_LEFT_SIDEBAR_FLYOUT,
} from '../../../common/constants';
import { getDimension } from '../../../components/__tests__/unit/__utils__/get-dimension';

/**
 * Helper function that checks if the flyout is open and valid,
 * based on the DOM state.
 */
export const expectThatFlyoutIsOpenAndValid = (leftSidebar: HTMLElement) => {
  const leftSidebarInner = leftSidebar.querySelector('div');

  /**
   * Validates the sidebar is actually collapsed
   * by checking the width of the slot.
   */
  expect(getDimension('leftSidebarWidth')).toEqual(
    `${COLLAPSED_LEFT_SIDEBAR_WIDTH}px`,
  );

  /**
   * Validates the sidebar is actually in flyout
   * by checking the width of the inner component.
   */
  expect(leftSidebarInner).toHaveStyleDeclaration(
    'width',
    `var(--${VAR_LEFT_SIDEBAR_FLYOUT}, ${DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH}px)`,
  );

  expect(
    getComputedStyle(document.documentElement).getPropertyValue(
      `--${VAR_LEFT_SIDEBAR_FLYOUT}`,
    ),
  ).toEqual(`${DEFAULT_LEFT_SIDEBAR_FLYOUT_WIDTH}px`);

  /**
   * Validates that the sidebar content is not hidden
   * by checking that the IS_SIDEBAR_COLLAPSING attribute is not present.
   */
  expect(document.documentElement.hasAttribute(IS_SIDEBAR_COLLAPSING)).toBe(
    false,
  );
};
