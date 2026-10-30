/**
 * Marks the surface element of an open page surface while `useCloseOnUnclaimedEscape` listens for
 * Escape on `document`. A `manual` popover around the surface also listens on `document`, in bind
 * order. The mark lets the popover leave the Escape to the surface, whatever the bind order.
 *
 * A string, so it works across copies of `@atlaskit/top-layer`.
 */
export const pageSurfaceEscapeAttribute = 'data-top-layer-surface-takes-escape';
