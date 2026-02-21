import { renderHook } from '@testing-library/react';
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
		children?: React.ReactNode;
		emojiProvider: EmojiResource;
	}>) => <EmojiCommonProvider emojiProvider={emojiProvider}>{children}</EmojiCommonProvider>;

	const renderHookWithProvider = async (uploadSupported = false) => {
		const emojiProvider = await getEmojiResource({ uploadSupported });

		const WrapperWithProvider = ({ children }: { children: React.ReactNode }) => (
			<ContextWrapper emojiProvider={emojiProvider}>{children}</ContextWrapper>
		);

		return renderHook(() => useEmoji(), {
			wrapper: WrapperWithProvider,
		});
	};

	describe('throws', () => {
		test('when using hook without emoji context', () => {
			expect(() => renderHook(() => useEmoji())).toThrow(
				'useEmoji must be used within EmojiContext',
			);
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
		const { result } = await renderHookWithProvider(true);
		await act(async () => {
			expect(result.current.emojiProvider).not.toBeNull();
		});
		await waitFor(() => expect(result.current.isUploadSupported).toBe(true));
	});
});
