import React from 'react';

import { act, type EventType, fireEvent, render, screen } from '@testing-library/react';

import SettingsIcon from '@atlaskit/icon/core/settings';

import LinkIconButton from '../../../new-button/variants/icon/link';
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

describe('LinkIconButton: compact spacing with tooltip', () => {
	it('applies compact dimensions (1.5rem) to the trigger when spacing="compact" and tooltip enabled', () => {
		render(
			<LinkIconButton
				href="#"
				icon={SettingsIcon}
				label="Settings"
				spacing="compact"
				isTooltipDisabled={false}
				testId="link-icon-button"
			/>,
		);

		const trigger = screen.getByTestId('link-icon-button');
		expect(trigger).toHaveStyle({ height: '1.5rem', width: '1.5rem' });
	});

	it('applies compact dimensions (1.5rem) to the anchor when spacing="compact" and tooltip disabled', () => {
		render(
			<LinkIconButton
				href="#"
				icon={SettingsIcon}
				label="Settings"
				spacing="compact"
				isTooltipDisabled
				testId="link-icon-button"
			/>,
		);

		const anchor = screen.getByTestId('link-icon-button');
		expect(anchor).toHaveStyle({ height: '1.5rem', width: '1.5rem' });
	});

	it('applies compact dimensions (1.5rem) with custom tooltip content when spacing="compact" and tooltip enabled', () => {
		render(
			<LinkIconButton
				href="/settings"
				icon={SettingsIcon}
				label="Settings"
				spacing="compact"
				isTooltipDisabled={false}
				tooltip={{ content: 'Open settings' }}
				testId="link-icon-button"
			/>,
		);

		const trigger = screen.getByTestId('link-icon-button');
		expect(trigger).toHaveStyle({ height: '1.5rem', width: '1.5rem' });
	});

	it('renders an anchor with href when tooltip enabled or disabled', () => {
		const { rerender } = render(
			<LinkIconButton
				href="/page"
				icon={SettingsIcon}
				label="Settings"
				spacing="compact"
				isTooltipDisabled={false}
				testId="link-icon-button"
			/>,
		);

		let el = screen.getByTestId('link-icon-button');
		expect(el.tagName).toBe('A');
		expect(el).toHaveAttribute('href', '/page');

		rerender(
			<LinkIconButton
				href="/other"
				icon={SettingsIcon}
				label="Settings"
				spacing="compact"
				isTooltipDisabled
				testId="link-icon-button"
			/>,
		);

		el = screen.getByTestId('link-icon-button');
		expect(el.tagName).toBe('A');
		expect(el).toHaveAttribute('href', '/other');
	});

	describe('integration: tooltip and compact spacing', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.useRealTimers();
			jest.clearAllTimers();
		});

		it('tooltip shows on hover and trigger retains compact dimensions when spacing="compact" and isTooltipDisabled={false}', () => {
			render(
				<LinkIconButton
					href="#"
					icon={SettingsIcon}
					label="Settings"
					spacing="compact"
					isTooltipDisabled={false}
					testId="link-icon-button"
				/>,
			);

			const trigger = screen.getByTestId('link-icon-button');
			expect(trigger).toHaveStyle({ height: '1.5rem', width: '1.5rem' });

			fireEvent.mouseOver(trigger);

			act(() => {
				jest.runAllTimers();
			});

			expect(screen.getByRole('tooltip')).toHaveTextContent('Settings');
			expect(trigger).toHaveStyle({ height: '1.5rem', width: '1.5rem' });
		});
	});
});

describe('LinkIconButton: default spacing (regression)', () => {
	it('applies default icon button dimensions (2rem) to the trigger when tooltip enabled and spacing is not compact', () => {
		render(
			<LinkIconButton
				href="#"
				icon={SettingsIcon}
				label="Settings"
				isTooltipDisabled={false}
				testId="link-icon-button"
			/>,
		);

		const trigger = screen.getByTestId('link-icon-button');
		expect(trigger).toHaveStyle({ height: '2rem', width: '2rem' });
	});

	it('applies default icon button dimensions (2rem) to the anchor when tooltip disabled and spacing is not compact', () => {
		render(
			<LinkIconButton
				href="#"
				icon={SettingsIcon}
				label="Settings"
				isTooltipDisabled
				testId="link-icon-button"
			/>,
		);

		const anchor = screen.getByTestId('link-icon-button');
		expect(anchor).toHaveStyle({ height: '2rem', width: '2rem' });
	});
});
