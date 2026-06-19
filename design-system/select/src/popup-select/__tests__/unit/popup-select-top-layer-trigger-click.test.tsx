import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { skipA11yAudit } from '@af/accessibility-testing';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { type OptionsType, PopupSelect } from '../../../index';

const OPTIONS: OptionsType = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
];

// These tests cover the regression where consumers that do NOT spread
// `triggerProps` onto their target could not open the popup when running
// on the top-layer code path (`platform-dst-top-layer`). The fix re-instates
// the legacy global click listener inside `PopupSelectTopLayer` so the
// trigger click is observed regardless of whether the consumer wires up
// `triggerProps`.
// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('PopupSelect top-layer: trigger click', () => {
	beforeEach(() => {
		skipA11yAudit();
		passGate('platform-dst-top-layer');
	});

	it('opens the menu when consumer does NOT spread triggerProps onto the target', async () => {
		const user = userEvent.setup();

		render(
			<PopupSelect
				options={OPTIONS}
				testId="popup-select"
				label="Cities"
				// Consumer intentionally ignores `triggerProps` (legacy pattern).
				target={({ ref }) => (
					<button type="button" ref={ref} data-testid="trigger">
						Choose
					</button>
				)}
			/>,
		);

		expect(screen.queryByTestId('popup-select--menu')).not.toBeInTheDocument();

		await user.click(screen.getByTestId('trigger'));

		expect(await screen.findByTestId('popup-select--menu')).toBeInTheDocument();
	});

	it('fires onOpen exactly once per trigger click', async () => {
		const user = userEvent.setup();
		const onOpen = jest.fn();

		render(
			<PopupSelect
				options={OPTIONS}
				testId="popup-select"
				label="Cities"
				onOpen={onOpen}
				target={({ ref }) => (
					<button type="button" ref={ref} data-testid="trigger">
						Choose
					</button>
				)}
			/>,
		);

		await user.click(screen.getByTestId('trigger'));

		expect(await screen.findByTestId('popup-select--menu')).toBeInTheDocument();
		expect(onOpen).toHaveBeenCalledTimes(1);
	});

	it('does not open when a click lands outside the trigger', async () => {
		const user = userEvent.setup();
		const onOpen = jest.fn();

		render(
			<div>
				<button type="button" data-testid="outside">
					Outside
				</button>
				<PopupSelect
					options={OPTIONS}
					testId="popup-select"
					label="Cities"
					onOpen={onOpen}
					target={({ ref }) => (
						<button type="button" ref={ref} data-testid="trigger">
							Choose
						</button>
					)}
				/>
			</div>,
		);

		await user.click(screen.getByTestId('outside'));

		expect(onOpen).not.toHaveBeenCalled();
		expect(screen.queryByTestId('popup-select--menu')).not.toBeInTheDocument();
	});
});
