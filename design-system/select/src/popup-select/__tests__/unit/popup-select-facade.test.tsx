import React, { createRef } from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { act, render, waitFor } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { type OptionsType } from '../../../types';
import { PopupSelect } from '../../popup-select';

const OPTIONS: OptionsType = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
];

type PopupSelectPopperProps = PopupSelect['props']['popperProps'];
const popperProps: PopupSelectPopperProps = { placement: 'bottom-start' };

describe.each([
	['legacy', failGate],
	['top layer', passGate],
] as const)('PopupSelect facade: %s implementation', (_implementation, setGate) => {
	beforeEach(() => {
		setGate('platform-dst-top-layer');
	});

	it('preserves the class instance and imperative API', async () => {
		const ref = createRef<PopupSelect>();
		const onOpen = jest.fn();
		const onClose = jest.fn();

		render(
			<PopupSelect
				ref={ref}
				options={OPTIONS}
				popperProps={popperProps}
				onOpen={onOpen}
				onClose={onClose}
				testId="popup-select"
				label="Cities"
				target={({ ref: targetRef }) => (
					<button type="button" ref={targetRef} data-testid="trigger">
						Choose
					</button>
				)}
			/>,
		);

		expect(ref.current).toBeInstanceOf(PopupSelect);
		expect(ref.current?.targetRef).toBe(screen.getByTestId('trigger'));

		act(() => ref.current?.open());

		await waitFor(() => expect(ref.current?.menuRef).not.toBeNull());
		expect(ref.current?.selectRef).not.toBeNull();
		expect(onOpen).toHaveBeenCalledTimes(1);

		act(() => ref.current?.close());

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it.each([true, false])(
		'opens with shouldFocusOptionOnOpen=%s',
		async (shouldFocusOptionOnOpen) => {
			render(
				<PopupSelect
					options={OPTIONS}
					label="Find cities"
					searchThreshold={0}
					popperProps={popperProps}
					shouldFocusOptionOnOpen={shouldFocusOptionOnOpen}
					target={({ isOpen, ...triggerProps }) => (
						<button type="button" {...triggerProps}>
							Choose
						</button>
					)}
				/>,
			);
			await userEvent.click(screen.getByRole('button', { name: 'Choose' }));
			const input = screen.getByRole('combobox', { name: 'Find cities' });
			await waitFor(() => expect(input).toHaveFocus());
			expect(screen.getByRole('listbox')).toBeVisible();
			if (shouldFocusOptionOnOpen) {
				expect(input).toHaveAttribute('aria-activedescendant', screen.getAllByRole('option')[0].id);
			} else {
				expect(input).not.toHaveAttribute('aria-activedescendant');
				await userEvent.keyboard('{arrowdown}');
				expect(input).toHaveAttribute('aria-activedescendant', screen.getAllByRole('option')[0].id);
			}
		},
	);
});
