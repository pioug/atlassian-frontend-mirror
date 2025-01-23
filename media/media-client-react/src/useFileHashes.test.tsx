import React from 'react';

import { renderHook } from '@testing-library/react-hooks/dom';

import { mapMediaItemToFileState } from '@atlaskit/media-client';
import { createMockedMediaApi } from '@atlaskit/media-client/test-helpers';
import { createMediaStore } from '@atlaskit/media-state';
import { generateSampleFileItem } from '@atlaskit/media-test-data';

import { MockedMediaClientProvider } from './test-helpers/MockedMediaClientProvider';
import { useFileHashes } from './useFileHashes';

describe('useFileHashes', () => {
	it('should return the hashes of files provided they already exist in state', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
		fileItem.details = {
			...fileItem.details,
			hash: 'some-hash',
		};

		const fileState = mapMediaItemToFileState(fileItem.id, fileItem.details);

		const mediaStore = createMediaStore({
			files: { [identifier.id]: fileState },
		});

		const { mediaApi } = createMockedMediaApi(fileItem);

		const wrapper = ({ children }: { children?: any }) => (
			<MockedMediaClientProvider mediaStore={mediaStore} mockedMediaApi={mediaApi}>
				{children}
			</MockedMediaClientProvider>
		);
		const { result, waitFor } = renderHook(useFileHashes, { wrapper, initialProps: [identifier] });

		await waitFor(() => {
			expect(result.current[identifier.id]).toEqual('some-hash');
		});
	});

	it('should return updated hashes when identifier changes and hashes exist in state', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
		fileItem.details = {
			...fileItem.details,
			hash: 'some-hash',
		};

		const [fileItem2, identifier2] = generateSampleFileItem.workingPdfWithRemotePreview();
		fileItem2.details = {
			...fileItem2.details,
			hash: 'some-other-hash',
		};

		const fileState = mapMediaItemToFileState(fileItem.id, fileItem.details);
		const fileState2 = mapMediaItemToFileState(fileItem2.id, fileItem2.details);

		const mediaStore = createMediaStore({
			files: {
				[identifier.id]: fileState,
				[identifier2.id]: fileState2,
			},
		});

		const { mediaApi } = createMockedMediaApi(fileItem);

		const wrapper = ({ children }: { children?: any }) => (
			<MockedMediaClientProvider mediaStore={mediaStore} mockedMediaApi={mediaApi}>
				{children}
			</MockedMediaClientProvider>
		);
		const { result, rerender, waitFor } = renderHook(useFileHashes, {
			wrapper,
			initialProps: [identifier],
		});

		rerender([identifier, identifier2]);

		await waitFor(() => {
			expect(result.current).toEqual({
				[identifier.id]: 'some-hash',
				[identifier2.id]: 'some-other-hash',
			});
		});
	});

	it('should return get the hashes from API if file details match and hashes are not present', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
		fileItem.details = {
			...fileItem.details,
			hash: 'some-hash',
		};

		const [fileItem2, identifier2] = generateSampleFileItem.workingPdfWithRemotePreview();

		const fileState = mapMediaItemToFileState(fileItem.id, fileItem.details);
		const fileState2WithoutHash = mapMediaItemToFileState(fileItem2.id, fileItem2.details);

		const mediaStore = createMediaStore({
			files: {
				[identifier.id]: fileState,
				[identifier2.id]: fileState2WithoutHash,
			},
		});

		fileItem2.details = {
			...fileItem2.details,
			hash: 'some-other-hash',
		};

		const { mediaApi } = createMockedMediaApi([fileItem, fileItem2]);

		const wrapper = ({ children }: { children?: any }) => (
			<MockedMediaClientProvider mediaStore={mediaStore} mockedMediaApi={mediaApi}>
				{children}
			</MockedMediaClientProvider>
		);
		const { result, waitFor } = renderHook(useFileHashes, {
			wrapper,
			initialProps: [identifier, identifier2],
		});

		await waitFor(() => {
			expect(result.current).toEqual({
				[identifier.id]: 'some-hash',
			});
		});

		await waitFor(() => {
			expect(result.current).toEqual({
				[identifier.id]: 'some-hash',
				[identifier2.id]: 'some-other-hash',
			});
		});
	});

	it('should return get the hashes from API if file details match and hashes are not present', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
		fileItem.details = {
			...fileItem.details,
			hash: 'some-hash',
		};

		const [fileItem2, identifier2] = generateSampleFileItem.workingPdfWithRemotePreview();

		const fileState = mapMediaItemToFileState(fileItem.id, fileItem.details);
		const fileState2WithoutHash = mapMediaItemToFileState(fileItem2.id, fileItem2.details);

		const mediaStore = createMediaStore({
			files: {
				[identifier.id]: fileState,
				[identifier2.id]: fileState2WithoutHash,
			},
		});

		fileItem2.details = {
			...fileItem2.details,
			hash: 'some-other-hash',
		};

		const { mediaApi } = createMockedMediaApi([fileItem, fileItem2]);

		const wrapper = ({ children }: { children?: any }) => (
			<MockedMediaClientProvider mediaStore={mediaStore} mockedMediaApi={mediaApi}>
				{children}
			</MockedMediaClientProvider>
		);
		const { result, waitFor } = renderHook(useFileHashes, {
			wrapper,
			initialProps: [identifier, identifier2],
		});

		await waitFor(() => {
			expect(result.current).toEqual({
				[identifier.id]: 'some-hash',
			});
		});

		await waitFor(() => {
			expect(result.current).toEqual({
				[identifier.id]: 'some-hash',
				[identifier2.id]: 'some-other-hash',
			});
		});
	});

	it('should not return anything for missing file hashes and no clashes', async () => {
		const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
		const [fileItem2, identifier2] = generateSampleFileItem.workingImgWithRemotePreview();

		const fileState = mapMediaItemToFileState(fileItem.id, fileItem.details);
		const fileState2WithoutHash = mapMediaItemToFileState(fileItem2.id, fileItem2.details);

		const mediaStore = createMediaStore({
			files: {
				[identifier.id]: fileState,
				[identifier2.id]: fileState2WithoutHash,
			},
		});

		const { mediaApi } = createMockedMediaApi([fileItem, fileItem2]);

		const wrapper = ({ children }: { children?: any }) => (
			<MockedMediaClientProvider mediaStore={mediaStore} mockedMediaApi={mediaApi}>
				{children}
			</MockedMediaClientProvider>
		);
		const { result, waitFor } = renderHook(useFileHashes, {
			wrapper,
			initialProps: [identifier, identifier2],
		});

		await waitFor(() => {
			expect(result.current).toEqual({});
		});
	});
});
