import { flushPopoverExit } from '@atlaskit/top-layer/testing/flush-popover-exit';

/**
 * Waits for a tooltip that has started hiding to finish hiding in jsdom.
 *
 * Requires React 18.3 or newer.
 *
 * With `platform-dst-top-layer-tooltip` on, the tooltip hides through a top-layer
 * `Popover`, which jest fake timers alone cannot flush - see
 * `@atlaskit/top-layer/testing/flush-popover-exit`, which this delegates to.
 *
 * Call this after the hide `delay` has been flushed.
 *
 * @example
 * await user.unhover(trigger);
 * // flush the hide delay
 * act(() => {
 *   jest.runOnlyPendingTimers();
 * });
 * await waitForTooltipToHide();
 * expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
 * expect(onHide).toHaveBeenCalledTimes(1);
 */
export async function waitForTooltipToHide(): Promise<void> {
	await flushPopoverExit();
}
