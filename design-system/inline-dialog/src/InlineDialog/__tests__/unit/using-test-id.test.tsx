import React from 'react';

import { render, screen } from '@testing-library/react';

import InlineDialog from '../../index';

jest.mock('popper.js', () => {
	// @ts-ignore requireActual property is missing from jest
	const PopperJS = jest.requireActual('popper.js');

	return class Popper {
		static placements = PopperJS.placements;

		constructor() {
			return {
				// eslint-disable-next-line
				destroy: () => {},
				// eslint-disable-next-line
				update: () => {},
			};
		}
	};
});

describe('Inline dialog should be found by data-testid', () => {
	test('Using getByTestId()', async () => {
		const testId = 'the-inline-dialog';
		render(
			<InlineDialog content={null} testId={testId} isOpen>
				<div id="children" />
			</InlineDialog>,
		);
		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});
});
