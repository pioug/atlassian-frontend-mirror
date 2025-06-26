import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { type FileIdentifier, type ResponseFileItem } from '@atlaskit/media-client';
import { generateSampleFileItem } from '@atlaskit/media-test-data';

import { createMockedMediaClientProvider } from './__tests__/helpers/_MockedMediaClientProvider';
import { mediaFilePreviewCache } from './getPreview';
import { useMediaImage } from './useMediaImage';

const createMediaBlobUrlAttrsObject = ({
	identifier,
	fileItem,
}: {
	fileItem: ResponseFileItem;
	identifier: FileIdentifier;
}) => ({
	id: identifier.id,
	contextId: 'some-context',
	collection: identifier.collectionName,
	size: 123456,
	name: fileItem.details.name,
	mimeType: fileItem.details.mimeType,
	width: 100,
	height: 100,
	alt: 'some-alt',
});

describe('useMediaImage', () => {
	let onLoad: () => void;
	let onError: () => void;

	beforeEach(() => {
		mediaFilePreviewCache.clear();
		onLoad = jest.fn();
		onError = jest.fn();
	});

	it('should capture and report a11y violations', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
		const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
			initialItems: fileItem,
		});
		const getImageSpy = jest.spyOn(mediaApi, 'getImage');
		const mediaBlobUrlAttrs = createMediaBlobUrlAttrsObject({
			fileItem,
			identifier,
		});
		const { result } = renderHook(useMediaImage, {
			wrapper: ({ children }) => <MockedMediaClientProvider>{children}</MockedMediaClientProvider>,
			initialProps: {
				identifier,
				mediaBlobUrlAttrs,
			},
		});
		expect(getImageSpy).toBeCalledTimes(1);
		// Waiting for the image src to be fetched
		await waitFor(() => {
			const imgSrc = result?.current.getImgProps().src;
			return expect(imgSrc).toEqual(
				expect.stringContaining('mock result of URL.createObjectURL()'),
			);
		});
		// Rendering the image element
		const { getImgProps } = result?.current;
		const { container } = render(<img {...getImgProps()} />);

		await expect(container).toBeAccessible({
			violationCount: 1,
		});
	});

	it('should render an image successfully with all of its data-test attributes', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
		const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
			initialItems: fileItem,
		});

		const getImageSpy = jest.spyOn(mediaApi, 'getImage');

		const mediaBlobUrlAttrs = createMediaBlobUrlAttrsObject({
			fileItem,
			identifier,
		});

		const { result } = renderHook(useMediaImage, {
			wrapper: ({ children }) => <MockedMediaClientProvider>{children}</MockedMediaClientProvider>,
			initialProps: {
				identifier,
				mediaBlobUrlAttrs,
			},
		});

		expect(getImageSpy).toBeCalledTimes(1);

		// Waiting for the image src to be fetched
		await waitFor(() => {
			const imgSrc = result?.current.getImgProps().src;
			return expect(imgSrc).toEqual(
				expect.stringContaining('mock result of URL.createObjectURL()'),
			);
		});

		// Rendering the image element
		const { getImgProps } = result?.current;
		render(<img {...getImgProps()} />);

		// Assertions
		const imgElement: HTMLImageElement = screen.getByRole('img');
		expect(imgElement).toHaveAttribute('data-test-collection', identifier.collectionName);
		expect(imgElement).toHaveAttribute('data-test-file-id', identifier.id);
		expect(imgElement).toHaveAttribute('data-test-preview-source', 'remote');
	});

	it('should call onLoad function successfully after rendering an image', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
		const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
			initialItems: fileItem,
		});

		const getImageSpy = jest.spyOn(mediaApi, 'getImage');

		const { result } = renderHook(useMediaImage, {
			wrapper: ({ children }) => <MockedMediaClientProvider>{children}</MockedMediaClientProvider>,
			initialProps: {
				identifier,
				onLoad,
				onError,
			},
		});

		expect(getImageSpy).toBeCalledTimes(1);

		// Waiting for the image src to be fetched
		await waitFor(() => {
			const imgSrc = result?.current.getImgProps().src;
			return expect(imgSrc).toEqual(
				expect.stringContaining('mock result of URL.createObjectURL()'),
			);
		});

		// Rendering and loading the image element
		const { getImgProps } = result?.current;

		render(<img {...getImgProps()} />);
		const imgElement: HTMLImageElement = screen.getByRole('img');
		fireEvent.load(imgElement);

		// Assertions
		expect(onLoad).toHaveBeenCalled();
	});

	it('should call onError function successfully when error is encountered', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
		const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
			initialItems: fileItem,
		});

		const getImageSpy = jest.spyOn(mediaApi, 'getImage');

		// Simulating an error call
		const { result } = renderHook(useMediaImage, {
			wrapper: ({ children }) => <MockedMediaClientProvider>{children}</MockedMediaClientProvider>,
			initialProps: {
				identifier,
				onLoad,
				onError,
			},
		});

		expect(getImageSpy).toBeCalledTimes(1);

		// Waiting for the image src to be fetched
		await waitFor(() => {
			const imgSrc = result?.current.getImgProps().src;
			return expect(imgSrc).toEqual(
				expect.stringContaining('mock result of URL.createObjectURL()'),
			);
		});

		// Rendering and simulate error when loading the image element
		const { getImgProps } = result?.current;

		render(<img {...getImgProps()} />);
		const imgElement: HTMLImageElement = screen.getByRole('img');
		fireEvent.error(imgElement);

		// Assertions
		expect(onLoad).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalled();
	});

	it('should have getSsrScriptProps when SSR is server', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
		const { MockedMediaClientProvider } = createMockedMediaClientProvider({
			initialItems: fileItem,
		});

		const { result } = renderHook(useMediaImage, {
			wrapper: ({ children }) => <MockedMediaClientProvider>{children}</MockedMediaClientProvider>,
			initialProps: {
				identifier,
				ssr: 'server',
			},
		});

		// Assertions
		expect(result?.current.getSsrScriptProps).toBeTruthy();
	});

	it('should return the right error message', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
		const { MockedMediaClientProvider } = createMockedMediaClientProvider({
			initialItems: fileItem,
		});

		// Simulating an error call
		const { result } = renderHook(useMediaImage, {
			wrapper: ({ children }) => <MockedMediaClientProvider>{children}</MockedMediaClientProvider>,
			initialProps: {
				identifier,
				skipRemote: false,
				traceContext: { traceId: 'some-trace' },
				onLoad,
				onError,
			},
		});

		// Waiting for the image src to be fetched
		await waitFor(() => {
			const imgSrc = result?.current.getImgProps().src;
			return expect(imgSrc).toEqual(
				expect.stringContaining('mock result of URL.createObjectURL()'),
			);
		});

		// Rendering and simulate error when loading the image element
		const { getImgProps } = result?.current;

		render(<img {...getImgProps()} />);
		const imgElement: HTMLImageElement = screen.getByRole('img');

		// Trigger error
		fireEvent.error(imgElement);

		// Assertions
		const { error } = result?.current;
		expect(error).toMatchObject({
			primaryReason: 'remote-uri',
		});
		expect(onLoad).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalled();
	});
});
