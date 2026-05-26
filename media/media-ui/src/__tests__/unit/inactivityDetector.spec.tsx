import React from 'react';
import { act, render, screen, userEvent } from '@atlassian/testing-library';
import { InactivityDetector } from '../..';

const renderInactivityDetector = () => {
	return render(
		<InactivityDetector>
			{(triggerActivityCallback, controlsAreVisible) => (
				<div data-testid="status">
					<span data-testid="status-text">{controlsAreVisible ? 'visible' : 'hidden'}</span>
					<button data-testid="trigger" type="button" onClick={triggerActivityCallback}>
						trigger
					</button>
				</div>
			)}
		</InactivityDetector>,
	);
};

describe('InactivityDetector', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		act(() => {
			jest.runOnlyPendingTimers();
		});
		jest.useRealTimers();
	});

	it('should render children', () => {
		renderInactivityDetector();
		expect(screen.getByTestId('status')).toBeInTheDocument();
	});

	it('should provide triggerActivityCallback as render function argument', () => {
		const childrenSpy = jest.fn(
			(_triggerActivityCallback: () => void, _controlsAreVisible: boolean) => (
				<div data-testid="child" />
			),
		);
		render(<InactivityDetector>{childrenSpy}</InactivityDetector>);
		expect(childrenSpy).toHaveBeenCalled();
		expect(typeof childrenSpy.mock.calls[0][0]).toBe('function');
	});

	it('should give moseMovement resetting function as part of showControlsRegister call', async () => {
		const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
		renderInactivityDetector();

		expect(screen.getByTestId('status-text')).toHaveTextContent('visible');

		act(() => {
			jest.advanceTimersByTime(2500);
		});
		expect(screen.getByTestId('status-text')).toHaveTextContent('hidden');

		await user.click(screen.getByTestId('trigger'));
		expect(screen.getByTestId('status-text')).toHaveTextContent('visible');
	});

	it('should handle mouse move', async () => {
		const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
		renderInactivityDetector();

		expect(screen.getByTestId('status-text')).toHaveTextContent('visible');
		await user.hover(screen.getByTestId('inactivity-detector-wrapper'));
		act(() => {
			jest.advanceTimersByTime(2500);
		});
		expect(screen.getByTestId('status-text')).toHaveTextContent('hidden');
	});

	it('should handle mouse out', async () => {
		const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
		renderInactivityDetector();

		expect(screen.getByTestId('status-text')).toHaveTextContent('visible');
		const wrapper = screen.getByTestId('inactivity-detector-wrapper');
		await user.hover(wrapper);
		await user.unhover(wrapper);
		act(() => {
			jest.advanceTimersByTime(2500);
		});
		expect(screen.getByTestId('status-text')).toHaveTextContent('hidden');
	});

	it('should keep controls visible when user is hovering them', async () => {
		const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
		render(
			<InactivityDetector>
				{(triggerActivityCallback, controlsAreVisible) => (
					<div data-testid="status">
						<span data-testid="status-text">{controlsAreVisible ? 'visible' : 'hidden'}</span>
						<div
							data-testid="hideable"
							ref={(el) => {
								el?.classList.add('mvng-hide-controls');
							}}
						>
							hover me
						</div>
					</div>
				)}
			</InactivityDetector>,
		);

		await user.hover(screen.getByTestId('hideable'));
		act(() => {
			jest.advanceTimersByTime(2500);
		});

		expect(screen.getByTestId('status-text')).toHaveTextContent('visible');
	});

	it('should start with controls visible', () => {
		renderInactivityDetector();
		expect(screen.getByTestId('status-text')).toHaveTextContent('visible');
	});

	it('should clear the timeout when component gets unmounted', () => {
		const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
		const { unmount } = renderInactivityDetector();
		const callsBefore = clearTimeoutSpy.mock.calls.length;
		unmount();
		expect(clearTimeoutSpy).toHaveBeenCalledTimes(callsBefore + 1);
		clearTimeoutSpy.mockRestore();
	});

	it('should not introduce any accessibility violations', async () => {
		jest.useRealTimers();
		renderInactivityDetector();
		await expect(document.body).toBeAccessible();
	});
});
