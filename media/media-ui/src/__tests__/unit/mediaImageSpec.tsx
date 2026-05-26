import React from 'react';
import { fireEvent, render, screen } from '@atlassian/testing-library';
import { MediaImage, type MediaImageProps } from '../../mediaImage';
import { type isRotated } from '../../imageMetaData';

interface SetupParams {
	isCoverStrategy: boolean;
	isImageMoreLandscapyThanContainer: boolean;
	isStretchingProhibited: boolean;
	loadImageImmediately?: boolean;
	previewOrientation?: number;
	altText?: string;
	forceSyncDisplay?: boolean;
}

let mockIsRotated: jest.Mock | typeof isRotated = jest.fn();

jest.mock('../../imageMetaData/imageOrientationUtil', () => ({
	...jest.requireActual<Object>('../../imageMetaData/imageOrientationUtil'),
	isRotated: jest.fn<ReturnType<typeof isRotated>, Parameters<typeof isRotated>>((orientation) =>
		mockIsRotated(orientation),
	),
}));

const dimensionsMap = {
	isImageMoreLandscapyThanContainer: [
		[2000, 1000],
		[500, 500],
	],
	isImageMorePortraityThanContainer: [
		[100, 200],
		[500, 500],
	],
};

const defaultTransform = { transform: 'translate(-50%, -50%)' };

// MediaImage merges its computed `style` with these defaults inside ImageComponent.
// We strip them out when extracting the MediaImage-controlled style for assertions.
const baseImgStyleKeys = new Set(['position', 'left', 'top', 'objectFit', 'imageOrientation']);

const getRenderedStyle = (el: HTMLElement): Record<string, string> => {
	const out: Record<string, string> = {};
	for (let i = 0; i < el.style.length; i++) {
		const prop = el.style[i];
		const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
		if (baseImgStyleKeys.has(camel)) {
			continue;
		}
		out[camel] = el.style.getPropertyValue(prop);
	}
	return out;
};

const setBoundingClientRectMock = (containerDimensions: number[]) => {
	Element.prototype.getBoundingClientRect = () =>
		({
			width: containerDimensions[0],
			height: containerDimensions[1],
		}) as DOMRect;
};

const renderMediaImage = (
	props: Partial<MediaImageProps> &
		Pick<MediaImageProps, 'dataURI' | 'stretch' | 'crop'> & { altText?: string },
	imageDimensions: number[],
	containerDimensions: number[],
	loadImageImmediately = true,
	onImageLoad?: jest.Mock,
	onImageError?: jest.Mock,
) => {
	setBoundingClientRectMock(containerDimensions);
	const { altText, ...rest } = props;
	const view = render(
		<MediaImage
			{...rest}
			alt={altText}
			onImageLoad={onImageLoad}
			onImageError={onImageError}
			crossOrigin="anonymous"
		/>,
	);
	const imgEl = screen.getByTestId('media-image') as HTMLImageElement;
	Object.defineProperty(imgEl, 'naturalWidth', {
		value: imageDimensions[0],
		configurable: true,
	});
	Object.defineProperty(imgEl, 'naturalHeight', {
		value: imageDimensions[1],
		configurable: true,
	});
	if (loadImageImmediately) {
		fireEvent.load(imgEl);
	}
	return { ...view, imgEl };
};

const setup = (params: SetupParams, onImageLoad?: jest.Mock, onImageError?: jest.Mock) => {
	const {
		isCoverStrategy,
		isImageMoreLandscapyThanContainer,
		isStretchingProhibited,
		loadImageImmediately = true,
		previewOrientation,
		altText,
		forceSyncDisplay,
	} = params;
	const [imageDimensions, containerDimensions] =
		dimensionsMap[
			isImageMoreLandscapyThanContainer
				? 'isImageMoreLandscapyThanContainer'
				: 'isImageMorePortraityThanContainer'
		];

	return renderMediaImage(
		{
			dataURI: 'data:image/png;base64,',
			stretch: !isStretchingProhibited,
			crop: isCoverStrategy,
			previewOrientation,
			altText,
			forceSyncDisplay,
		},
		imageDimensions,
		containerDimensions,
		loadImageImmediately,
		onImageLoad,
		onImageError,
	);
};

describe('MediaImage', () => {
	const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
	let onImageLoad: jest.Mock;
	let onImageError: jest.Mock;

	beforeEach(() => {
		onImageLoad = jest.fn();
		onImageError = jest.fn();
		mockIsRotated = jest.requireActual('../../imageMetaData/imageOrientationUtil').isRotated;
	});

	afterAll(() => {
		Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
		jest.resetAllMocks();
	});

	describe("when image hasn't been loaded yet", () => {
		it('should not show image yet with cover strategy', () => {
			const { imgEl } = setup({
				isCoverStrategy: true,
				isImageMoreLandscapyThanContainer: true,
				isStretchingProhibited: true,
				loadImageImmediately: false,
			});
			expect(imgEl.style.display).toBe('none');
		});

		it('should not show image yet with both cover and stretch strategy', () => {
			const { imgEl } = setup({
				isCoverStrategy: true,
				isImageMoreLandscapyThanContainer: true,
				isStretchingProhibited: false,
				loadImageImmediately: false,
			});
			expect(imgEl.style.display).toBe('none');
		});

		it('should not show image yet with rotation', () => {
			const { imgEl } = setup({
				isCoverStrategy: false,
				previewOrientation: 6,
				isImageMoreLandscapyThanContainer: true,
				isStretchingProhibited: true,
				loadImageImmediately: false,
			});
			expect(imgEl.style.display).toBe('none');
		});

		it('should show image right away with fit strategy', () => {
			const { imgEl } = setup({
				isCoverStrategy: false,
				isImageMoreLandscapyThanContainer: true,
				isStretchingProhibited: true,
				loadImageImmediately: false,
			});
			expect(imgEl.style.display).not.toBe('none');
		});

		it('should show image right away with cover strategy and forcing display ', () => {
			const { imgEl } = setup({
				isCoverStrategy: true,
				isImageMoreLandscapyThanContainer: true,
				isStretchingProhibited: true,
				loadImageImmediately: false,
				forceSyncDisplay: true,
			});
			expect(imgEl.style.display).not.toBe('none');
		});

		it('should show image right away with cover & stretch strategy and forcing display ', () => {
			const { imgEl } = setup({
				isCoverStrategy: true,
				isImageMoreLandscapyThanContainer: true,
				isStretchingProhibited: false,
				loadImageImmediately: false,
				forceSyncDisplay: true,
			});
			expect(imgEl.style.display).not.toBe('none');
		});

		it('should show image right away with rotation and forcing display ', () => {
			const { imgEl } = setup({
				isCoverStrategy: false,
				previewOrientation: 6,
				isImageMoreLandscapyThanContainer: true,
				isStretchingProhibited: true,
				loadImageImmediately: false,
				forceSyncDisplay: true,
			});
			expect(imgEl.style.display).not.toBe('none');
		});

		it('should show image right away with fit strategy and forcing display', () => {
			const { imgEl } = setup({
				isCoverStrategy: false,
				isImageMoreLandscapyThanContainer: true,
				isStretchingProhibited: true,
				loadImageImmediately: false,
				forceSyncDisplay: true,
			});
			expect(imgEl.style.display).not.toBe('none');
		});
	});

	describe('when image loaded correctly', () => {
		it('should call onImageLoad', () => {
			setup(
				{
					isCoverStrategy: true,
					isImageMoreLandscapyThanContainer: true,
					isStretchingProhibited: true,
				},
				onImageLoad,
			);
			expect(onImageLoad).toHaveBeenCalled();
		});

		it('should set crossOrigin', () => {
			const { imgEl } = setup({
				isCoverStrategy: true,
				isImageMoreLandscapyThanContainer: true,
				isStretchingProhibited: true,
			});

			expect(imgEl.crossOrigin).toBe('anonymous');
		});

		describe('alt prop is not provided', () => {
			it('should render img tag without alt-text attribute', () => {
				const { imgEl } = setup({
					isCoverStrategy: true,
					isImageMoreLandscapyThanContainer: true,
					isStretchingProhibited: true,
				});

				expect(imgEl.alt).toBe('');
			});
		});

		describe('alt prop is provided', () => {
			it('should render img tag with alt-text attribute', () => {
				const { imgEl } = setup({
					isCoverStrategy: true,
					isImageMoreLandscapyThanContainer: true,
					isStretchingProhibited: true,
					altText: 'this is an alt text',
				});

				expect(imgEl.alt).toBe('this is an alt text');
			});
		});
	});

	describe('when image loaded with an error', () => {
		it('should call onImageLoad', () => {
			const { imgEl } = setup(
				{
					isCoverStrategy: true,
					isImageMoreLandscapyThanContainer: true,
					isStretchingProhibited: true,
				},
				undefined,
				onImageError,
			);
			fireEvent.error(imgEl);
			expect(onImageError).toHaveBeenCalled();
		});
	});

	describe('when image is more landscapy than container', () => {
		describe('when image is smaller than container', () => {
			it('should have right style for cover strategy', () => {
				const { imgEl } = setup({
					isCoverStrategy: true,
					isImageMoreLandscapyThanContainer: true,
					isStretchingProhibited: true,
				});
				expect(getRenderedStyle(imgEl)).toEqual({
					maxHeight: '100%',
					...defaultTransform,
				});
			});
			it('should have right style for fit strategy', () => {
				const { imgEl } = setup({
					isCoverStrategy: false,
					isImageMoreLandscapyThanContainer: true,
					isStretchingProhibited: true,
				});
				expect(getRenderedStyle(imgEl)).toEqual({
					maxWidth: '100%',
					maxHeight: '100%',
					...defaultTransform,
				});
			});
		});

		describe('when image is bigger than container', () => {
			it('should have right style for cover strategy', () => {
				const { imgEl } = setup({
					isCoverStrategy: true,
					isImageMoreLandscapyThanContainer: true,
					isStretchingProhibited: false,
				});
				expect(getRenderedStyle(imgEl)).toEqual({
					height: '100%',
					...defaultTransform,
				});
			});
			it('should have right style for fit strategy', () => {
				const { imgEl } = setup({
					isCoverStrategy: false,
					isImageMoreLandscapyThanContainer: true,
					isStretchingProhibited: false,
				});
				expect(getRenderedStyle(imgEl)).toEqual({
					width: '100%',
					...defaultTransform,
				});
			});
		});

		describe('when image is rotated', () => {
			it('should choose appropriate width when cover strategy chosen', () => {
				mockIsRotated = jest.fn().mockReturnValue(true);

				const { imgEl } = renderMediaImage(
					{
						dataURI: 'data:image/png;base64,',
						stretch: true,
						crop: true,
						previewOrientation: 6,
					},
					[1000, 750],
					[100, 75],
					true,
				);
				expect(imgEl.style.width).toBe('134%');
			});

			it('should choose appropriate height when fit strategy chosen', () => {
				mockIsRotated = jest.fn().mockReturnValue(true);

				const { imgEl } = renderMediaImage(
					{
						dataURI: 'data:image/png;base64,',
						stretch: true,
						crop: false,
						previewOrientation: 6,
					},
					[1000, 750],
					[100, 75],
					true,
				);
				expect(imgEl.style.height).toBe('134%');
			});
		});
	});

	describe('when image is more portraity than container', () => {
		describe('when image is smaller than container', () => {
			it('should have right style for cover strategy', () => {
				const { imgEl } = setup({
					isCoverStrategy: true,
					isImageMoreLandscapyThanContainer: false,
					isStretchingProhibited: true,
				});
				expect(getRenderedStyle(imgEl)).toEqual({
					maxWidth: '100%',
					...defaultTransform,
				});
			});
			it('should have right style for fit strategy', () => {
				const { imgEl } = setup({
					isCoverStrategy: false,
					isImageMoreLandscapyThanContainer: false,
					isStretchingProhibited: true,
				});
				expect(getRenderedStyle(imgEl)).toEqual({
					maxWidth: '100%',
					maxHeight: '100%',
					...defaultTransform,
				});
			});
		});
		describe('when image is bigger than container', () => {
			it('should have right style for cover strategy', () => {
				const { imgEl } = setup({
					isCoverStrategy: true,
					isImageMoreLandscapyThanContainer: false,
					isStretchingProhibited: false,
				});
				expect(getRenderedStyle(imgEl)).toEqual({
					width: '100%',
					...defaultTransform,
				});
			});
			it('should have right style for fit strategy', () => {
				const { imgEl } = setup({
					isCoverStrategy: false,
					isImageMoreLandscapyThanContainer: false,
					isStretchingProhibited: false,
				});
				expect(getRenderedStyle(imgEl)).toEqual({
					height: '100%',
					...defaultTransform,
				});
			});
		});

		describe('when image is rotated', () => {
			it('should do nothing if orientation is 1', () => {
				const { imgEl } = setup({
					isCoverStrategy: false,
					isImageMoreLandscapyThanContainer: false,
					isStretchingProhibited: false,
					loadImageImmediately: true,
					previewOrientation: 1,
				});

				expect(imgEl.style.transform).toBe(defaultTransform.transform);
			});

			it('should rotate the image and revert width and height when image is rotated 90deg', () => {
				mockIsRotated = jest.fn().mockReturnValue(true);

				const { imgEl } = renderMediaImage(
					{
						dataURI: 'data:image/png;base64,',
						stretch: true,
						crop: false,
						previewOrientation: 6,
					},
					[1000, 750],
					[75, 100],
					true,
				);
				expect(getRenderedStyle(imgEl)).toEqual({
					...defaultTransform,
					height: '134%',
					transform: 'translate(-50%, -50%) rotate(90deg)',
				});
			});

			it('should choose appropriate width when cover strategy chosen', () => {
				mockIsRotated = jest.fn().mockReturnValue(true);

				const { imgEl } = renderMediaImage(
					{
						dataURI: 'data:image/png;base64,',
						stretch: true,
						crop: true,
						previewOrientation: 6,
					},
					[1000, 750],
					[75, 100],
					true,
				);
				expect(imgEl.style.width).toBe('134%');
			});
		});
	});

	it('should not introduce any accessibility violations', async () => {
		setBoundingClientRectMock([500, 500]);
		render(
			<MediaImage
				dataURI="data:image/png;base64,"
				stretch={false}
				crop={false}
				alt="example image"
			/>,
		);
		await expect(document.body).toBeAccessible();
	});
});
