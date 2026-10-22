import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { LeftArrow, RightArrow } from '../../filmstripView/wrappers';

const GATE = 'platform_media_filmstrip_arrow_type_fix';

describe('Filmstrip arrows rendered inside a form', () => {
	const setupWithForm = () => {
		const onLeftClick = jest.fn();
		const onRightClick = jest.fn();
		const onFormSubmit = jest.fn((e: React.FormEvent) => e.preventDefault());

		render(
			<form onSubmit={onFormSubmit}>
				<LeftArrow onClick={onLeftClick} />
				<RightArrow onClick={onRightClick} />
			</form>,
		);

		return { onLeftClick, onRightClick, onFormSubmit };
	};

	const getArrowButton = (label: 'left' | 'right') =>
		screen.getByLabelText(label).closest('button') as HTMLButtonElement;

	describe('when the gate is on', () => {
		beforeEach(() => passGate(GATE));

		it.each(['left', 'right'] as const)('should render the %s arrow as type="button"', (label) => {
			setupWithForm();

			expect(getArrowButton(label)).toHaveAttribute('type', 'button');
		});

		it.each(['left', 'right'] as const)(
			'should not submit the parent form when the %s arrow is clicked',
			async (label) => {
				const { onLeftClick, onRightClick, onFormSubmit } = setupWithForm();

				await userEvent.click(getArrowButton(label));

				expect(label === 'left' ? onLeftClick : onRightClick).toHaveBeenCalledTimes(1);
				expect(onFormSubmit).not.toHaveBeenCalled();
			},
		);
	});

	describe('when the gate is off', () => {
		beforeEach(() => failGate(GATE));

		it.each(['left', 'right'] as const)(
			'should keep the existing behaviour of submitting the parent form when the %s arrow is clicked',
			async (label) => {
				const { onFormSubmit } = setupWithForm();

				expect(getArrowButton(label)).not.toHaveAttribute('type');

				await userEvent.click(getArrowButton(label));

				expect(onFormSubmit).toHaveBeenCalledTimes(1);
			},
		);
	});
});
