/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- LENS1-245 tracks @atlaskit/focus-ring deprecation. */
/**
 * @deprecated FocusRing is deprecated. Use Focusable from @atlaskit/primitives/compiled/focusable instead.
 */
export { default } from './focus-ring';
/**
 * @deprecated useFocusRing is deprecated with FocusRing. Use Focusable from @atlaskit/primitives/compiled/focusable instead.
 */
export { default as useFocusRing } from './use-focus-ring';

export type { FocusRingProps, FocusEventHandlers, FocusState } from './types';
