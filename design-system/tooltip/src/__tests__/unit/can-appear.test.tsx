import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { skipA11yAudit } from '@af/accessibility-testing';
import { fg } from '@atlaskit/platform-feature-flags';

import Tooltip from '../../tooltip';

jest.useFakeTimers();
jest.mock('@atlaskit/platform-feature-flags');
const mockGetBooleanFF = fg as jest.MockedFunction<typeof fg>;

beforeEach(() => {
	mockGetBooleanFF.mockImplementation((key) => key === 'platform-tooltip-focus-visible');
	HTMLElement.prototype.matches = jest.fn().mockReturnValue(true);

	skipA11yAudit();
});

it('should only allow a tooltip to open if canAppear returns true [mouse]', () => {
	let canAppear: boolean = false;

	render(
		<Tooltip testId="tooltip" content="hi there" canAppear={() => canAppear}>
			{(tooltipProps) => (
				<button {...tooltipProps} data-testid="trigger" type="button">
					Trigger
				</button>
			)}
		</Tooltip>,
	);

	const trigger = screen.getByTestId('trigger');

	// no tooltip yet
	expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

	fireEvent.mouseOver(trigger);
	act(() => jest.runAllTimers());

	expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

	// now allowing tooltip to be displayed
	canAppear = true;

	fireEvent.mouseOver(trigger);
	act(() => jest.runAllTimers());

	expect(screen.getByTestId('tooltip')).toBeInTheDocument();
});

it('should only allow a tooltip to open if canAppear returns true [keyboard]', () => {
	let canAppear: boolean = false;

	render(
		<Tooltip testId="tooltip" content="hi there" canAppear={() => canAppear}>
			{(tooltipProps) => (
				<button {...tooltipProps} data-testid="trigger" type="button">
					Trigger
				</button>
			)}
		</Tooltip>,
	);

	const trigger = screen.getByTestId('trigger');

	// no tooltip yet
	expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

	fireEvent.focus(trigger);
	act(() => jest.runAllTimers());

	expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

	fireEvent.focus(document.body);

	// now allowing tooltip to be displayed
	canAppear = true;

	fireEvent.focus(trigger);
	act(() => jest.runAllTimers());

	expect(screen.getByTestId('tooltip')).toBeInTheDocument();
});

it('should allow moving from canAppear:false to canAppear:true when not open', () => {
	let canAppear: boolean = false;

	render(
		<Tooltip testId="tooltip" content="hi there" canAppear={() => canAppear}>
			{(tooltipProps) => (
				<button {...tooltipProps} data-testid="trigger" type="button">
					Trigger
				</button>
			)}
		</Tooltip>,
	);

	const trigger = screen.getByTestId('trigger');

	// no tooltip yet
	expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

	// can show is false - so won't show.
	fireEvent.mouseOver(trigger);

	// timer not yet run to show tooltip
	canAppear = true;

	// next mouse over still showing a tooltip
	fireEvent.mouseOver(trigger);
	act(() => jest.runAllTimers());

	expect(screen.getByTestId('tooltip')).toBeInTheDocument();
});

it('should not check whether to show once a show is scheduled', () => {
	const canAppearFn = jest.fn(() => true);

	render(
		<Tooltip testId="tooltip" content="hi there" canAppear={canAppearFn}>
			{(tooltipProps) => (
				<button {...tooltipProps} data-testid="trigger" type="button">
					Trigger
				</button>
			)}
		</Tooltip>,
	);

	const trigger = screen.getByTestId('trigger');

	// no tooltip yet
	expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

	// will start the schedule to show a tooltip
	fireEvent.mouseOver(trigger);
	expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
	expect(canAppearFn).toHaveBeenCalledTimes(1);
	canAppearFn.mockReset();

	// another mouse over before tooltip is showed
	fireEvent.mouseOver(trigger);
	expect(canAppearFn).not.toHaveBeenCalled();

	act(() => jest.runAllTimers());

	expect(canAppearFn).not.toHaveBeenCalled();
	expect(screen.getByTestId('tooltip')).toBeInTheDocument();
});

it('should not check whether to show once a tooltip is open', () => {
	const canAppearFn = jest.fn(() => true);

	render(
		<Tooltip testId="tooltip" content="hi there" canAppear={canAppearFn}>
			{(tooltipProps) => (
				<button {...tooltipProps} data-testid="trigger" type="button">
					Trigger
				</button>
			)}
		</Tooltip>,
	);

	const trigger = screen.getByTestId('trigger');

	// no tooltip yet
	expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

	// will start the schedule to show a tooltip
	fireEvent.mouseOver(trigger);
	expect(canAppearFn).toHaveBeenCalledTimes(1);
	canAppearFn.mockReset();

	// let the tooltip show
	act(() => jest.runAllTimers());
	expect(screen.getByTestId('tooltip')).toBeInTheDocument();

	fireEvent.mouseOver(trigger);
	fireEvent.mouseMove(trigger);
	expect(canAppearFn).not.toHaveBeenCalled();
});
