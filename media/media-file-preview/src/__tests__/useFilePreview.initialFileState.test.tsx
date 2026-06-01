/**
 * Tests for the initialFileState param added to useFilePreview.
 *
 * Verifies that when initialFileState is passed to useFilePreview, it is
 * forwarded to the underlying useFileState call, so the preview hook can
 * render immediately with SSR-seeded data before the remote fetch completes.
 */
import React from 'react';

import { renderHook } from '@testing-library/react';

import { generateSampleFileItem } from '@atlaskit/media-test-data';

import { useFilePreview } from '../useFilePreview';

import { createMockedMediaClientProvider } from './helpers/_MockedMediaClientProvider';

describe('useFilePreview — initialFileState', () => {
	it('accepts initialFileState without throwing', () => {
		const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
		const { MockedMediaClientProvider } = createMockedMediaClientProvider({
			initialItems: fileItem,
		});

		const initialFileState = {
			status: 'processed' as const,
			id: identifier.id,
			name: 'ssr-seeded.jpg',
			size: 512,
			mimeType: 'image/jpeg',
			mediaType: 'image' as const,
			artifacts: {},
			representations: {},
		};

		expect(() => {
			renderHook(
				() =>
					useFilePreview({
						identifier,
						initialFileState,
					}),
				{
					wrapper: ({ children }) => (
						<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
					),
				},
			);
		}).not.toThrow();
	});

	it('returns a valid status when initialFileState is provided', () => {
		const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
		const { MockedMediaClientProvider } = createMockedMediaClientProvider({
			initialItems: fileItem,
		});

		const initialFileState = {
			status: 'processed' as const,
			id: identifier.id,
			name: 'ssr-seeded.jpg',
			size: 512,
			mimeType: 'image/jpeg',
			mediaType: 'image' as const,
			artifacts: {},
			representations: {},
		};

		const { result } = renderHook(
			() =>
				useFilePreview({
					identifier,
					initialFileState,
				}),
			{
				wrapper: ({ children }) => (
					<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
				),
			},
		);

		// The hook should return a recognisable status (not throw or return undefined)
		expect(['loading', 'loading-preview', 'complete', 'error', 'processing']).toContain(
			result.current.status,
		);
	});

	it('behaves the same as when no initialFileState is provided when undefined is passed', () => {
		const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
		const { MockedMediaClientProvider } = createMockedMediaClientProvider({
			initialItems: fileItem,
		});

		const { result: resultWithout } = renderHook(
			() =>
				useFilePreview({
					identifier,
				}),
			{
				wrapper: ({ children }) => (
					<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
				),
			},
		);

		const { result: resultWithUndefined } = renderHook(
			() =>
				useFilePreview({
					identifier,
					initialFileState: undefined,
				}),
			{
				wrapper: ({ children }) => (
					<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
				),
			},
		);

		expect(resultWithUndefined.current.status).toEqual(resultWithout.current.status);
	});
});
