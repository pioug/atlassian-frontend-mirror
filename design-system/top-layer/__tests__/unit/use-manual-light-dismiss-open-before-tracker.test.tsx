import React, { type RefObject } from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import { Popover } from '../../src/popover/popover';
import { useManualLightDismiss } from '../../src/use-manual-light-dismiss';

/**
 * Open order tracking starts once and never stops, and each test file has its own modules and
 * document. So this file holds the cases that need layers which opened before the first hook
 * rendered. Do not render a hook in this file before these tests.
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

function createOpenPopover({ mode, name }: { mode: 'auto' | 'manual'; name: string }): HTMLElement {
	const element = document.createElement('div');
	element.setAttribute('popover', mode);
	const button = document.createElement('button');
	button.type = 'button';
	button.textContent = `Inside ${name}`;
	element.append(button);
	document.body.append(element);
	element.showPopover();
	return element;
}

/**
 * The hook, for a popover element that already exists (for example one that a lazily loaded
 * component starts to manage while it is open).
 */
function LateHook({
	popoverRef,
	onClose,
}: {
	popoverRef: RefObject<HTMLElement | null>;
	onClose: () => void;
}) {
	useManualLightDismiss({ popoverRef, isOpen: true, onClose });
	return null;
}

describe('useManualLightDismiss() for a popover that was open before the first hook rendered', () => {
	it('orders the popover from when its effect runs: above earlier layers, below later ones', () => {
		const onClose = jest.fn();
		// Both open before any hook rendered, so tracking does not see them open.
		const earlierAutoPopover = createOpenPopover({ mode: 'auto', name: 'earlier' });
		const manualPopover = createOpenPopover({ mode: 'manual', name: 'manual' });

		const popoverRef = { current: manualPopover };
		// The tooltip opens in the same commit, after tracking started in an insertion effect but
		// before the hook effect ordered the popover.
		const { rerender } = render(
			<>
				<LateHook popoverRef={popoverRef} onClose={onClose} />
				<Popover isOpen mode="hint" role="tooltip" testId="same-commit" onClose={() => {}}>
					Same commit tooltip
				</Popover>
			</>,
		);
		const inside = screen.getByRole('button', { name: 'Inside manual' });

		const first = fireKeyDown({ target: inside });

		// The popover is ordered as if it opened when its effect ran, so it is above both.
		expect(first.defaultPrevented).toBe(true);
		expect(onClose).toHaveBeenCalledTimes(1);
		expect(earlierAutoPopover.matches(':popover-open')).toBe(true);
		expect(screen.getByTestId('same-commit').matches(':popover-open')).toBe(true);

		// A layer that opens after the effect is above the popover.
		rerender(
			<>
				<LateHook popoverRef={popoverRef} onClose={onClose} />
				<Popover isOpen={false} mode="hint" role="tooltip" onClose={() => {}}>
					Same commit tooltip
				</Popover>
				<Popover isOpen mode="hint" role="tooltip" testId="later-tooltip" onClose={() => {}}>
					Later tooltip
				</Popover>
			</>,
		);

		const second = fireKeyDown({ target: inside });

		expect(second.defaultPrevented).toBe(false);
		expect(onClose).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId('later-tooltip').matches(':popover-open')).toBe(false);

		earlierAutoPopover.remove();
		manualPopover.remove();
	});
});
