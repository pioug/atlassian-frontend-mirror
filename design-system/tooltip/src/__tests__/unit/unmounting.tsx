import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import Tooltip from '../../tooltip';

describe('Unmounting tooltip', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should remove the tooltip when unmounting', () => {
		jest.spyOn(global.console, 'error');
		const { unmount } = render(
			<Tooltip testId="tooltip" content="hello world" position="left">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		const trigger = screen.getByTestId('trigger');

		unmount();
		fireEvent.focus(trigger);
		act(() => {
			jest.runAllTimers();
		});

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
		expect(console.error).not.toHaveBeenCalled();
		(global.console.error as jest.Mock).mockRestore();
	});

	it('should never show the tooltip if unmounted while waiting to show', () => {
		jest.spyOn(global.console, 'error');
		const { unmount } = render(
			<Tooltip testId="tooltip" content="hello world" position="left">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		const trigger = screen.getByTestId('trigger');

		fireEvent.mouseOver(trigger);
		act(() => {
			// Takes 300ms to change to 'shown' from 'waiting-to-show'
			jest.advanceTimersByTime(290);
		});
		unmount();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
		expect(console.error).not.toHaveBeenCalled();
		(global.console.error as jest.Mock).mockRestore();
	});

	it('should remove a visible tooltip when unmounted', () => {
		jest.spyOn(global.console, 'error');
		const { unmount } = render(
			<Tooltip testId="tooltip" content="hello world" position="left">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		const trigger = screen.getByTestId('trigger');

		fireEvent.mouseOver(trigger);
		act(() => {
			// Takes 300ms to change to 'shown' from 'waiting-to-show'
			jest.advanceTimersByTime(400);
		});
		unmount();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
		expect(console.error).not.toHaveBeenCalled();
		(global.console.error as jest.Mock).mockRestore();
	});

	it('should remove a tooltip that is waiting to hide when unmounted', () => {
		jest.spyOn(global.console, 'error');
		const { unmount } = render(
			<Tooltip testId="tooltip" content="hello world" position="left">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		const trigger = screen.getByTestId('trigger');

		fireEvent.mouseOver(trigger);
		act(() => {
			jest.runAllTimers();
		});

		expect(screen.getByTestId('tooltip')).toBeInTheDocument();

		fireEvent.mouseOut(trigger);
		act(() => {
			// Takes 300ms to change to 'waiting-to-hide' from 'hide-animating'
			jest.advanceTimersByTime(290);
		});
		unmount();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
		expect(console.error).not.toHaveBeenCalled();
		(global.console.error as jest.Mock).mockRestore();
	});

	it('should remove a tooltip that is hiding when unmounted', () => {
		jest.spyOn(global.console, 'error');
		const { unmount } = render(
			<Tooltip testId="tooltip" content="hello world" position="left">
				<button data-testid="trigger" type="button">
					focus me
				</button>
			</Tooltip>,
		);

		const trigger = screen.getByTestId('trigger');

		fireEvent.mouseOver(trigger);
		act(() => {
			jest.runAllTimers();
		});

		expect(screen.getByTestId('tooltip')).toBeInTheDocument();
		fireEvent.mouseOut(trigger);

		act(() => {
			// Takes 300ms to change to 'waiting-to-hide' from 'hide-animating'
			// This will flush the delay but not motion
			jest.runOnlyPendingTimers();
		});
		unmount();

		expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
		expect(console.error).not.toHaveBeenCalled();
		(global.console.error as jest.Mock).mockRestore();
	});
});
