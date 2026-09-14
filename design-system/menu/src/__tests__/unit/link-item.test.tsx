import React from 'react';

import { render, screen } from '@testing-library/react';

import LinkItem from '../../menu-item/link-item';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('LinkItem', () => {
	describe('aria-disabled', () => {
		it('should not have aria-disabled attribute when isDisabled is false', () => {
			render(
				<LinkItem href="/feedback" testId="link-item">
					Customer Feedback
				</LinkItem>,
			);

			const item = screen.getByTestId('link-item');
			expect(item).not.toHaveAttribute('aria-disabled');
		});

		it('should have aria-disabled="true" when isDisabled is true', () => {
			render(
				<LinkItem href="/feedback" isDisabled testId="link-item">
					Customer Feedback
				</LinkItem>,
			);

			const item = screen.getByTestId('link-item');
			expect(item).toHaveAttribute('aria-disabled', 'true');
		});
	});
});
