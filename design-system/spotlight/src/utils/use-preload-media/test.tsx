import { renderHook } from '@testing-library/react';

import * as browserApis from '@atlaskit/browser-apis';

import { usePreloadMedia } from './index';

describe('usePreloadMedia', () => {
	beforeEach(() => {
		// Mock video.load() since JSDOM doesn't implement it
		HTMLMediaElement.prototype.load = jest.fn();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should create and preload a video element for video mimetypes', () => {
		const createElementSpy = jest.spyOn(document, 'createElement');

		const { unmount } = renderHook(() => usePreloadMedia('video.mp4', { mimetype: 'video/mp4' }));

		// Should have created a video element
		const videoCall = createElementSpy.mock.calls.find((call) => call[0] === 'video');
		expect(videoCall).toBeDefined();

		// Find the video element created
		const videoElement = createElementSpy.mock.results.find(
			(result) => result.value instanceof HTMLVideoElement,
		)?.value as HTMLVideoElement;

		expect(videoElement).toBeDefined();
		expect(videoElement.src).toContain('video.mp4');
		expect(videoElement.preload).toBe('auto');
		expect(videoElement.load).toHaveBeenCalled();

		// Verify cleanup on unmount
		unmount();
		expect(videoElement.load).toHaveBeenCalledTimes(2); // Once on mount, once on cleanup

		createElementSpy.mockRestore();
	});

	it('should create and preload an Image for image mimetypes', () => {
		// Spy on the Image constructor
		const originalImage = global.Image;
		const imageSpy = jest.fn().mockImplementation(() => {
			return new originalImage();
		});
		global.Image = imageSpy as any;

		const { unmount } = renderHook(() => usePreloadMedia('image.gif', { mimetype: 'image/gif' }));

		// Should have created an Image
		expect(imageSpy).toHaveBeenCalledTimes(1);

		// Get the created image
		const imageElement = imageSpy.mock.results[0].value as HTMLImageElement;
		expect(imageElement.src).toContain('image.gif');

		// Verify cleanup on unmount
		const originalSrc = imageElement.src;
		unmount();
		expect(imageElement.src).not.toBe(originalSrc);

		global.Image = originalImage;
	});

	it('should handle SSR gracefully when document is unavailable', () => {
		// Mock getDocument to return undefined (SSR scenario)
		const getDocumentSpy = jest.spyOn(browserApis, 'getDocument').mockReturnValue(null);

		// Should not throw an error
		const { unmount } = renderHook(() => usePreloadMedia('video.mp4', { mimetype: 'video/mp4' }));

		// Should have called getDocument
		expect(getDocumentSpy).toHaveBeenCalled();

		// Unmounting should not throw
		expect(() => unmount()).not.toThrow();

		getDocumentSpy.mockRestore();
	});
});
