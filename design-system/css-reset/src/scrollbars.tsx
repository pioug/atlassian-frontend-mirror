import { token } from '@atlaskit/tokens';

import evaluateInner from './utils/evaluate-inner';

const scrollbarStyles: string = evaluateInner`/*
 * Feature-gated harmonized scrollbar appearance.
 * Only colors change. Size, visibility and overlay behavior stay browser managed, so the
 * operating system preference (for example macOS "When scrolling") is honored and applies
 * live. Custom WebKit scrollbar sizing is never drawn as an overlay, so it is not used.
 *
 * The track is transparent so it matches every surface, which lets the colors be set once on
 * the root and inherited. A per-element var() would make every element's style depend on
 * inherited custom properties.
 */
@layer atlaskit-scrollbar-harmonisation {
:root[data-scrollbar-harmonisation] {
  scrollbar-color: ${token('color.background.accent.gray.subtle', '#8C8F97')} transparent;
}

@media (forced-colors: active) {
  :root[data-scrollbar-harmonisation] {
    scrollbar-color: auto;
  }
}
}`;

export default scrollbarStyles;
