import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import __noop from '@atlaskit/ds-lib/noop';
import Lozenge, { LozengeDropdownTrigger } from '@atlaskit/lozenge';
import { ffTest } from '@atlassian/feature-flags-test-utils';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;
// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Lozenge', () => {
	it('@atlaskit/lozenge should have Compiled styles', () => {
		render(<Lozenge testId="test">Hello</Lozenge>);

		const lozenge = screen.getByTestId('test');
		expect(lozenge).toBeInTheDocument();

		expect(lozenge).toHaveAttribute('class', expect.stringMatching(/^(_[a-z0-9]{8}\s?)+$/));
	});

	ffTest.on('platform-dst-lozenge-tag-badge-visual-uplifts', 'feature flag enabled', () => {
		it('should render with compiled styles', () => {
			render(<Lozenge testId="test">Hello</Lozenge>);

			const lozenge = screen.getByTestId('test');
			expect(lozenge).toBeInTheDocument();

			expect(lozenge).toHaveAttribute('class', expect.stringMatching(/^(_[a-z0-9]{8}\s?)+$/));
		});

		it('should support spacing prop', () => {
			render(
				<Lozenge testId="spacious" appearance="neutral" spacing="spacious">
					Spacious
				</Lozenge>,
			);

			const lozenge = screen.getByTestId('spacious');
			expect(lozenge).toBeInTheDocument();
		});

		it('should render with semantic color', () => {
			render(
				<LozengeDropdownTrigger appearance="success" isSelected={false} onClick={__noop}>
					Success Status
				</LozengeDropdownTrigger>,
			);

			const trigger = screen.getByText('Success Status');
			expect(trigger).toBeInTheDocument();
		});

		it('should support all semantic colors', () => {
			const semanticColors = [
				'success',
				'warning',
				'danger',
				'information',
				'discovery',
				'neutral',
			];

			semanticColors.forEach((color) => {
				const { unmount } = render(
					<LozengeDropdownTrigger
						appearance={color as any}
						isSelected={false}
						onClick={__noop}
						testId={`trigger-${color}`}
					>
						{color}
					</LozengeDropdownTrigger>,
				);

				expect(screen.getByTestId(`trigger-${color}`)).toBeInTheDocument();
				unmount();
			});
		});

		it('should render with accent color', () => {
			render(
				<LozengeDropdownTrigger appearance="accent-blue" isSelected={false} onClick={__noop}>
					Accent Blue
				</LozengeDropdownTrigger>,
			);

			const trigger = screen.getByText('Accent Blue');
			expect(trigger).toBeInTheDocument();
		});

		it('should render with icon when iconBefore is provided', () => {
			const TestIcon = () => <span data-testid="test-icon">Icon</span>;

			render(
				<LozengeDropdownTrigger
					appearance="success"
					isSelected={false}
					onClick={__noop}
					iconBefore={TestIcon}
					testId="trigger-with-icon"
				>
					With Icon
				</LozengeDropdownTrigger>,
			);

			const icon = screen.getByTestId('test-icon');
			expect(icon).toBeInTheDocument();
		});

		it('should support all accent colors', () => {
			const accentColors = [
				'accent-red',
				'accent-orange',
				'accent-yellow',
				'accent-lime',
				'accent-green',
				'accent-teal',
				'accent-blue',
				'accent-purple',
				'accent-magenta',
				'accent-gray',
			];

			accentColors.forEach((color) => {
				const { unmount } = render(
					<LozengeDropdownTrigger
						appearance={color as any}
						isSelected={false}
						onClick={__noop}
						testId={`trigger-${color}`}
					>
						{color}
					</LozengeDropdownTrigger>,
				);

				expect(screen.getByTestId(`trigger-${color}`)).toBeInTheDocument();
				unmount();
			});
		});

		it('should support maxWidth prop', () => {
			render(
				<LozengeDropdownTrigger
					appearance="success"
					isSelected={false}
					onClick={__noop}
					maxWidth={150}
					testId="trigger-max-width"
				>
					Very Long Status Label That Should Truncate
				</LozengeDropdownTrigger>,
			);

			const trigger = screen.getByTestId('trigger-max-width');
			expect(trigger).toBeInTheDocument();
		});

		it('should support custom style prop', () => {
			render(
				<LozengeDropdownTrigger
					appearance="success"
					isSelected={false}
					onClick={__noop}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					style={{ backgroundColor: '#e8f4f8', color: '#0052cc' }}
					testId="trigger-custom-style"
				>
					Custom Style
				</LozengeDropdownTrigger>,
			);

			const trigger = screen.getByTestId('trigger-custom-style');
			expect(trigger).toBeInTheDocument();
		});

		it('should render chevron icon with testId', () => {
			render(
				<LozengeDropdownTrigger
					appearance="success"
					isSelected={false}
					onClick={__noop}
					testId="status-trigger"
				>
					Status
				</LozengeDropdownTrigger>,
			);

			const chevron = screen.getByTestId('status-trigger--chevron');
			expect(chevron).toBeInTheDocument();
		});
	});
});

describe('LozengeDropdownTrigger', () => {
	it('should render with testId', () => {
		render(
			<LozengeDropdownTrigger
				appearance="success"
				isSelected={false}
				onClick={__noop}
				testId="status-trigger"
			>
				Status
			</LozengeDropdownTrigger>,
		);

		const trigger = screen.getByTestId('status-trigger');
		expect(trigger).toBeInTheDocument();
	});

	it('should call onClick when clicked', () => {
		const handleClick = jest.fn();
		render(
			<LozengeDropdownTrigger appearance="success" isSelected={false} onClick={handleClick}>
				Click Me
			</LozengeDropdownTrigger>,
		);

		const trigger = screen.getByText('Click Me');
		fireEvent.click(trigger);

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('should render a spinner and be non-interactive when loading', () => {
		const handleClick = jest.fn();

		render(
			<LozengeDropdownTrigger
				appearance="success"
				isSelected={false}
				isLoading
				onClick={handleClick}
				testId="loading-trigger"
			>
				Status
			</LozengeDropdownTrigger>,
		);

		const trigger = screen.getByTestId('loading-trigger');
		expect(trigger).toBeDisabled();
		expect(trigger).toHaveAttribute('aria-busy', 'true');
		expect(trigger).toHaveAttribute('aria-label', 'Loading');

		// Text remains rendered (to avoid width changes)
		expect(screen.getByText('Status')).toBeInTheDocument();

		// Spinner is rendered in the overlay
		expect(screen.getByTestId('loading-trigger--loading-spinner')).toBeInTheDocument();
		expect(screen.getByTestId('loading-trigger--loading-spinner-wrapper')).toBeInTheDocument();

		fireEvent.click(trigger);
		expect(handleClick).not.toHaveBeenCalled();
	});

	it('should have selected state styling when isSelected is true', () => {
		const { rerender } = render(
			<LozengeDropdownTrigger appearance="success" isSelected={false} onClick={__noop}>
				Status
			</LozengeDropdownTrigger>,
		);

		let trigger = screen.getByText('Status');
		expect(trigger).toBeInTheDocument();

		rerender(
			<LozengeDropdownTrigger appearance="success" isSelected={true} onClick={__noop}>
				Status
			</LozengeDropdownTrigger>,
		);

		trigger = screen.getByText('Status');
		expect(trigger).toBeInTheDocument();
	});

	it('should forward ref correctly', () => {
		const ref = React.createRef<HTMLElement>();

		render(
			<LozengeDropdownTrigger ref={ref} appearance="success" isSelected={false} onClick={__noop}>
				Status
			</LozengeDropdownTrigger>,
		);

		expect(ref.current).toBeDefined();
		expect(ref.current).toBeInTheDocument();
	});

	describe('Analytics', () => {
		it('should fire an analytics event on click', () => {
			const onEvent = jest.fn();
			const handleClick = jest.fn();

			render(
				<AnalyticsListener onEvent={onEvent} channel="atlaskit">
					<LozengeDropdownTrigger
						appearance="success"
						isSelected={false}
						onClick={(event, analyticsEvent) => {
							handleClick(event);
							analyticsEvent.fire();
						}}
						testId="analytics-trigger"
					>
						Status
					</LozengeDropdownTrigger>
				</AnalyticsListener>,
			);

			const trigger = screen.getByTestId('analytics-trigger');
			fireEvent.click(trigger);

			expect(handleClick).toHaveBeenCalledTimes(1);
			expect(onEvent).toHaveBeenCalledTimes(1);
		});

		it('should send correct analytics payload', () => {
			const onEvent = jest.fn();

			render(
				<AnalyticsListener onEvent={onEvent} channel="atlaskit">
					<LozengeDropdownTrigger
						appearance="success"
						isSelected={false}
						onClick={(_, analyticsEvent) => {
							analyticsEvent.fire();
						}}
						testId="payload-trigger"
					>
						Status
					</LozengeDropdownTrigger>
				</AnalyticsListener>,
			);

			const trigger = screen.getByTestId('payload-trigger');
			fireEvent.click(trigger);

			expect(onEvent).toHaveBeenCalledTimes(1);

			const event = onEvent.mock.calls[0][0];
			expect(event.payload).toMatchObject({
				action: 'clicked',
				actionSubject: 'button',
				attributes: {
					componentName: 'LozengeDropdownTrigger',
					packageName,
					packageVersion,
				},
			});
		});

		it('should include additional analyticsContext in the event context', () => {
			const onEvent = jest.fn();
			const extraContext = { statusType: 'issue-status', projectKey: 'TEST' };

			render(
				<AnalyticsListener onEvent={onEvent} channel="atlaskit">
					<LozengeDropdownTrigger
						appearance="success"
						isSelected={false}
						onClick={(_, analyticsEvent) => {
							analyticsEvent.fire();
						}}
						analyticsContext={extraContext}
						testId="context-trigger"
					>
						Status
					</LozengeDropdownTrigger>
				</AnalyticsListener>,
			);

			const trigger = screen.getByTestId('context-trigger');
			fireEvent.click(trigger);

			expect(onEvent).toHaveBeenCalledTimes(1);

			const event = onEvent.mock.calls[0][0];
			const expectedContext = new UIAnalyticsEvent({
				payload: {
					context: [
						{
							componentName: 'LozengeDropdownTrigger',
							packageName,
							packageVersion,
							...extraContext,
						},
					],
				},
			});

			expect(event.context).toEqual(expectedContext.payload.context);
		});

		it('should fire on both public and atlaskit channels', () => {
			const onPublicEvent = jest.fn();
			const onAtlaskitEvent = jest.fn();

			render(
				<AnalyticsListener onEvent={onAtlaskitEvent} channel="atlaskit">
					<AnalyticsListener onEvent={onPublicEvent}>
						<LozengeDropdownTrigger
							appearance="success"
							isSelected={false}
							onClick={(_, analyticsEvent) => {
								analyticsEvent.fire();
							}}
							testId="dual-channel-trigger"
						>
							Status
						</LozengeDropdownTrigger>
					</AnalyticsListener>
				</AnalyticsListener>,
			);

			const trigger = screen.getByTestId('dual-channel-trigger');
			fireEvent.click(trigger);

			expect(onPublicEvent).toHaveBeenCalledTimes(1);
			expect(onAtlaskitEvent).toHaveBeenCalledTimes(1);

			// Both should have the same payload
			expect(onPublicEvent.mock.calls[0][0].payload).toEqual(
				onAtlaskitEvent.mock.calls[0][0].payload,
			);
		});

		it('should not error if there is no analytics provider', () => {
			const error = jest.spyOn(console, 'error');
			const handleClick = jest.fn();

			render(
				<LozengeDropdownTrigger
					appearance="success"
					isSelected={false}
					onClick={handleClick}
					testId="no-provider-trigger"
				>
					Status
				</LozengeDropdownTrigger>,
			);

			const trigger = screen.getByTestId('no-provider-trigger');
			fireEvent.click(trigger);

			expect(handleClick).toHaveBeenCalledTimes(1);
			expect(error).not.toHaveBeenCalled();
			error.mockRestore();
		});

		it('should pass analyticsEvent as second argument to onClick', () => {
			const handleClick = jest.fn();

			render(
				<LozengeDropdownTrigger
					appearance="success"
					isSelected={false}
					onClick={handleClick}
					testId="callback-trigger"
				>
					Status
				</LozengeDropdownTrigger>,
			);

			const trigger = screen.getByTestId('callback-trigger');
			fireEvent.click(trigger);

			expect(handleClick).toHaveBeenCalledTimes(1);

			const [event, analyticsEvent] = handleClick.mock.calls[0];
			expect(event).toBeDefined();
			expect(event.type).toBe('click');
			expect(analyticsEvent).toBeDefined();
			expect(analyticsEvent).toBeInstanceOf(UIAnalyticsEvent);
		});

		it('should support interactionName for UFO tracking', () => {
			const handleClick = jest.fn();

			render(
				<LozengeDropdownTrigger
					appearance="success"
					isSelected={false}
					onClick={handleClick}
					interactionName="status-switcher"
					testId="ufo-trigger"
				>
					Status
				</LozengeDropdownTrigger>,
			);

			const trigger = screen.getByTestId('ufo-trigger');
			expect(trigger).toBeInTheDocument();

			fireEvent.click(trigger);
			expect(handleClick).toHaveBeenCalledTimes(1);
		});
	});
});
