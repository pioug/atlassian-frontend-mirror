import React from 'react';
import { createMouseEvent } from '@atlaskit/media-test-helpers';
import { MAX_RESOLUTION } from '@atlaskit/media-client';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { InteractiveImgComponent, type Props } from '../../../../../viewers/image/interactive-img';

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
			<InteractiveImgComponent
				onLoad={jest.fn()}
				onError={jest.fn()}
				src={src}
				alt="test"
				onClose={onClose}
				onBlanketClicked={onBlanketClicked}
				{...props}
			/>
		</IntlProvider>,
	);

	const wrapper = component.container.querySelector(imageWrapperClassName);
	Object.defineProperty(wrapper, 'clientWidth', {
		value: 400,
	});
	Object.defineProperty(wrapper, 'clientHeight', {
		value: 300,
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

		expect(img.getAttribute('style')).toBe('width: 400px; height: 300px;');
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
