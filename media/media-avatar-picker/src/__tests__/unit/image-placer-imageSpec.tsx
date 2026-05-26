import React from 'react';
import { render, screen } from '@atlassian/testing-library';
import { IntlProvider } from 'react-intl';

jest.mock('../../image-cropper/isImageRemote');

import {
	ImagePlacerImage,
	type ImagePlacerImageProps,
	IMAGE_ERRORS,
} from '../../image-placer/image';

import { isImageRemote } from '../../image-cropper/isImageRemote';
import { asMock } from '@atlaskit/media-test-helpers';

const renderWithIntl = (ui: React.ReactElement) =>
	render(<IntlProvider locale="en">{ui}</IntlProvider>);

const setup = (props: Partial<ImagePlacerImageProps> = {}) => {
	const onLoad = jest.fn();
	const onError = jest.fn();

	const result = renderWithIntl(
		<ImagePlacerImage
			x={1}
			y={2}
			width={3}
			height={4}
			onLoad={onLoad}
			onError={onError}
			{...props}
		/>,
	);

	return { ...result, onLoad, onError };
};

describe('Image Placer Image', () => {
	it('should capture and report a11y violations', async () => {
		asMock(isImageRemote).mockReturnValue(false);
		const { container } = setup({ src: 'some-src' });
		await expect(container).toBeAccessible();
	});

	describe('Loading', () => {
		it('should call onError prop if bad url', async () => {
			asMock(isImageRemote).mockImplementation(() => {
				throw new Error();
			});
			const { onError } = setup({ src: 'some-very-bad-url' });

			expect(onError).toHaveBeenCalledWith(IMAGE_ERRORS.BAD_URL);
		});

		describe('Image Events', () => {
			beforeAll(() => {
				asMock(isImageRemote).mockReturnValue(true);
			});

			it('should pass image load event to props', () => {
				const { onLoad } = setup({ src: 'some-src' });

				const img = screen.getByRole('img');
				// Simulate load event with currentTarget
				Object.defineProperty(img, 'naturalWidth', { value: 1 });
				Object.defineProperty(img, 'naturalHeight', { value: 2 });
				img.dispatchEvent(new Event('load', { bubbles: true }));

				expect(onLoad).toHaveBeenCalledWith(expect.any(HTMLImageElement), 1, 2);
			});

			it('should pass image error event to props', () => {
				const { onError } = setup({ src: 'some-src' });

				const img = screen.getByRole('img');
				img.dispatchEvent(new Event('error', { bubbles: true }));

				expect(onError).toHaveBeenCalled();
			});
		});
	});

	describe('Rendering', () => {
		it('should not render image if no src', () => {
			setup();
			expect(screen.queryByRole('img')).not.toBeInTheDocument();
		});

		it('should render image with given coordinates', () => {
			asMock(isImageRemote).mockReturnValue(false);
			setup({ src: 'some-src' });

			const img = screen.getByRole('img');
			expect(img).toBeInTheDocument();
			expect(img.style.left).toBe('1px');
			expect(img.style.top).toBe('2px');
			expect(img.style.width).toBe('3px');
			expect(img.style.height).toBe('4px');
		});
	});
});
