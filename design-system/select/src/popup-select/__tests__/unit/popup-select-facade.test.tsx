import React, { createRef } from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { act, render, screen, waitFor } from '@atlassian/testing-library';

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
});
