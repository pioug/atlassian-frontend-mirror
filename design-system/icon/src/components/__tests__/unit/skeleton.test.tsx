import React from 'react';

import { render, screen } from '@testing-library/react';

import Skeleton from '../../skeleton';

const TEST_ID = 'test';
// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Skeleton', () => {
	test('sets color as currentColor by default', () => {
		render(<Skeleton testId={TEST_ID} />);
		expect(screen.getByTestId(TEST_ID)).toHaveStyle('background-color: currentColor');
	});

	test('sets color from prop', () => {
		render(<Skeleton testId={TEST_ID} color="#FFFFFF" />);
		expect(screen.getByTestId(TEST_ID)).toHaveStyle('background-color: #FFFFFF');
	});
});
