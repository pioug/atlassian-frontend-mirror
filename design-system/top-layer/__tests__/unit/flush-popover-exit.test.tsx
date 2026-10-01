import React from 'react';

import { act } from '@atlassian/testing-library/act';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { Popover } from '../../src/popover/popover';
import { flushPopoverExit } from '../../src/testing/flush-popover-exit';

// The first fake-timer test pins the reason `flushPopoverExit()` exists. If its "still mounted"
// assertions ever start failing, the helper may no longer be needed.

function TestPopover({ isOpen, onExitFinish }: { isOpen: boolean; onExitFinish?: () => void }) {
	return (
		<Popover
			isOpen={isOpen}
			onExitFinish={onExitFinish}
			role="dialog"
			label="test-popover"
			shouldAnimate
			testId="popover"
		>
			<div data-testid="content">content</div>
		</Popover>
	);
}

it('should capture and report a11y violations', async () => {
	const { container } = render(<TestPopover isOpen={false} />);
	await expect(container).toBeAccessible();
});

describe('flushPopoverExit with fake timers', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('settles an exit that a synchronous act leaves pending', async () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={true} onExitFinish={onExitFinish} />);
		expect(screen.getByTestId('popover')).toBeInTheDocument();

		rerender(<TestPopover isOpen={false} onExitFinish={onExitFinish} />);
		// Fires the task-queued closed `toggle`, but the settlement promise job has not run yet.
		act(() => {
			jest.runOnlyPendingTimers();
		});
		expect(onExitFinish).not.toHaveBeenCalled();
		expect(screen.getByTestId('popover')).toBeInTheDocument();

		await flushPopoverExit();

		expect(onExitFinish).toHaveBeenCalledTimes(1);
		expect(screen.queryByTestId('popover')).not.toBeInTheDocument();
		expect(screen.queryByTestId('content')).not.toBeInTheDocument();
	});

	it('settles exit on its own when the closed toggle has not fired yet', async () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={true} onExitFinish={onExitFinish} />);

		rerender(<TestPopover isOpen={false} onExitFinish={onExitFinish} />);
		await flushPopoverExit();

		expect(onExitFinish).toHaveBeenCalledTimes(1);
		expect(screen.queryByTestId('popover')).not.toBeInTheDocument();
	});

	it('is a no-op when the popover is already closed', async () => {
		const onExitFinish = jest.fn();
		render(<TestPopover isOpen={false} onExitFinish={onExitFinish} />);

		await flushPopoverExit();

		expect(onExitFinish).not.toHaveBeenCalled();
		expect(screen.queryByTestId('popover')).not.toBeInTheDocument();
	});
});

describe('flushPopoverExit with real timers', () => {
	it('waits for the real toggle task so the exit settles and the host unmounts', async () => {
		const onExitFinish = jest.fn();
		const { rerender } = render(<TestPopover isOpen={true} onExitFinish={onExitFinish} />);
		expect(screen.getByTestId('popover')).toBeInTheDocument();

		rerender(<TestPopover isOpen={false} onExitFinish={onExitFinish} />);
		// The closed `toggle` is a real pending task at this point.
		expect(onExitFinish).not.toHaveBeenCalled();
		expect(screen.getByTestId('popover')).toBeInTheDocument();

		await flushPopoverExit();

		expect(onExitFinish).toHaveBeenCalledTimes(1);
		expect(screen.queryByTestId('popover')).not.toBeInTheDocument();
	});
});
