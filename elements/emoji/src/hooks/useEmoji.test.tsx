import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { act, waitFor } from '@testing-library/react';
import type { EmojiResource } from '../api/EmojiResource';
import { EmojiCommonProvider } from '../context/EmojiCommonProvider';
import { useEmoji } from './useEmoji';

describe('useEmoji', () => {
	const ContextWrapper = ({
		children,
		emojiProvider,
	}: React.PropsWithChildren<{
		emojiProvider: EmojiResource;
		children?: React.ReactNode;
	}>) => <EmojiCommonProvider emojiProvider={emojiProvider}>{children}</EmojiCommonProvider>;

	const renderHookWithProvider = async (uploadSupported = false) => {
		const emojiProvider = await getEmojiResource({ uploadSupported });

		return renderHook(() => useEmoji(), {
			wrapper: ContextWrapper,
			initialProps: { emojiProvider },
		});
	};

	describe('throws', () => {
		test('when using hook without emoji context', () => {
			const { result } = renderHook(() => useEmoji());

			expect(result.error?.message).toEqual('useEmoji must be used within EmojiContext');
		});
	});

	test('gives access to provider', async () => {
		const { result } = await renderHookWithProvider();
		expect(result.current.emojiProvider).not.toBeNull();
		expect(result.current.isUploadSupported).toBe(false);
	});

	test('sets upload to false when not enabled', async () => {
		const { result } = await renderHookWithProvider(false);
		expect(result.current.emojiProvider).not.toBeNull();
		expect(result.current.isUploadSupported).toBe(false);
	});

	test('sets upload to true when enabled', async () => {
		await act(async () => {
			const { result } = await renderHookWithProvider(true);
			expect(result.current.emojiProvider).not.toBeNull();
			await waitFor(() => expect(result.current.isUploadSupported).toBe(true));
		});
	});
});
