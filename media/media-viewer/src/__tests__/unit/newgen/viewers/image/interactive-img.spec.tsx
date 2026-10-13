import React from 'react';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { MAX_RESOLUTION } from '@atlaskit/media-client/constants';
import { createMouseEvent } from '@atlaskit/media-test-helpers/createMouseEvent';
import { Camera } from '@atlaskit/media-ui/camera/camera';
import { Rectangle } from '@atlaskit/media-ui/rectangle';

import { ZoomLevel } from '../../../../../domain/zoomLevel';
import { InsetViewerProvider } from '../../../../../insetViewerContext';
import { MediaFooterBar } from '../../../../../styleWrappers';
import { InteractiveImg, type Props } from '../../../../../viewers/image/interactive-img';
import { InteractiveImgComponent } from '../../../../../viewers/image/interactive-img-component';

jest.mock('@atlaskit/platform-feature-flags/fg', () => ({
	...jest.requireActual('@atlaskit/platform-feature-flags/fg'),
	fg: jest.fn().mockReturnValue(false),
}));

const mockInsetFittedViewport = jest.fn();
const mockReadViewportCenterOnMedia = jest.fn();
const mockReadWrapperScroll = jest.fn();
const mockReadWrapperSize = jest.fn();
const mockIsUserScroll = jest.fn();
const mockRefitViewport = jest.fn();

jest.mock('../../../../../utils/fit-viewport', () => ({
	insetFittedViewport: (...args: unknown[]) => mockInsetFittedViewport(...args),
	readViewportCenterOnMedia: (...args: unknown[]) => mockReadViewportCenterOnMedia(...args),
	readWrapperScroll: (...args: unknown[]) => mockReadWrapperScroll(...args),
	readWrapperSize: (...args: unknown[]) => mockReadWrapperSize(...args),
	isUserScroll: (...args: unknown[]) => mockIsUserScroll(...args),
	refitViewport: (...args: unknown[]) => mockRefitViewport(...args),
}));

const WRAPPER_SIZE = { width: 400, height: 300 };
const INSET_VIEWPORT = new Rectangle(WRAPPER_SIZE.width, WRAPPER_SIZE.height);
const NARROW_WRAPPER_SIZE = { width: 200, height: 150 };
const REFIT = {
	camera: new Camera(new Rectangle(500, 400), new Rectangle(1000, 500)),
	zoomLevel: new ZoomLevel(0.5),
};
const REFIT_SIZE = REFIT.camera.scaledImg(REFIT.zoomLevel.value);
const FITTED_WRAPPER_SIZE = { width: 1, height: 2 };
const WRAPPER_SCROLL = { scrollLeft: 3, scrollTop: 4 };
const SAVED_CENTER = { x: 0.25, y: 0.75 };
// A zoom level created for an earlier, different wrapper size than REFIT's camera fits.
const STALE_FIT_VALUE = 0.25;
const ZOOMED_VALUE = 1;
const ZOOMED_REFIT = {
	camera: REFIT.camera,
	zoomLevel: new ZoomLevel(STALE_FIT_VALUE, ZOOMED_VALUE),
};
const FIT_SIZE = REFIT.camera.scaledImg(REFIT.camera.scaleDownToFit);
const DRAG_START = 100;
const DRAG_END = 150;

beforeEach(() => {
	mockInsetFittedViewport.mockReset();
	mockInsetFittedViewport.mockReturnValue(INSET_VIEWPORT);
	mockReadViewportCenterOnMedia.mockReset();
	mockReadWrapperScroll.mockReset();
	mockReadWrapperSize.mockReset();
	mockIsUserScroll.mockReset();
	mockIsUserScroll.mockReturnValue(false);
	mockRefitViewport.mockReset();
	mockRefitViewport.mockReturnValue(null);
});

interface ImageSize {
	naturalWidth: number;
	naturalHeight: number;
}

const imageWrapperClassName = 'div.media-viewer-image-content';

const src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

function setup(props?: Partial<Props & ImageSize>) {
	const onClose = jest.fn();
	const onBlanketClicked = jest.fn();

	const component = render(
		<IntlProvider locale="en">
			<InsetViewerProvider isInsetViewer={!!props?.isInsetViewer}>
				<InteractiveImgComponent
					onLoad={jest.fn()}
					onError={jest.fn()}
					src={src}
					alt="test"
					onClose={onClose}
					onBlanketClicked={onBlanketClicked}
					{...props}
				/>
				{/* The inset zoom controls render into the media footer. */}
				{props?.isInsetViewer ? <MediaFooterBar /> : null}
			</InsetViewerProvider>
		</IntlProvider>,
	);

	const wrapper = component.container.querySelector(imageWrapperClassName);
	Object.defineProperty(wrapper, 'clientWidth', {
		configurable: true,
		value: WRAPPER_SIZE.width,
	});
	Object.defineProperty(wrapper, 'clientHeight', {
		configurable: true,
		value: WRAPPER_SIZE.height,
	});

	const img = screen.getByTestId('media-viewer-image');
	Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', {
		configurable: true,
		value: props?.naturalWidth ?? MAX_RESOLUTION, // Mocked value
	});

	Object.defineProperty(HTMLImageElement.prototype, 'naturalHeight', {
		configurable: true,
		value: props?.naturalHeight ?? MAX_RESOLUTION * 0.75, // Mocked value
	});

	// Trigger the onLoad event manually
	fireEvent.load(img);

	return { component, onClose, onBlanketClicked };
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('InteractiveImg', () => {
	it('should have image and overflow invisible until camera is defined', () => {
		const { container } = render(
			<IntlProvider locale="en">
				<InteractiveImgComponent
					onLoad={jest.fn()}
					onError={jest.fn()}
					src={src}
					alt="test"
					onClose={jest.fn()}
					onBlanketClicked={jest.fn()}
				/>
			</IntlProvider>,
		);

		expect(container.querySelector('img')).not.toBeVisible();

		expect(
			getComputedStyle(screen.getByTestId('media-viewer-image-content')).getPropertyValue(
				'overflow',
			),
		).toBe('hidden');
	});

	it('should have image and overflow visible when camera is defined', async () => {
		setup();
		await waitFor(() => {
			expect(screen.getByTestId('media-viewer-image')).toBeVisible();
		});

		expect(
			getComputedStyle(screen.getByTestId('media-viewer-image-content')).getPropertyValue(
				'overflow',
			),
		).not.toBe('hidden');
	});

	it('should allow zooming', async () => {
		setup({
			naturalWidth: 400,
			naturalHeight: 300,
		});
		await waitFor(() => {
			expect(screen.getByTestId('media-viewer-image')).toBeVisible();
		});
		const zoomIn = screen.getByLabelText('zoom in');
		const zoomOut = screen.getByLabelText('zoom out');

		fireEvent.click(zoomOut);
		const zoomLevel = screen.getByTestId('zoom-level-indicator');
		expect(parseInt(zoomLevel.innerText, 10)).toBeLessThan(100);
		fireEvent.click(zoomIn);
		expect(parseInt(zoomLevel.innerText, 10)).toBe(100);
	});

	it('should set the correct width and height on the Img element', async () => {
		setup();
		await waitFor(() => {
			expect(screen.getByTestId('media-viewer-image')).toBeVisible();
		});

		const img = screen.getByTestId('media-viewer-image');

		expect(img.getAttribute('style')).toContain('width: 400px; height: 300px;');
	});

	it('should set the correct scrollLeft value on the ImageWrapper', async () => {
		const { component } = setup();
		await waitFor(() => {
			expect(screen.getByTestId('media-viewer-image')).toBeVisible();
		});

		const zoomIn = screen.getByLabelText('zoom in');
		fireEvent.click(zoomIn);
		const wrapper = component.container.querySelector(imageWrapperClassName);

		expect(wrapper?.scrollLeft).toEqual(100);
	});

	it('should rotate image when orientation is provided', async () => {
		setup({ orientation: 2 });
		await waitFor(() => {
			expect(screen.getByTestId('media-viewer-image')).toBeVisible();
		});
		const img = screen.getByTestId('media-viewer-image');

		expect(getComputedStyle(img)).toEqual(
			expect.objectContaining({
				transform: 'rotateY(180deg)',
			}),
		);
	});

	describe('drag and drop', () => {
		it('should not move image before a mousedown event', async () => {
			const { component } = setup();
			await waitFor(() => {
				expect(screen.getByTestId('media-viewer-image')).toBeVisible();
			});
			const wrapper = component.container.querySelector(imageWrapperClassName)!;
			const { scrollLeft: oldScrollLeft, scrollTop: oldScrollTop } = wrapper;
			const mouseMove = createMouseEvent('mousemove', {
				screenX: 300,
				screenY: 200,
			});
			document.dispatchEvent(mouseMove);
			expect(wrapper.scrollLeft).toEqual(oldScrollLeft);
			expect(wrapper.scrollTop).toEqual(oldScrollTop);
		});

		it('should move image after a mousedown event', async () => {
			const { component } = setup();
			await waitFor(() => {
				expect(screen.getByTestId('media-viewer-image')).toBeVisible();
			});
			fireEvent.mouseDown(screen.getByTestId('media-viewer-image'), { screenX: 100, screenY: 100 });

			const wrapper = component.container.querySelector(imageWrapperClassName)!;
			const { scrollLeft: oldScrollLeft, scrollTop: oldScrollTop } = wrapper;

			fireEvent.mouseMove(document, {
				screenX: 300,
				screenY: 200,
			});

			expect(wrapper.scrollLeft).not.toEqual(oldScrollLeft);
			expect(wrapper.scrollTop).not.toEqual(oldScrollTop);
		});

		it('should stop moving image after a mouseup event', async () => {
			const { component } = setup();
			await waitFor(() => {
				expect(screen.getByTestId('media-viewer-image')).toBeVisible();
			});

			fireEvent.mouseDown(screen.getByTestId('media-viewer-image'), { screenX: 100, screenY: 100 });

			fireEvent.mouseUp(document);

			const wrapper = component.container.querySelector(imageWrapperClassName)!;
			const { scrollLeft: oldScrollLeft, scrollTop: oldScrollTop } = wrapper;

			fireEvent.mouseMove(screen.getByTestId('media-viewer-image'), { screenX: 300, screenY: 200 });

			expect(wrapper.scrollLeft).toEqual(oldScrollLeft);
			expect(wrapper.scrollTop).toEqual(oldScrollTop);
		});

		it('should make an image draggable when it is zoomed larger than the screen', async () => {
			setup();
			await waitFor(() => {
				expect(screen.getByTestId('media-viewer-image')).toBeVisible();
			});
			const zoomIn = screen.getByLabelText('zoom in');

			fireEvent.click(zoomIn);

			const imgStyles = getComputedStyle(screen.getByTestId('media-viewer-image'));
			await waitFor(() => {
				expect(imgStyles.cursor).toEqual('grab');
			});
		});

		it('should make an image not draggable when it is zoomed smaller than or equal to the screen', async () => {
			setup();
			await waitFor(() => {
				expect(screen.getByTestId('media-viewer-image')).toBeVisible();
			});
			const zoomOut = screen.getByLabelText('zoom out');

			fireEvent.click(zoomOut);
			const imgStyles = getComputedStyle(screen.getByTestId('media-viewer-image'));

			expect(imgStyles.cursor).not.toEqual('grab');
		});

		it('should mark image as isDragging when it is being dragged', async () => {
			setup();
			await waitFor(() => {
				expect(screen.getByTestId('media-viewer-image')).toBeVisible();
			});
			const zoomIn = screen.getByLabelText('zoom in');

			fireEvent.click(zoomIn);

			await waitFor(() => {
				expect(getComputedStyle(screen.getByTestId('media-viewer-image')).cursor).toEqual('grab');
			});

			fireEvent.mouseDown(screen.getByTestId('media-viewer-image'), { screenX: 100, screenY: 100 });

			await waitFor(() => {
				expect(getComputedStyle(screen.getByTestId('media-viewer-image')).cursor).toEqual(
					'grabbing',
				);
			});
		});

		it('should only apply image-rendering css props when zoom level greater than 1 (zoomed in)', async () => {
			setup({
				naturalWidth: 200,
				naturalHeight: 150,
			});
			await waitFor(() => {
				expect(screen.getByTestId('media-viewer-image')).toBeVisible();
			});

			expect(getComputedStyle(screen.getByTestId('media-viewer-image')).imageRendering).not.toBe(
				'pixelated',
			);
			const zoomIn = screen.getByLabelText('zoom in');

			fireEvent.click(zoomIn);

			expect(getComputedStyle(screen.getByTestId('media-viewer-image')).imageRendering).toBe(
				'pixelated',
			);
		});

		it('should load non-binary resource first', async () => {
			setup({
				originalBinaryImageSrc: 'some-original-binary-url',
			});
			expect(screen.getByTestId('media-viewer-image').getAttribute('src')).toEqual(src);
		});

		it('should not show HD button when no binaryUrl provided', async () => {
			const { component } = setup();
			await waitFor(() => {
				expect(screen.getByTestId('media-viewer-image')).toBeVisible();
			});

			expect(component.queryByLabelText('hd')).toBeNull();
		});

		it('should not show HD button when displayed image is smaller then MAX Res', async () => {
			const { component } = setup({
				originalBinaryImageSrc: 'some-original-binary-url',
				naturalWidth: 400,
				naturalHeight: 300,
			});
			await waitFor(() => {
				expect(screen.getByTestId('media-viewer-image')).toBeVisible();
			});
			expect(component.queryByLabelText('hd')).toBeNull();
		});

		it('should show inactive HD button when binaryUrl provided', async () => {
			const { component } = setup({
				originalBinaryImageSrc: 'some-original-binary-url',
			});
			await waitFor(() => {
				expect(screen.getByTestId('media-viewer-image')).toBeVisible();
			});
			expect(component.getByLabelText('hd')).toBeInTheDocument();
		});

		it('should show active HD button when zoomed in after 100%', async () => {
			setup({
				originalBinaryImageSrc: 'some-original-binary-url',
			});

			// Zoom 6 times till it hits 100%
			for (let i = 0; i < 6; i++) {
				const zoomIn = screen.getByLabelText('zoom in');

				fireEvent.click(zoomIn);
			}
			await waitFor(() => {
				expect(screen.getByLabelText('hd active')).toBeInTheDocument();
			});
		});
	});
});

describe('analytics', () => {
	it('should raise onBlanketClicked when blanket clicked', async () => {
		const { component, onBlanketClicked } = setup();
		await waitFor(() => {
			expect(screen.getByTestId('media-viewer-image')).toBeVisible();
		});
		const wrapper = component.container.querySelector(imageWrapperClassName)!;

		fireEvent.click(wrapper);
		expect(onBlanketClicked).toHaveBeenCalled();
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('click-to-close in inset mode', () => {
	it.each([
		{ presentation: 'overlay', isInsetViewer: undefined, closes: true },
		{ presentation: 'inset', isInsetViewer: true, closes: false },
	])(
		'should close on a media click in the $presentation presentation: $closes',
		async ({ isInsetViewer, closes }) => {
			const { component, onClose, onBlanketClicked } = setup({ isInsetViewer });
			await waitFor(() => {
				expect(screen.getByTestId('media-viewer-image')).toBeVisible();
			});

			fireEvent.click(component.container.querySelector(imageWrapperClassName)!);

			expect(onBlanketClicked.mock.calls.length > 0).toBe(closes);
			expect(onClose.mock.calls.length > 0).toBe(closes);
		},
	);

	it.each([
		{ presentation: 'overlay', isInsetViewer: false, closes: true },
		{ presentation: 'inset', isInsetViewer: true, closes: false },
	])(
		'should read the $presentation presentation from the inset viewer context',
		({ isInsetViewer, closes }) => {
			const onClose = jest.fn();
			const { container } = render(
				<IntlProvider locale="en">
					<InsetViewerProvider isInsetViewer={isInsetViewer}>
						<InteractiveImg
							onLoad={jest.fn()}
							onError={jest.fn()}
							src={src}
							alt="test"
							onClose={onClose}
						/>
					</InsetViewerProvider>
				</IntlProvider>,
			);

			fireEvent.load(screen.getByTestId('media-viewer-image'));
			fireEvent.click(container.querySelector(imageWrapperClassName)!);

			expect(onClose.mock.calls.length > 0).toBe(closes);
		},
	);
});

describe('wrapper resize', () => {
	type FakeResizeObserverEntry = { callback: ResizeObserverCallback; nodes: Element[] };
	let liveResizeObservers: Set<FakeResizeObserverEntry>;
	let realResizeObserver: typeof window.ResizeObserver;

	// Replaces window.ResizeObserver in every test below. notifyResizeObservers() makes it report a resize.
	class FakeResizeObserver {
		private entry: FakeResizeObserverEntry;

		constructor(callback: ResizeObserverCallback) {
			this.entry = { callback, nodes: [] };
			liveResizeObservers.add(this.entry);
		}

		observe(node: Element) {
			this.entry.nodes.push(node);
		}

		disconnect() {
			liveResizeObservers.delete(this.entry);
		}
	}

	beforeEach(() => {
		liveResizeObservers = new Set();
		realResizeObserver = window.ResizeObserver;
		window.ResizeObserver = FakeResizeObserver as unknown as typeof ResizeObserver;
	});

	afterEach(() => {
		window.ResizeObserver = realResizeObserver;
		liveResizeObservers.clear();
	});

	const renderLoaded = async (props?: Partial<Props>) => {
		const { component } = setup(props);
		await waitFor(() => {
			expect(screen.getByTestId('media-viewer-image')).toBeVisible();
		});
		return {
			component,
			wrapper: component.container.querySelector(imageWrapperClassName)!,
			img: screen.getByTestId('media-viewer-image'),
		};
	};

	const notifyResizeObservers = (wrapper: Element) => {
		act(() => {
			[...liveResizeObservers]
				.filter((observer) => observer.nodes.includes(wrapper))
				.forEach((observer) => observer.callback([], observer as unknown as ResizeObserver));
		});
	};

	const resizeWindow = () => {
		act(() => {
			window.dispatchEvent(new Event('resize'));
		});
	};

	describe('when inset is disabled', () => {
		it('should refit to the full wrapper size on a window resize event', async () => {
			const { wrapper, img } = await renderLoaded();
			Object.defineProperty(wrapper, 'clientWidth', {
				configurable: true,
				value: NARROW_WRAPPER_SIZE.width,
			});
			Object.defineProperty(wrapper, 'clientHeight', {
				configurable: true,
				value: NARROW_WRAPPER_SIZE.height,
			});

			resizeWindow();

			expect(img.getAttribute('style')).toContain(
				`width: ${NARROW_WRAPPER_SIZE.width}px; height: ${NARROW_WRAPPER_SIZE.height}px;`,
			);
			expect(mockRefitViewport).not.toHaveBeenCalled();
		});

		it('should not create a ResizeObserver or call isUserScroll on a scroll event', async () => {
			const { wrapper } = await renderLoaded();

			fireEvent.scroll(wrapper);

			expect(liveResizeObservers.size).toBe(0);
			expect(mockIsUserScroll).not.toHaveBeenCalled();
		});
	});

	describe('when inset is enabled', () => {
		it('should fit the media to the inset viewport when it loads', async () => {
			const { wrapper } = await renderLoaded({ isInsetViewer: true });

			expect(mockInsetFittedViewport).toHaveBeenCalledWith(wrapper);
		});

		it('should refit the media when the ResizeObserver reports a wrapper resize', async () => {
			mockRefitViewport.mockReturnValue(REFIT);
			const { wrapper, img } = await renderLoaded({ isInsetViewer: true });

			notifyResizeObservers(wrapper);

			expect(mockRefitViewport).toHaveBeenCalledWith({
				wrapper,
				media: img,
				camera: expect.any(Camera),
				zoomLevel: expect.any(ZoomLevel),
				savedViewportCenter: undefined,
			});
			expect(img.getAttribute('style')).toContain(
				`width: ${REFIT_SIZE.width}px; height: ${REFIT_SIZE.height}px;`,
			);
		});

		it('should fit to the current wrapper when fit to screen is clicked after a refit', async () => {
			mockRefitViewport.mockReturnValue(ZOOMED_REFIT);
			const { wrapper, img } = await renderLoaded({ isInsetViewer: true });
			notifyResizeObservers(wrapper);

			fireEvent.click(screen.getByTestId('zoom-level-indicator'));

			expect(img.getAttribute('style')).toContain(
				`width: ${FIT_SIZE.width}px; height: ${FIT_SIZE.height}px;`,
			);
		});

		it('should keep the media size when refitViewport returns nothing', async () => {
			mockRefitViewport.mockReturnValue(null);
			const { wrapper, img } = await renderLoaded({ isInsetViewer: true });
			const styleBefore = img.getAttribute('style');

			notifyResizeObservers(wrapper);

			expect(img.getAttribute('style')).toEqual(styleBefore);
		});

		it('should not refit on a window resize event, because the ResizeObserver handles resizes', async () => {
			await renderLoaded({ isInsetViewer: true });

			resizeWindow();

			expect(mockRefitViewport).not.toHaveBeenCalled();
		});

		it('should refit on a window resize event when ResizeObserver is not supported', async () => {
			window.ResizeObserver = undefined as unknown as typeof ResizeObserver;
			await renderLoaded({ isInsetViewer: true });

			resizeWindow();

			expect(mockRefitViewport).toHaveBeenCalledTimes(1);
		});

		it('should disconnect the ResizeObserver on unmount', async () => {
			const { component } = await renderLoaded({ isInsetViewer: true });

			component.unmount();

			expect(liveResizeObservers.size).toBe(0);
		});

		it.each([
			{
				trigger: 'zooming',
				interact: () => {
					fireEvent.click(screen.getByRole('button', { name: 'zoom in' }));
				},
			},
			{
				trigger: 'dragging',
				interact: (img: Element) => {
					fireEvent.mouseDown(img, { screenX: DRAG_START, screenY: DRAG_START });
					fireEvent.mouseMove(document, { screenX: DRAG_END, screenY: DRAG_START });
				},
			},
			{
				trigger: 'a user scroll',
				interact: (_img: Element, wrapper: Element) => {
					mockIsUserScroll.mockReturnValue(true);
					fireEvent.scroll(wrapper);
				},
			},
		])(
			'should give refitViewport the center saved after $trigger on the next resize',
			async ({ interact }) => {
				mockReadViewportCenterOnMedia.mockReturnValue(SAVED_CENTER);
				const { wrapper, img } = await renderLoaded({ isInsetViewer: true });

				interact(img, wrapper);
				notifyResizeObservers(wrapper);

				expect(mockRefitViewport).toHaveBeenLastCalledWith(
					expect.objectContaining({ savedViewportCenter: SAVED_CENTER }),
				);
			},
		);

		it('should not save the center when isUserScroll says the user did not scroll', async () => {
			mockIsUserScroll.mockReturnValue(false);
			mockReadViewportCenterOnMedia.mockReturnValue(SAVED_CENTER);
			const { wrapper } = await renderLoaded({ isInsetViewer: true });

			fireEvent.scroll(wrapper);
			notifyResizeObservers(wrapper);

			expect(mockRefitViewport).toHaveBeenLastCalledWith(
				expect.objectContaining({ savedViewportCenter: undefined }),
			);
		});

		it('should call isUserScroll with the wrapper size and scroll position from the last refit', async () => {
			mockRefitViewport.mockReturnValue(REFIT);
			mockReadWrapperSize.mockReturnValue(FITTED_WRAPPER_SIZE);
			mockReadWrapperScroll.mockReturnValue(WRAPPER_SCROLL);
			const { wrapper } = await renderLoaded({ isInsetViewer: true });
			notifyResizeObservers(wrapper);

			fireEvent.scroll(wrapper);

			expect(mockIsUserScroll).toHaveBeenCalledWith(wrapper, FITTED_WRAPPER_SIZE, WRAPPER_SCROLL);
		});
	});
});
