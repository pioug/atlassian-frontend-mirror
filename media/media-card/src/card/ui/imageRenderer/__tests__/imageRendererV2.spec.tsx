import React from 'react';
import { render, screen, fireEvent } from '@atlassian/testing-library';
import { ImageRenderer } from '../imageRendererV2';
import type { FileIdentifier } from '@atlaskit/media-client';
import { fg } from '@atlaskit/platform-feature-flags';
import { useInteractionContext } from '@atlaskit/react-ufo/interaction-context';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

jest.mock('@atlaskit/react-ufo/interaction-context', () => ({
	useInteractionContext: jest.fn(),
}));

jest.mock('@atlaskit/react-ufo/custom-data', () => {
	return {
		__esModule: true,
		default: () => null,
	};
});

const wrapperRef = { current: document.createElement('div') } as React.RefObject<HTMLDivElement>;
const identifier: FileIdentifier = { id: '123', collectionName: 'test', mediaItemType: 'file' };

const cardPreview = {
	dataURI: 'data:image/png;base64,abc123',
	orientation: 1,
	source: 'remote' as const,
};

const testId = 'media-image';

const defaultProps = {
	mediaType: 'image' as const,
	wrapperRef,
	identifier,
	testId,
};

describe('ImageRendererV2', () => {
	let mockHoldRelease: jest.Mock;
	let mockHold: jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
		mockHoldRelease = jest.fn();
		mockHold = jest.fn().mockReturnValue(mockHoldRelease);
		(fg as jest.Mock).mockReturnValue(true);
		(useInteractionContext as jest.Mock).mockReturnValue({
			hold: mockHold,
		});
	});

	describe('UFO hold lifecycle', () => {
		it('should create img-loading hold when cardPreview is provided', () => {
			render(<ImageRenderer {...defaultProps} cardPreview={cardPreview} />);

			expect(mockHold).toHaveBeenCalledWith('img-loading');
		});

		it('should NOT create img-loading hold when cardPreview is undefined', () => {
			render(<ImageRenderer {...defaultProps} />);

			expect(mockHold).not.toHaveBeenCalled();
		});

		it('should release hold when image loads successfully', () => {
			render(<ImageRenderer {...defaultProps} cardPreview={cardPreview} />);

			expect(mockHold).toHaveBeenCalledWith('img-loading');

			const img = screen.getByTestId(testId);
			fireEvent.load(img);

			// Hold release is called via useLayoutEffect cleanup when didRender becomes true
			expect(mockHoldRelease).toHaveBeenCalled();
		});

		it('should release hold when image fails to load', () => {
			render(<ImageRenderer {...defaultProps} cardPreview={cardPreview} />);

			expect(mockHold).toHaveBeenCalledWith('img-loading');

			const img = screen.getByTestId(testId);
			fireEvent.error(img);

			// onError sets didRender=true, which triggers useLayoutEffect cleanup
			// releasing the hold
			expect(mockHoldRelease).toHaveBeenCalled();
		});

		it('should release hold on unmount when cardPreview is provided', () => {
			const { unmount } = render(<ImageRenderer {...defaultProps} cardPreview={cardPreview} />);

			expect(mockHold).toHaveBeenCalledWith('img-loading');

			unmount();

			expect(mockHoldRelease).toHaveBeenCalled();
		});

		it('should not leave a dangling hold when cardPreview is undefined and component unmounts', () => {
			const { unmount } = render(<ImageRenderer {...defaultProps} />);

			// No hold was created, so nothing to release
			expect(mockHold).not.toHaveBeenCalled();

			unmount();

			// No hold release needed since no hold was created
			expect(mockHoldRelease).not.toHaveBeenCalled();
		});

		it('should create hold when cardPreview transitions from undefined to defined', () => {
			const { rerender } = render(<ImageRenderer {...defaultProps} />);

			// No hold initially
			expect(mockHold).not.toHaveBeenCalled();

			// Now provide a cardPreview
			rerender(<ImageRenderer {...defaultProps} cardPreview={cardPreview} />);

			// Hold should now be created
			expect(mockHold).toHaveBeenCalledWith('img-loading');
		});
	});

	describe('accessibility', () => {
		it('should be accessible when cardPreview is provided', async () => {
			const { container } = render(
				<ImageRenderer {...defaultProps} cardPreview={cardPreview} alt="test image" />,
			);

			await expect(container).toBeAccessible();
		});
	});

	describe('rendering', () => {
		it('should render img element when cardPreview is provided', () => {
			render(<ImageRenderer {...defaultProps} cardPreview={cardPreview} />);

			const img = screen.getByTestId(testId);
			expect(img).toBeInTheDocument();
			expect(img.tagName).toBe('IMG');
			expect(img).toHaveAttribute('src', cardPreview.dataURI);
		});

		it('should not render img element when cardPreview is undefined', () => {
			render(<ImageRenderer {...defaultProps} />);

			expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
		});

		it('should call onImageError callback when image fails to load', () => {
			const onImageError = jest.fn();
			render(
				<ImageRenderer {...defaultProps} cardPreview={cardPreview} onImageError={onImageError} />,
			);

			const img = screen.getByTestId(testId);
			fireEvent.error(img);

			expect(onImageError).toHaveBeenCalledWith(cardPreview);
		});

		it('should call onImageLoad callback when image loads successfully', () => {
			const onImageLoad = jest.fn();
			render(
				<ImageRenderer {...defaultProps} cardPreview={cardPreview} onImageLoad={onImageLoad} />,
			);

			const img = screen.getByTestId(testId);
			fireEvent.load(img);

			expect(onImageLoad).toHaveBeenCalledWith(cardPreview);
		});
	});
});

describe('ImageRenderer - backgroundColor prop', () => {
	it('should apply backgroundColor as inline style when provided', () => {
		render(
			<ImageRenderer {...defaultProps} cardPreview={cardPreview} backgroundColor="transparent" />,
		);
		const img = screen.getByTestId(testId);
		expect(img.style.backgroundColor).toBe('transparent');
	});

	it('should not set inline backgroundColor when prop is not provided', () => {
		render(<ImageRenderer {...defaultProps} cardPreview={cardPreview} />);
		const img = screen.getByTestId(testId);
		expect(img.style.backgroundColor).toBe('');
	});

	it('should apply white background CSS class when useWhiteBackground is true and no backgroundColor', () => {
		render(<ImageRenderer {...defaultProps} cardPreview={cardPreview} useWhiteBackground={true} />);
		const img = screen.getByTestId(testId);
		// The white background is applied via CSS class, not inline style
		expect(img.style.backgroundColor).toBe('');
	});

	it('should apply backgroundColor inline style together with useWhiteBackground=false', () => {
		render(
			<ImageRenderer
				{...defaultProps}
				cardPreview={cardPreview}
				useWhiteBackground={false}
				backgroundColor="red"
			/>,
		);
		const img = screen.getByTestId(testId);
		expect(img.style.backgroundColor).toBe('red');
	});

	it('should apply backgroundColor on raster media when useWhiteBackground is not provided (cardView wiring path)', () => {
		// Mirrors the new cardView wiring where raster media receives `backgroundColor`
		// without an explicit `useWhiteBackground` prop.
		render(<ImageRenderer {...defaultProps} cardPreview={cardPreview} backgroundColor="blue" />);
		const img = screen.getByTestId(testId);
		expect(img.style.backgroundColor).toBe('blue');
	});
});
