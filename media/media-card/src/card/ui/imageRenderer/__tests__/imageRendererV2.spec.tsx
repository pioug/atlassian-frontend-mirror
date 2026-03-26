import React from 'react';
import { render, screen, fireEvent } from '@atlassian/testing-library';
import { ImageRenderer } from '../imageRendererV2';
import type { FileIdentifier } from '@atlaskit/media-client';
import { fg } from '@atlaskit/platform-feature-flags';
import { useInteractionContext } from '@atlaskit/react-ufo/interaction-context';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

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
		eeTest
			.describe('cc_editor_ttvc_media_hold_fix', 'when experiment is disabled')
			.variant(false, () => {
				it('should create img-loading hold when cardPreview is provided', () => {
					render(<ImageRenderer {...defaultProps} cardPreview={cardPreview} />);

					expect(mockHold).toHaveBeenCalledWith('img-loading');
				});

				it('should create img-loading hold even when cardPreview is undefined', () => {
					render(<ImageRenderer {...defaultProps} />);

					expect(mockHold).toHaveBeenCalledWith('img-loading');
				});

				it('should not release hold on image error', () => {
					render(<ImageRenderer {...defaultProps} cardPreview={cardPreview} />);

					const img = screen.getByTestId(testId);
					fireEvent.error(img);

					// Without the fix, onError does not set didRender=true, so the hold is not released
					// via a re-render triggered by onError.
					expect(mockHoldRelease).toHaveBeenCalledTimes(0);
				});
			});

		eeTest
			.describe('cc_editor_ttvc_media_hold_fix', 'when experiment is enabled')
			.variant(true, () => {
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

					// With the fix, onError sets didRender=true, which triggers useLayoutEffect cleanup
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

		it('should not create hold when platfrom_close_blindspot_for_img feature flag is disabled', () => {
			(fg as jest.Mock).mockReturnValue(false);

			render(<ImageRenderer {...defaultProps} cardPreview={cardPreview} />);

			expect(mockHold).not.toHaveBeenCalled();
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
