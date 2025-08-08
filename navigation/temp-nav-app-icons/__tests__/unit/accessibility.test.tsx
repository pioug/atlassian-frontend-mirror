import React from 'react';

import { render, screen } from '@testing-library/react';

import ShowcaseExample from '../../examples/01-showcase';
import { JiraIcon } from '../../src/ui/jira/icon';
import { JiraLogo } from '../../src/ui/jira/logo';

it('should be accessible', async () => {
	const { container } = render(<ShowcaseExample />);

	await expect(container).toBeAccessible();
});

describe('logo', () => {
	describe('when an empty label is provided', () => {
		it('should have no role and be hidden from screen readers', () => {
			const testId = 'no-role';
			render(<JiraLogo label="" testId={testId} />);

			const wrapper = screen.getByTestId(`${testId}--wrapper`);
			expect(wrapper).not.toHaveAttribute('role');
			expect(wrapper).toHaveAttribute('aria-hidden', 'true');
		});
	});

	describe('when a label is provided', () => {
		it('should have the correct label and accessibility attributes', () => {
			const label = 'A test label';
			render(<JiraLogo label={label} />);

			expect(screen.getByRole('img')).toBeInTheDocument();
			expect(screen.getByRole('img')).toHaveAttribute('aria-label', label);
			expect(screen.getByRole('img')).not.toHaveAttribute('aria-hidden');
		});
	});

	describe('when the label prop is not provided', () => {
		it('should fallback to the default label', () => {
			render(<JiraLogo />);

			expect(screen.getByRole('img')).toBeInTheDocument();
			expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Jira');
		});
	});
});

describe('icon', () => {
	describe('when an empty label is provided', () => {
		it('should have no role and be hidden from screen readers', () => {
			const testId = 'no-role';
			render(<JiraIcon label="" testId={testId} />);

			const wrapper = screen.getByTestId(`${testId}--wrapper`);
			expect(wrapper).not.toHaveAttribute('role');
			expect(wrapper).toHaveAttribute('aria-hidden', 'true');
		});
	});

	describe('when a label is provided', () => {
		it('should have the correct label and accessibility attributes', () => {
			const label = 'A test label';
			render(<JiraIcon label={label} />);

			expect(screen.getByRole('img')).toBeInTheDocument();
			expect(screen.getByRole('img')).toHaveAttribute('aria-label', label);
			expect(screen.getByRole('img')).not.toHaveAttribute('aria-hidden');
		});
	});

	describe('when the label prop is not provided', () => {
		it('should fallback to the default label', () => {
			render(<JiraIcon />);

			expect(screen.getByRole('img')).toBeInTheDocument();
			expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Jira');
		});
	});
});
