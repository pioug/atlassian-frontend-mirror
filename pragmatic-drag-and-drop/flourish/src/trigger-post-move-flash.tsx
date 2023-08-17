import { mediumDurationMs } from '@atlaskit/motion/durations';
import { token } from '@atlaskit/tokens';

/**
 * Runs a flash animation on the background color of the provided `element`.
 *
 * This animation should be used after an element has been reordered,
 * in order to highlight where the element has moved to.
 */
export function triggerPostMoveFlash(element: HTMLElement) {
  element.animate(
    [
      { backgroundColor: token('color.background.selected', 'transparent') },
      {},
    ],
    {
      duration: mediumDurationMs,
      easing: undefined,
      iterations: 1,
    },
  );
}
