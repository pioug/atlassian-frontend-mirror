/**
 * Marks the scrolling value container rendered by `MultiValueContainer`.
 *
 * `MultiValue` uses this to resolve the scroll container by lookup instead of
 * walking a fixed number of parent elements, which is not stable once selected
 * values are wrapped in `ul`/`li` by `SelectedValueList` (A11Y-30826).
 */
export const VALUE_CONTAINER_ATTRIBUTE = 'data-user-picker-value-container';
