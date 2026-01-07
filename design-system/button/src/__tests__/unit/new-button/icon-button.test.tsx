import React from 'react';

import { act, type EventType, fireEvent, render, screen } from '@testing-library/react';

import { iconButtonVariants } from '../../../utils/variants';

iconButtonVariants.forEach(({ name, Component }) => {
	// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
	describe(name, () => {
		describe('tooltips', () => {
			beforeEach(() => {
				jest.useFakeTimers();
			});

			afterEach(() => {
				jest.useRealTimers();
				jest.clearAllTimers();
			});

			describe('disabled', () => {
				it('should not show tooltip', async () => {
					render(<Component testId="trigger" label="Hello!" isTooltipDisabled />);

					const trigger = screen.getByTestId('trigger');

					fireEvent.mouseOver(trigger);

					act(() => {
						jest.runAllTimers();
					});

					expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
				});
			});

			describe('enabled', () => {
				it('should show tooltip on hover when enabled', async () => {
					render(<Component testId="trigger" label="Hello!" isTooltipDisabled={false} />);

					const trigger = screen.getByTestId('trigger');

					fireEvent.mouseOver(trigger);

					act(() => {
						jest.runAllTimers();
					});

					expect(screen.getByRole('tooltip')).toHaveTextContent('Hello!');
				});

				it('should call custom callbacks', () => {
					const callbacks: Partial<Record<EventType, jest.Mock>> = {
						mouseOver: jest.fn(),
						mouseOut: jest.fn(),
						mouseMove: jest.fn(),
						mouseDown: jest.fn(),
						focus: jest.fn(),
						blur: jest.fn(),
						click: jest.fn(),
					};

					render(
						<Component
							testId="trigger"
							label="Hello!"
							isTooltipDisabled={false}
							onMouseOver={callbacks.mouseOver}
							onMouseOut={callbacks.mouseOut}
							onMouseMove={callbacks.mouseMove}
							onMouseDown={callbacks.mouseDown}
							onFocus={callbacks.focus}
							onBlur={callbacks.blur}
							onClick={callbacks.click}
						/>,
					);

					const trigger = screen.getByTestId('trigger');
					const events = Object.keys(callbacks) as EventType[];

					events.forEach((event) => fireEvent[event](trigger));

					act(() => {
						jest.runAllTimers();
					});

					events.forEach((event) => expect(callbacks[event]).toHaveBeenCalledTimes(1));
				});

				it('should allow tooltip to override label value', () => {
					render(
						<Component
							testId="trigger"
							label="Hello!"
							isTooltipDisabled={false}
							tooltip={{ content: 'World!' }}
						/>,
					);

					const trigger = screen.getByTestId('trigger');

					fireEvent.mouseOver(trigger);

					act(() => {
						jest.runAllTimers();
					});

					expect(screen.getByRole('tooltip')).toHaveTextContent('World!');
				});
			});
		});
	});
});
