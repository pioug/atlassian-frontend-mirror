import React from 'react';
import { render, screen } from '@testing-library/react';
import { MediaInlineCardLoadedView } from '../../index';

jest.mock('react-render-image');

describe('LoadedView', () => {
	it('should render the title', () => {
		render(<MediaInlineCardLoadedView title="some text content" />);
		expect(screen.getByText('some text content')).toBeInTheDocument();
	});

	it('should render an icon when one is provided', () => {
		render(<MediaInlineCardLoadedView icon="some-link-to-icon" title="some text content" />);

		const iconImage = screen.getByTestId('media-inline-card-icon-and-title-image');
		expect(iconImage).toBeInTheDocument();
		expect(iconImage).toHaveAttribute('src', 'some-link-to-icon');
	});

	it('should not render an icon when one is not provided', () => {
		render(<MediaInlineCardLoadedView title="some text content" />);
		expect(screen.queryByTestId('media-inline-card-icon-and-title-image')).not.toBeInTheDocument();
	});

	it('should be void of a11y violations', async () => {
		const { container } = render(<MediaInlineCardLoadedView title="a11y test" />);
		await expect(container).toBeAccessible();
	});
});
