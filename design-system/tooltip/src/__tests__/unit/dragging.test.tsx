import React from 'react';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { register } from '../../internal/drag-manager';
import Tooltip from '../../Tooltip';

beforeEach(() => {
	jest.useFakeTimers();
});

afterEach(() => {
	jest.useRealTimers();
});

function runAllTimers() {
	act(() => {
		jest.runAllTimers();
	});
}

function tryShowTooltip({ shouldRunTimers }: { shouldRunTimers: boolean }) {
	fireEvent.mouseOver(screen.getByTestId('trigger'));
	if (shouldRunTimers) {
		runAllTimers();
	}
}

function noop() {}

const scenarios = [
	{
		name: 'wrapped API',
		jsx: (
			<Tooltip testId="tooltip" content="hello world">
				<button data-testid="trigger" draggable>
					focus me
				</button>
			</Tooltip>
		),
	},
	{
		name: 'renderProp API',
		jsx: (
			<Tooltip testId="tooltip" content="hello world">
				{(tooltipProps) => (
					<button {...tooltipProps} data-testid="trigger" draggable>
						focus me
					</button>
				)}
			</Tooltip>
		),
	},
];

describe('behavior during drags', () => {
	afterEach(() => {
		// Ensure any ongoing drag is finished
		fireEvent.dragEnd(window);
	});

	scenarios.forEach(({ name, jsx }) => {
		describe(name, () => {
			it('should hide a visible tooltip when a drag starts', () => {
				const { getByTestId, queryByTestId } = render(jsx);

				tryShowTooltip({ shouldRunTimers: true });
				expect(getByTestId('tooltip')).toBeInTheDocument();

				fireEvent.dragStart(getByTestId('trigger'));
				expect(queryByTestId('tooltip')).not.toBeInTheDocument();
			});

			it('should cancel a waiting-to-show tooltip when a drag starts', () => {
				const { getByTestId, queryByTestId } = render(jsx);

				/**
				 * Trigger the tooltip, but don't run the timers, so it is still
				 * in a pending state.
				 */
				tryShowTooltip({ shouldRunTimers: false });

				/**
				 * Immediately after the drag there should not be a tooltip.
				 */
				fireEvent.dragStart(getByTestId('trigger'));
				expect(queryByTestId('tooltip')).not.toBeInTheDocument();

				/**
				 * Even after timers have run there should be no tooltip.
				 */
				runAllTimers();
				expect(queryByTestId('tooltip')).not.toBeInTheDocument();
			});

			it('should not show tooltips during a drag', () => {
				const { getByTestId, queryByTestId } = render(jsx);

				fireEvent.dragStart(getByTestId('trigger'));

				tryShowTooltip({ shouldRunTimers: true });
				expect(queryByTestId('tooltip')).not.toBeInTheDocument();
			});

			it('should not suppress tooltips after a drag', () => {
				const { getByTestId, queryByTestId } = render(jsx);

				const trigger = getByTestId('trigger');
				fireEvent.dragStart(trigger);
				fireEvent.dragEnd(trigger);

				tryShowTooltip({ shouldRunTimers: true });
				expect(queryByTestId('tooltip')).toBeInTheDocument();
			});
		});
	});

	describe('event binding', () => {
		const addEventListener = jest.spyOn(window, 'addEventListener');
		const removeEventListener = jest.spyOn(window, 'removeEventListener');

		function hasBoundListenerForEvent(eventName: string) {
			// @ts-ignore UTEST-1630
			return addEventListener.mock.calls.some((args) => args[0] === eventName);
		}

		function hasRemovedListenerForEvent(eventName: string) {
			// @ts-ignore UTEST-1630
			return removeEventListener.mock.calls.some((args) => args[0] === eventName);
		}

		beforeEach(() => {
			addEventListener.mockClear();
			removeEventListener.mockClear();
		});

		it('should bind start listeners after a tooltip is rendered', async () => {
			expect(addEventListener).not.toHaveBeenCalled();

			render(
				<Tooltip testId="tooltip" content="hello world">
					{null}
				</Tooltip>,
			);

			await waitFor(() => {
				expect(hasBoundListenerForEvent('dragstart')).toBe(true);
				expect(hasBoundListenerForEvent('dragenter')).toBe(true);
			});
		});

		it('should only bind start listeners once', () => {
			const { rerender } = render(
				<Tooltip testId="tooltip" content="hello world">
					{null}
				</Tooltip>,
			);

			addEventListener.mockClear();

			rerender(
				<>
					<Tooltip testId="tooltip" content="hello world">
						{null}
					</Tooltip>
					<Tooltip testId="tooltip" content="hello world">
						{null}
					</Tooltip>
				</>,
			);

			expect(hasBoundListenerForEvent('dragstart')).toBe(false);
			expect(hasBoundListenerForEvent('dragenter')).toBe(false);
		});

		it('should only bind end listeners after a drag starts', () => {
			render(
				<Tooltip testId="tooltip" content="hello world">
					<button data-testid="trigger" draggable>
						focus me
					</button>
				</Tooltip>,
			);

			expect(hasBoundListenerForEvent('dragend')).toBe(false);
			expect(hasBoundListenerForEvent('pointerdown')).toBe(false);
			expect(hasBoundListenerForEvent('pointermove')).toBe(false);

			fireEvent.dragStart(screen.getByTestId('trigger'));

			expect(hasBoundListenerForEvent('dragend')).toBe(true);
			expect(hasBoundListenerForEvent('pointerdown')).toBe(true);
			expect(hasBoundListenerForEvent('pointermove')).toBe(true);
		});

		it('should unbind end listeners after a drag ends', () => {
			render(
				<Tooltip testId="tooltip" content="hello world">
					<button data-testid="trigger" draggable>
						focus me
					</button>
				</Tooltip>,
			);

			fireEvent.dragStart(screen.getByTestId('trigger'));

			const addEventListenerCalls = addEventListener.mock.calls.filter(
				// @ts-ignore UTEST-1630
				([eventName]) =>
					eventName === 'dragend' || eventName === 'pointerdown' || eventName === 'pointermove',
			);

			expect(addEventListenerCalls).toHaveLength(3);

			fireEvent.dragEnd(window);

			// @ts-ignore UTEST-1630
			addEventListenerCalls.forEach((args) => {
				expect(removeEventListener).toHaveBeenCalledWith(...args);
			});
		});

		it('should unbind start listeners if no more tooltips are registered', () => {
			const { rerender } = render(
				<Tooltip testId="tooltip" content="hello world">
					{null}
				</Tooltip>,
			);

			const addEventListenerCalls = addEventListener.mock.calls.filter(
				// @ts-ignore UTEST-1630
				([eventName]) => eventName === 'dragstart' || eventName === 'dragenter',
			);
			expect(addEventListenerCalls).toHaveLength(2);

			rerender(<div />);

			// @ts-ignore UTEST-1630
			addEventListenerCalls.forEach((args) => {
				expect(removeEventListener).toHaveBeenCalledWith(...args);
			});
		});

		it('should not rebind dragging event listeners if the only tooltip during a drag is unregistered and re-registered', () => {
			const { rerender } = render(
				<Tooltip testId="tooltip" content="hello world">
					<button data-testid="trigger" draggable>
						focus me
					</button>
				</Tooltip>,
			);

			fireEvent.dragStart(screen.getByTestId('trigger'));

			addEventListener.mockClear();
			removeEventListener.mockClear();

			rerender(
				<Tooltip testId="tooltip" content="hello world" key={2}>
					<button data-testid="trigger" draggable>
						focus me
					</button>
				</Tooltip>,
			);

			/**
			 * The start bindings are recreated, because they are cleared when there
			 * are no registrations.
			 */
			expect(hasRemovedListenerForEvent('dragstart')).toBe(true);
			expect(hasRemovedListenerForEvent('dragenter')).toBe(true);

			expect(hasBoundListenerForEvent('dragstart')).toBe(true);
			expect(hasBoundListenerForEvent('dragenter')).toBe(true);

			/**
			 * The end bindings are not recreated, because they are only created
			 * on drag start, and are only cleared when a drag ends.
			 */
			expect(hasRemovedListenerForEvent('dragend')).toBe(false);
			expect(hasRemovedListenerForEvent('pointerdown')).toBe(false);
			expect(hasRemovedListenerForEvent('pointermove')).toBe(false);

			expect(hasBoundListenerForEvent('dragend')).toBe(false);
			expect(hasBoundListenerForEvent('pointerdown')).toBe(false);
			expect(hasBoundListenerForEvent('pointermove')).toBe(false);
		});

		it('should still call onDragEnd for tooltips that are registered after the drag has started', () => {
			const { rerender } = render(
				<Tooltip testId="tooltip-1" content="hello world">
					<button data-testid="trigger-1" draggable>
						focus me
					</button>
				</Tooltip>,
			);

			fireEvent.dragStart(screen.getByTestId('trigger-1'));

			rerender(
				<>
					<Tooltip testId="tooltip-1" content="hello world">
						<button data-testid="trigger-1" draggable>
							focus me
						</button>
					</Tooltip>
					<Tooltip testId="tooltip-2" content="registered after drag">
						<button data-testid="trigger-2" draggable>
							focus me
						</button>
					</Tooltip>
				</>,
			);

			fireEvent.dragEnd(window);

			/**
			 * We know the `onDragEnd` fired correctly for the new tooltip if
			 * we are able to trigger it.
			 */
			fireEvent.mouseOver(screen.getByTestId('trigger-2'));
			runAllTimers();
			expect(screen.getByTestId('tooltip-2')).toBeInTheDocument();
		});

		it('should still call onDragEnd for tooltips, even for an only tooltip that is unregistered and re-registered during a drag', () => {
			const { rerender } = render(
				<Tooltip testId="tooltip" content="hello world">
					<button data-testid="trigger" draggable>
						focus me
					</button>
				</Tooltip>,
			);

			fireEvent.dragStart(screen.getByTestId('trigger'));

			rerender(
				<Tooltip testId="tooltip" content="hello world">
					<button data-testid="trigger" draggable>
						focus me
					</button>
				</Tooltip>,
			);

			fireEvent.dragEnd(window);

			/**
			 * We know the `onDragEnd` fired correctly for the remounted tooltip if
			 * we are able to trigger it.
			 */
			tryShowTooltip({ shouldRunTimers: true });
			expect(screen.getByTestId('tooltip')).toBeInTheDocument();
		});

		it('should suppress tooltips, even if they mount during a drag', () => {
			const { rerender } = render(
				<Tooltip testId="tooltip-1" content="hello world">
					<button data-testid="trigger-1" draggable>
						focus me
					</button>
				</Tooltip>,
			);

			fireEvent.dragStart(screen.getByTestId('trigger-1'));

			rerender(
				<>
					<Tooltip testId="tooltip-1" content="hello world">
						<button data-testid="trigger-1" draggable>
							focus me
						</button>
					</Tooltip>
					<Tooltip testId="tooltip-2" content="registered after drag">
						<button data-testid="trigger-2" draggable>
							focus me
						</button>
					</Tooltip>
				</>,
			);

			/**
			 * We know the `onDragStart` fired correctly for the new tooltip if
			 * we are NOT able to trigger it.
			 */
			fireEvent.mouseOver(screen.getByTestId('trigger-2'));
			runAllTimers();
			expect(screen.queryByTestId('tooltip-2')).not.toBeInTheDocument();
		});
	});
});

/**
 * These tests don't test through the public API and are testing a situation
 * that might not actually be possible to create through public API.
 *
 * They were helpful for authoring and refining implementation decisions,
 * but are not necessarily something we need to keep and protect against
 * regression.
 *
 * If they don't make sense anymore we shouldn't feel hesitant to remove them.
 */
describe('drag manager', () => {
	it('should not call subscribers that are registered during onDragStart', () => {
		const outerOnDragStart = jest.fn();
		const outerOnRegister = jest.fn();

		const innerOnDragStart = jest.fn();
		const innerOnRegister = jest.fn();

		register({
			onRegister: outerOnRegister,
			onDragStart() {
				outerOnDragStart();
				register({
					onRegister: innerOnRegister,
					onDragStart: innerOnDragStart,
					onDragEnd: noop,
				});
			},
			onDragEnd: noop,
		});

		fireEvent.dragStart(window);

		expect(outerOnRegister).toHaveBeenCalledWith({ isDragging: false });
		expect(outerOnDragStart).toHaveBeenCalled();

		expect(innerOnRegister).toHaveBeenCalledWith({ isDragging: true });
		expect(innerOnDragStart).not.toHaveBeenCalled();
	});

	it('should not call subscribers that are registered during onDragEnd', () => {
		const outerOnDragEnd = jest.fn();
		const innerOnDragEnd = jest.fn();

		register({
			onRegister: noop,
			onDragStart: noop,
			onDragEnd() {
				outerOnDragEnd();
				register({
					onRegister: noop,
					onDragStart: noop,
					onDragEnd: innerOnDragEnd,
				});
			},
		});

		fireEvent.dragStart(window);
		fireEvent.dragEnd(window);

		expect(outerOnDragEnd).toHaveBeenCalled();
		expect(innerOnDragEnd).not.toHaveBeenCalled();
	});
});
