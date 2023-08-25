import React, { FC } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { EmojiCommonProvider } from '../context/EmojiCommonProvider';
import { useEmoji } from './useEmoji';
import { EmojiResource } from '../api/EmojiResource';

const ContextWrapper: FC<{ emojiProvider: EmojiResource }> = ({
  children,
  emojiProvider,
}) => (
  <EmojiCommonProvider emojiProvider={emojiProvider}>
    {children}
  </EmojiCommonProvider>
);

const renderdHookWithProvider = async (uploadSupported = false) => {
  const emojiProvider = await getEmojiResource({ uploadSupported });
  return renderHook(() => useEmoji(), {
    wrapper: ContextWrapper,
    initialProps: { emojiProvider },
  });
};

describe('useEmoji', () => {
  describe('throws', () => {
    test('when using hook without emoji context', () => {
      const { result } = renderHook(() => useEmoji());

      expect(result.error?.message).toEqual(
        'useEmoji must be used within EmojiContext',
      );
    });
  });
  test('gives access to provider', async () => {
    const { result } = await renderdHookWithProvider();
    expect(result.current.emojiProvider).not.toBeNull();
    expect(result.current.isUploadSupported).toBeFalsy();
  });
  test('sets upload to false when not enabled', async () => {
    const { result } = await renderdHookWithProvider(false);
    expect(result.current.emojiProvider).not.toBeNull();
    expect(result.current.isUploadSupported).toBeFalsy();
  });
  test('sets upload to true when enabled', async () => {
    await act(async () => {
      const { result } = await renderdHookWithProvider(true);
      expect(result.current.emojiProvider).not.toBeNull();
      expect(result.current.isUploadSupported).toBeFalsy();
    });
  });
});
