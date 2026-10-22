import React from 'react';

import { Dialog } from '@atlaskit/top-layer/dialog-content';
import { hasOpenDialogOrPopover } from '@atlaskit/top-layer/page-surface/has-open-dialog-or-popover';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';
import { waitFor } from '@atlassian/testing-library/wait-for';

import { bindOpenLayerChange } from '../../side-nav/bind-open-layer-change';

/**
 * Waits for the queued `toggle` and `close` tasks. The polyfill dispatches
 * them with `setTimeout`, as browsers do.
 */
async function flushToggleTasks() {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
	});
}

function getContainer({ testId }: { testId: string }): HTMLElement {
	return screen.getByTestId(testId);
}

describe('bindOpenLayerChange()', () => {
	function TwoAreas({
		isInsidePopoverOpen = false,
		isOutsidePopoverOpen = false,
		isInsideDialogOpen = false,
		isInsidePopoverRendered = true,
		isInsideDialogRendered = true,
	}: {
		isInsidePopoverOpen?: boolean;
		isOutsidePopoverOpen?: boolean;
		isInsideDialogOpen?: boolean;
		isInsidePopoverRendered?: boolean;
		isInsideDialogRendered?: boolean;
	}) {
		return (
			<>
				<div data-testid="inside">
					{isInsidePopoverRendered ? (
						<Popover
							isOpen={isInsidePopoverOpen}
							role="dialog"
							label="Inside popover"
							onClose={() => {}}
						>
							Inside popover content
						</Popover>
					) : null}
					{isInsideDialogRendered ? (
						<Dialog isOpen={isInsideDialogOpen} onClose={() => {}} label="Inside dialog">
							<button type="button">Close</button>
						</Dialog>
					) : null}
				</div>
				<div data-testid="outside">
					<Popover
						isOpen={isOutsidePopoverOpen}
						role="dialog"
						label="Outside popover"
						onClose={() => {}}
					>
						Outside popover content
					</Popover>
				</div>
			</>
		);
	}

	it('calls onChange when a popover inside `within` opens and closes', async () => {
		const onChange = jest.fn();
		const { rerender } = render(<TwoAreas />);
		const cleanup = bindOpenLayerChange({
			within: getContainer({ testId: 'inside' }),
			onChange,
		});

		rerender(<TwoAreas isInsidePopoverOpen />);
		await waitFor(() => expect(onChange).toHaveBeenCalled());

		onChange.mockClear();
		rerender(<TwoAreas />);
		await waitFor(() => expect(onChange).toHaveBeenCalled());

		cleanup();
	});

	it('calls onChange when a dialog inside `within` opens and closes', async () => {
		const onChange = jest.fn();
		const { rerender } = render(<TwoAreas />);
		const cleanup = bindOpenLayerChange({
			within: getContainer({ testId: 'inside' }),
			onChange,
		});

		rerender(<TwoAreas isInsideDialogOpen />);
		await waitFor(() => expect(onChange).toHaveBeenCalled());

		onChange.mockClear();
		rerender(<TwoAreas />);
		await waitFor(() => expect(onChange).toHaveBeenCalled());

		cleanup();
	});

	it('calls onChange when an open popover inside `within` unmounts', async () => {
		const states: boolean[] = [];
		const { rerender } = render(<TwoAreas isInsidePopoverOpen />);
		const within = getContainer({ testId: 'inside' });
		expect(hasOpenDialogOrPopover({ within })).toBe(true);

		const cleanup = bindOpenLayerChange({
			within,
			onChange: () => {
				states.push(hasOpenDialogOrPopover({ within }));
			},
		});

		// The `toggle` task fires after the popover left the DOM, so it never reaches `within`.
		rerender(<TwoAreas isInsidePopoverRendered={false} />);
		await flushToggleTasks();

		// The last change reports that nothing is open any more.
		expect(states.length).toBeGreaterThan(0);
		expect(states[states.length - 1]).toBe(false);

		cleanup();
	});

	it('calls onChange when an open dialog inside `within` unmounts', async () => {
		const states: boolean[] = [];
		const { rerender } = render(<TwoAreas isInsideDialogOpen />);
		const within = getContainer({ testId: 'inside' });
		expect(hasOpenDialogOrPopover({ within })).toBe(true);

		const cleanup = bindOpenLayerChange({
			within,
			onChange: () => {
				states.push(hasOpenDialogOrPopover({ within }));
			},
		});

		rerender(<TwoAreas isInsideDialogRendered={false} />);
		await flushToggleTasks();

		expect(states.length).toBeGreaterThan(0);
		expect(states[states.length - 1]).toBe(false);

		cleanup();
	});

	it('does not call onChange for a popover outside `within`', async () => {
		const onChange = jest.fn();
		const { rerender } = render(<TwoAreas />);
		const cleanup = bindOpenLayerChange({
			within: getContainer({ testId: 'inside' }),
			onChange,
		});

		rerender(<TwoAreas isOutsidePopoverOpen />);
		await flushToggleTasks();
		rerender(<TwoAreas />);
		await flushToggleTasks();

		expect(onChange).not.toHaveBeenCalled();

		cleanup();
	});

	it('stops calling onChange after cleanup', async () => {
		const onChange = jest.fn();
		const { rerender } = render(<TwoAreas />);
		const cleanup = bindOpenLayerChange({
			within: getContainer({ testId: 'inside' }),
			onChange,
		});
		cleanup();

		rerender(<TwoAreas isInsidePopoverOpen isInsideDialogOpen />);
		await flushToggleTasks();
		rerender(<TwoAreas />);
		await flushToggleTasks();

		expect(onChange).not.toHaveBeenCalled();
	});

	it('reports the new state when onChange runs', async () => {
		const states: boolean[] = [];
		const { rerender } = render(<TwoAreas />);
		const within = getContainer({ testId: 'inside' });
		const cleanup = bindOpenLayerChange({
			within,
			onChange: () => {
				states.push(hasOpenDialogOrPopover({ within }));
			},
		});

		rerender(<TwoAreas isInsidePopoverOpen />);
		await flushToggleTasks();
		expect(states[states.length - 1]).toBe(true);

		rerender(<TwoAreas />);
		await flushToggleTasks();
		expect(states[states.length - 1]).toBe(false);

		cleanup();
	});
});
