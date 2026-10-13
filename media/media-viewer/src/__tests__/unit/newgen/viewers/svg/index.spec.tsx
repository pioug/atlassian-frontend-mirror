import React from 'react';

import { IntlProvider } from 'react-intl';

import { MockedMediaClientProvider } from '@atlaskit/media-client-react/mocked-media-client-provider';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers/mocked-media-api';
import { generateSampleFileItem } from '@atlaskit/media-test-data/sample-file-items';
import { Camera } from '@atlaskit/media-ui/camera/camera';
import { Rectangle } from '@atlaskit/media-ui/rectangle';
import { act } from '@atlassian/testing-library/act';
import { fireEvent } from '@atlassian/testing-library/fire-event';
import { render } from '@atlassian/testing-library/render';
import { screen } from '@atlassian/testing-library/screen';

import { ZoomLevel } from '../../../../../domain/zoomLevel';
import { InsetViewerProvider } from '../../../../../insetViewerContext';
import { MediaFooterBar } from '../../../../../styleWrappers';
import { SvgViewer } from '../../../../../viewers/svg';

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
const NARROW_WRAPPER_SIZE = { width: 200, height: 150 };
const NATURAL_SIZE = { width: 4000, height: 3000 };
const INSET_VIEWPORT = new Rectangle(WRAPPER_SIZE.width, WRAPPER_SIZE.height);
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

const renderSvg = async (isInsetViewer: boolean) => {
	const [fileItem, identifier] = generateSampleFileItem.svg();
	const { mediaApi } = createMockedMediaApi(fileItem);

	const { unmount } = render(
		<IntlProvider locale="en">
			<MockedMediaClientProvider mockedMediaApi={mediaApi}>
				<InsetViewerProvider isInsetViewer={isInsetViewer}>
					<SvgViewer identifier={identifier} onError={jest.fn()} />
					{/* The inset zoom controls render into the media footer. */}
					{isInsetViewer ? <MediaFooterBar /> : null}
				</InsetViewerProvider>
			</MockedMediaClientProvider>
		</IntlProvider>,
	);
	const wrapper = screen.getByTestId('media-viewer-svg-wrapper');
	Object.defineProperty(wrapper, 'clientWidth', { configurable: true, value: WRAPPER_SIZE.width });
	Object.defineProperty(wrapper, 'clientHeight', {
		configurable: true,
		value: WRAPPER_SIZE.height,
	});
	const media = await screen.findByTestId('media-viewer-svg');
	// Natural size on the element itself, not the prototype, so nothing leaks.
	Object.defineProperty(media, 'naturalWidth', { configurable: true, value: NATURAL_SIZE.width });
	Object.defineProperty(media, 'naturalHeight', {
		configurable: true,
		value: NATURAL_SIZE.height,
	});
	fireEvent.load(media);
	return { wrapper, media, unmount };
};

describe('SvgViewer wrapper resize', () => {
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

	afterEach(() => {
		window.ResizeObserver = realResizeObserver;
		liveResizeObservers.clear();
	});

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
			const { wrapper, media } = await renderSvg(false);
			Object.defineProperty(wrapper, 'clientWidth', {
				configurable: true,
				value: NARROW_WRAPPER_SIZE.width,
			});
			Object.defineProperty(wrapper, 'clientHeight', {
				configurable: true,
				value: NARROW_WRAPPER_SIZE.height,
			});

			resizeWindow();

			expect(media).toHaveStyle({
				width: `${NARROW_WRAPPER_SIZE.width}px`,
				height: `${NARROW_WRAPPER_SIZE.height}px`,
			});
			expect(mockRefitViewport).not.toHaveBeenCalled();
		});

		it('should not create a ResizeObserver or call isUserScroll on a scroll event', async () => {
			const { wrapper } = await renderSvg(false);

			fireEvent.scroll(wrapper);

			expect(liveResizeObservers.size).toBe(0);
			expect(mockIsUserScroll).not.toHaveBeenCalled();
		});
	});

	describe('when inset is enabled', () => {
		it('should be accessible', async () => {
			await renderSvg(true);

			await expect(document.body).toBeAccessible();
		});

		it('should fit the media to the inset viewport when it loads', async () => {
			const { wrapper } = await renderSvg(true);

			expect(mockInsetFittedViewport).toHaveBeenCalledWith(wrapper);
		});

		it('should refit the media when the ResizeObserver reports a wrapper resize', async () => {
			mockRefitViewport.mockReturnValue(REFIT);
			const { wrapper, media } = await renderSvg(true);

			notifyResizeObservers(wrapper);

			expect(mockRefitViewport).toHaveBeenCalledWith({
				wrapper,
				media,
				camera: expect.any(Camera),
				zoomLevel: expect.any(ZoomLevel),
				savedViewportCenter: undefined,
			});
			expect(media).toHaveStyle({
				width: `${REFIT_SIZE.width}px`,
				height: `${REFIT_SIZE.height}px`,
			});
		});

		it('should fit to the current wrapper when fit to screen is clicked after a refit', async () => {
			mockRefitViewport.mockReturnValue(ZOOMED_REFIT);
			const { wrapper, media } = await renderSvg(true);
			notifyResizeObservers(wrapper);

			fireEvent.click(screen.getByTestId('zoom-level-indicator'));

			expect(media).toHaveStyle({ width: `${FIT_SIZE.width}px`, height: `${FIT_SIZE.height}px` });
		});

		it('should keep the media size when refitViewport returns nothing', async () => {
			mockRefitViewport.mockReturnValue(null);
			const { wrapper, media } = await renderSvg(true);
			const styleBefore = media.getAttribute('style');

			notifyResizeObservers(wrapper);

			expect(media.getAttribute('style')).toEqual(styleBefore);
		});

		it('should not refit on a window resize event, because the ResizeObserver handles resizes', async () => {
			await renderSvg(true);

			resizeWindow();

			expect(mockRefitViewport).not.toHaveBeenCalled();
		});

		it('should refit on a window resize event when ResizeObserver is not supported', async () => {
			window.ResizeObserver = undefined as unknown as typeof ResizeObserver;
			await renderSvg(true);

			resizeWindow();

			expect(mockRefitViewport).toHaveBeenCalledTimes(1);
		});

		it('should disconnect the ResizeObserver on unmount', async () => {
			const { unmount } = await renderSvg(true);

			unmount();

			expect(liveResizeObservers.size).toBe(0);
		});

		it('should keep the same ResizeObserver when the media is zoomed', async () => {
			await renderSvg(true);
			const [observerBefore] = [...liveResizeObservers];

			fireEvent.click(screen.getByRole('button', { name: 'zoom in' }));

			expect(liveResizeObservers.size).toBe(1);
			expect([...liveResizeObservers][0]).toBe(observerBefore);
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
				interact: (media: Element) => {
					fireEvent.mouseDown(media, { screenX: DRAG_START, screenY: DRAG_START });
					fireEvent.mouseMove(document, { screenX: DRAG_END, screenY: DRAG_START });
				},
			},
			{
				trigger: 'a user scroll',
				interact: (_media: Element, wrapper: Element) => {
					mockIsUserScroll.mockReturnValue(true);
					fireEvent.scroll(wrapper);
				},
			},
		])(
			'should give refitViewport the center saved after $trigger on the next resize',
			async ({ interact }) => {
				mockReadViewportCenterOnMedia.mockReturnValue(SAVED_CENTER);
				const { wrapper, media } = await renderSvg(true);

				interact(media, wrapper);
				notifyResizeObservers(wrapper);

				expect(mockRefitViewport).toHaveBeenLastCalledWith(
					expect.objectContaining({ savedViewportCenter: SAVED_CENTER }),
				);
			},
		);

		it('should not save the center when isUserScroll says the user did not scroll', async () => {
			mockIsUserScroll.mockReturnValue(false);
			mockReadViewportCenterOnMedia.mockReturnValue(SAVED_CENTER);
			const { wrapper } = await renderSvg(true);

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
			const { wrapper } = await renderSvg(true);
			notifyResizeObservers(wrapper);

			fireEvent.scroll(wrapper);

			expect(mockIsUserScroll).toHaveBeenCalledWith(wrapper, FITTED_WRAPPER_SIZE, WRAPPER_SCROLL);
		});
	});
});
