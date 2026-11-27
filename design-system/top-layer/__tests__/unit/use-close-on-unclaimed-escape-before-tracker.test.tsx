import React, { useRef } from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import { useCloseOnUnclaimedEscape } from '../../src/page-surface/use-close-on-unclaimed-escape';
import { Popover } from '../../src/popover/popover';

/**
 * Open order tracking starts once and never stops, and each test file has its own modules and
 * document. So this file holds the cases that need tracking not to have started yet. Only page
 * surfaces render here (a `Dialog` or `useManualLightDismiss` starts tracking at mount), and the
 * tests run in this order.
 */

// A keydown, as a browser sends it.
function fireKeyDown({ target }: { target: Element }): KeyboardEvent {
	const event = new KeyboardEvent('keydown', {
		key: 'Escape',
		bubbles: true,
		cancelable: true,
		composed: true,
	});
	act(() => {
		target.dispatchEvent(event);
	});
	return event;
}

/**
 * The `beforetoggle` listeners bound on `document`. Only open order tracking binds one there.
 */
function getDocumentBeforeToggleBindCount({
	addEventListener,
}: {
	addEventListener: jest.SpyInstance;
}): number {
	return addEventListener.mock.calls.filter(([type]) => type === 'beforetoggle').length;
}

function Surface({
	isEnabled,
	isTooltipOpen,
	onClose,
}: {
	isEnabled: boolean;
	isTooltipOpen: boolean;
	onClose: () => void;
}) {
	const surfaceRef = useRef<HTMLDivElement>(null);
	useCloseOnUnclaimedEscape({ isEnabled, surfaceRef, onClose });
	return (
		<>
			<div ref={surfaceRef}>
				<button type="button">Inside surface</button>
			</div>
			{/* A child of the hook's component, so it opens before that component's layout effects. */}
			<Popover
				isOpen={isTooltipOpen}
				mode="hint"
				role="tooltip"
				testId="tooltip"
				onClose={() => {}}
			>
				Tooltip
			</Popover>
		</>
	);
}

function Page({
	isSurfaceEnabled,
	isTooltipOpen,
	isLaterTooltipOpen,
	onSurfaceClose,
}: {
	isSurfaceEnabled: boolean;
	isTooltipOpen: boolean;
	isLaterTooltipOpen: boolean;
	onSurfaceClose: () => void;
}) {
	return (
		<>
			<Popover isOpen role="dialog" label="Around" testId="around" onClose={() => {}}>
				<Surface
					isEnabled={isSurfaceEnabled}
					isTooltipOpen={isTooltipOpen}
					onClose={onSurfaceClose}
				/>
			</Popover>
			<Popover
				isOpen={isLaterTooltipOpen}
				mode="hint"
				role="tooltip"
				testId="later-tooltip"
				onClose={() => {}}
			>
				Later tooltip
			</Popover>
		</>
	);
}

describe('useCloseOnUnclaimedEscape() before open order tracking started', () => {
	it('starts no tracking while isEnabled is false or missing', () => {
		const addEventListener = jest.spyOn(document, 'addEventListener');
		function OffSurfaces() {
			useCloseOnUnclaimedEscape({ isEnabled: false, onClose: () => {} });
			useCloseOnUnclaimedEscape({
				// For example, an unmocked feature gate in a test.
				isEnabled: undefined as unknown as boolean,
				onClose: () => {},
			});
			return null;
		}

		const { unmount } = render(<OffSurfaces />);

		expect(getDocumentBeforeToggleBindCount({ addEventListener })).toBe(0);

		unmount();
		addEventListener.mockRestore();
	});

	it('starts tracking in the commit that enables the surface, before a layer in that commit opens', () => {
		const addEventListener = jest.spyOn(document, 'addEventListener');
		const onSurfaceClose = jest.fn();
		// The popover around the surface opens while the surface is off, so it has no open order.
		const { rerender } = render(
			<Page
				isSurfaceEnabled={false}
				isTooltipOpen={false}
				isLaterTooltipOpen={false}
				onSurfaceClose={onSurfaceClose}
			/>,
		);
		const around = screen.getByTestId('around');
		expect(around.matches(':popover-open')).toBe(true);
		expect(getDocumentBeforeToggleBindCount({ addEventListener })).toBe(0);

		// The tooltip opens in the commit that enables the surface.
		rerender(
			<Page
				isSurfaceEnabled
				isTooltipOpen
				isLaterTooltipOpen={false}
				onSurfaceClose={onSurfaceClose}
			/>,
		);
		const tooltip = screen.getByTestId('tooltip');
		expect(tooltip.matches(':popover-open')).toBe(true);
		expect(getDocumentBeforeToggleBindCount({ addEventListener })).toBe(1);
		const inside = screen.getByRole('button', { name: 'Inside surface' });

		// The tooltip was tracked, so it is above the surface and closes first.
		const first = fireKeyDown({ target: inside });

		expect(first.defaultPrevented).toBe(false);
		expect(onSurfaceClose).not.toHaveBeenCalled();
		expect(tooltip.matches(':popover-open')).toBe(false);

		// The surface ranks just above the popover around it, which ranks `0`.
		const second = fireKeyDown({ target: inside });

		expect(second.defaultPrevented).toBe(true);
		expect(onSurfaceClose).toHaveBeenCalledTimes(1);
		expect(around.matches(':popover-open')).toBe(true);

		// A layer that opens later is above the surface.
		rerender(
			<Page
				isSurfaceEnabled
				isTooltipOpen={false}
				isLaterTooltipOpen
				onSurfaceClose={onSurfaceClose}
			/>,
		);
		const laterTooltip = screen.getByTestId('later-tooltip');
		expect(laterTooltip.matches(':popover-open')).toBe(true);

		const third = fireKeyDown({ target: inside });

		expect(third.defaultPrevented).toBe(false);
		expect(onSurfaceClose).toHaveBeenCalledTimes(1);
		expect(laterTooltip.matches(':popover-open')).toBe(false);
		expect(around.matches(':popover-open')).toBe(true);

		addEventListener.mockRestore();
	});
});
