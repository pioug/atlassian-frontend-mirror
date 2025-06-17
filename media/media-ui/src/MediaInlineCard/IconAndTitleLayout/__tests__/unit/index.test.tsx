import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderWithIntl } from '../../../../test-helpers';
import { IconAndTitleLayout } from '../../index';

jest.mock('react-render-image');

describe('IconAndTitleLayout', () => {
	it('should render the text', () => {
		render(<IconAndTitleLayout title="some text content" />);
		expect(screen.getByText('some text content')).toBeInTheDocument();
	});

	describe('renderIcon', () => {
		it('renders icon', () => {
			const { getByTestId } = renderWithIntl(
				<IconAndTitleLayout title="title" icon={<span data-testid="inline-card-icon-icon" />} />,
			);

			const icon = getByTestId('inline-card-icon-icon');
			expect(icon).toBeInTheDocument();
		});

		it('renders default icon', () => {
			const { getByTestId } = renderWithIntl(
				<IconAndTitleLayout title="title" testId="inline-card-icon" />,
			);

			const defaultIcon = getByTestId('inline-card-icon-default');
			expect(defaultIcon).toBeInTheDocument();
		});

		it('should render emoji in place of default icon when emoji is provided', () => {
			const emojiIcon = <span data-testid="emoji">😍</span>;
			const { getByTestId, queryByTestId } = renderWithIntl(
				<IconAndTitleLayout title="title" testId="inline-card-icon" emoji={emojiIcon} />,
			);

			const emoji = getByTestId('emoji');
			expect(emoji).toBeInTheDocument();
			expect(queryByTestId('inline-card-icon-default')).not.toBeInTheDocument();
		});
	});

	it('should be void of a11y violations', async () => {
		const { container } = render(<IconAndTitleLayout title="a11y test" />);
		await expect(container).toBeAccessible();
	});
});
