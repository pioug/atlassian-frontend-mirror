// Note: this value has been pulled into a separate file to better
// support testing with Playwright. Playwright did not like importing
// an exported value from `sidenav.tsx` which has `@jsxRuntime classic`.
//
// Error:
// > importSource cannot be set when runtime is classic.

/**
 * How long the flyout should remain open after the users
 * pointer has left the side nav flyout
 */
export const sideNavFlyoutCloseDelayMs = 400;
