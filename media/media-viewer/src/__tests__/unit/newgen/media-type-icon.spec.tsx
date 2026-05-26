import React from 'react';
import { render, screen } from '@atlassian/testing-library';
import { MediaTypeIcon } from '@atlaskit/media-ui/media-type-icon';

const getIconSvg = () => {
	const wrapper = screen.getByRole('img', { name: 'media-type' });
	return wrapper.querySelector('svg');
};

describe('MediaTypeIcon', () => {
	it('MSW-741: should render the unknown icon for unexpected media types', () => {
		render(<MediaTypeIcon type={'unexpected-type' as any} />);
		expect(screen.getByTestId('file-type-icon')).toBeInTheDocument();
		// Generic (unknown) 24 icon is identifiable by its grey fill and 24x24 dimensions
		const svg = getIconSvg();
		expect(svg).toHaveAttribute('width', '24');
		expect(svg?.outerHTML).toContain('fill="#758195"');
		expect(svg?.outerHTML).toContain('M12 4H8a2 2 0 0 0-2 2v12');
	});

	it('should render the small icon', () => {
		render(<MediaTypeIcon type={'archive'} size={'small'} />);
		const svg = getIconSvg();
		expect(svg).toHaveAttribute('width', '16');
		expect(svg).toHaveAttribute('viewBox', '0 0 16 16');
	});

	it('should render the large icon', async () => {
		render(<MediaTypeIcon type={'image'} size={'large'} />);
		const svg = getIconSvg();
		expect(svg).toHaveAttribute('width', '24');
		expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
		expect(svg?.outerHTML).toContain('fill="#ffab00"');
		await expect(document.body).toBeAccessible();
	});
});
