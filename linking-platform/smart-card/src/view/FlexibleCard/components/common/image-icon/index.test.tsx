import React from 'react';

import { fireEvent, screen } from '@testing-library/react';

import { renderWithIntl } from '@atlaskit/link-test-helpers';

import type { ImageIconProps } from './types';

import ImageIcon from './index';

jest.mock('react-render-image', () => ({
	...jest.requireActual('react-render-image'),
	__esModule: true,
	default: jest.fn(({ src, loading, loaded, errored }: any) => {
		switch (src) {
			case 'src-loading':
				return loading;
			case 'src-loaded':
				return loaded;
			case 'src-error':
				return errored;
			default:
				return <span>{src}</span>;
		}
	}),
}));

const setup = (extraProps?: Partial<ImageIconProps>) => {
	return renderWithIntl(<ImageIcon url="src-loaded" testId="image-test" {...extraProps} />);
};

describe('ImageIcon', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = setup();
		await expect(container).toBeAccessible();
	});

	it('should render with round appearance', () => {
		setup({ appearance: 'round' });

		const image = screen.getByRole('presentation');
		const style = window.getComputedStyle(image);

		expect(style.borderRadius).toContain('--ds-radius-full');
	});

	it('should not render with round appearance', () => {
		setup();

		const image = screen.getByRole('presentation');
		const style = window.getComputedStyle(image);

		expect(style.borderRadius).toBe('');
	});

	describe('when hideLoadingSkeleton is true', () => {
		it('should display the default icon if image fails to load', () => {
			setup({
				defaultIcon: <div data-testid="default-icon"></div>,
				hideLoadingSkeleton: true,
			});

			const image = screen.getByRole('presentation');
			fireEvent.error(image);
			expect(screen.getByTestId('default-icon')).toBeInTheDocument();
		});

		it('should reset error state if `url` prop is updated', () => {
			const { rerender } = setup({
				defaultIcon: <div data-testid="default-icon"></div>,
				hideLoadingSkeleton: true,
			});

			const image = screen.getByRole('presentation');
			fireEvent.error(image);
			expect(screen.getByTestId('default-icon')).toBeInTheDocument();

			rerender(
				<ImageIcon
					url="https://example.com/image2.png"
					testId="image-test"
					hideLoadingSkeleton={true}
				/>,
			);
			expect(screen.queryByTestId('default-icon')).not.toBeInTheDocument();
			expect(screen.getByRole('presentation')).toBeInTheDocument();
		});

		it('should not render loading skeleton', async () => {
			setup({ url: 'src-loading', hideLoadingSkeleton: true });

			const loadingSkeleton = screen.queryByTestId('image-test-loading');
			expect(loadingSkeleton).not.toBeInTheDocument();
			expect(screen.getByTestId('image-test-image')).toBeInTheDocument();
		});
	});

	it('should render loading skeleton when image is loading and hideLoadingSkeleton is false', async () => {
		setup({ url: 'src-loading', hideLoadingSkeleton: false });

		const loadingSkeleton = screen.getByTestId('image-test-loading');
		expect(loadingSkeleton).toBeInTheDocument();
		expect(screen.queryByTestId('image-test-image')).not.toBeInTheDocument();
	});
});
