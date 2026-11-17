/**
 * Set by `Dialog` and `Popover` on their host while their `isOpen` is `true`. The layers inside a
 * host read it in their layout effects, which run before the host has finished its show (see
 * `layer-show.tsx`).
 *
 * An attribute, so a child finds its parent layer with a DOM query.
 */
export const openRequestedAttribute = 'data-top-layer-open-requested';
