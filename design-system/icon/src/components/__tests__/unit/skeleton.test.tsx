import React from 'react';
import { render, screen } from '@testing-library/react';
import Skeleton from '../../skeleton';

const TEST_ID = 'test';
describe('Skeleton', () => {
	test('sets color as currentColor by default', () => {
		render(<Skeleton testId={TEST_ID} />);
		expect(screen.getByTestId(TEST_ID)).toHaveStyle('background-color: currentColor');
	});

	test('sets color from prop', () => {
		render(<Skeleton testId={TEST_ID} color="#FFFFFF" />);
		expect(screen.getByTestId(TEST_ID)).toHaveStyle('background-color: #FFFFFF');
	});

	test('sets a default opacity', () => {
		render(<Skeleton testId={TEST_ID} />);
		expect(screen.getByTestId(TEST_ID)).toHaveStyleDeclaration('opacity', '0.15');
	});

	test('sets a strong opacity when prop specified', () => {
		render(<Skeleton testId={TEST_ID} weight="strong" />);
		expect(screen.getByTestId(TEST_ID)).toHaveStyleDeclaration('opacity', '0.3');
	});
});
