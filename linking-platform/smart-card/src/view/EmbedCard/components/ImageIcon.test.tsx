import React from 'react';

import { fireEvent, screen } from '@testing-library/react';

import { renderWithIntl } from '@atlaskit/link-test-helpers';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

import { ImageIcon, type ImageIconProps } from './ImageIcon';

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
				return loaded;
		}
	}),
}));

const setup = (extraProps?: Partial<ImageIconProps>) => {
	return renderWithIntl(
		<ImageIcon
			src="https://example.com/image.png"
			alt="Example Image"
			size={32}
			title="Example Title"
			default={<div data-testid="default-icon">Default Icon</div>}
			{...extraProps}
		/>,
	);
};

describe('ImageIcon', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = setup();
		await expect(container).toBeAccessible();
	});

	it('should render with round appearance', () => {
		setup({ appearance: 'round' });

		const image = screen.getByRole('img');
		const style = window.getComputedStyle(image);

		expect(style.borderRadius).toContain('--ds-border-radius-circle');
	});

	it('should not render with round appearance', () => {
		setup();

		const image = screen.getByRole('img');
		const style = window.getComputedStyle(image);

		expect(style.borderRadius).toContain('--ds-border-radius');
	});

	eeTest
		.describe('platform_editor_smart_card_otp', 'Smart Card OTP is enabled')
		.variant(true, () => {
			it('should render default icon when image is loading and hideLoadingSkeleton is false', () => {
				setup({ hideLoadingSkeleton: false, src: 'src-loading' });

				expect(screen.queryByTestId('default-icon')).toBeInTheDocument();
			});

			it('should not render default icon when hideLoadingSkeleton is true', () => {
				setup({ hideLoadingSkeleton: true, src: 'src-loading' });

				expect(screen.queryByTestId('default-icon')).not.toBeInTheDocument();
			});

			it('should render default icon when image fails to load and hideLoadingSkeleton is true', async () => {
				setup({ hideLoadingSkeleton: true, src: 'src-loaded' });

				const image = screen.getByRole('img');
				fireEvent.error(image);

				const icon = await screen.findByTestId('default-icon');
				expect(icon).toBeInTheDocument();
			});
		});
});
