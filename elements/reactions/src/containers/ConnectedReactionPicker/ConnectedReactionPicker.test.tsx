import React from 'react';
import { fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { EmojiProvider } from '@atlaskit/emoji';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { renderWithIntl } from '../../__tests__/_testing-library';
import { StorePropInput } from '../../types';
import { RENDER_BUTTON_TESTID } from '../../components/EmojiButton';
import { ConnectedReactionPicker } from './ConnectedReactionPicker';

describe('@atlaskit/reactions/containers/ConnectedReactionPicker', () => {
  const containerAri = 'container-ari';
  const ari = 'ari';
  let store: StorePropInput;

  beforeEach(() => {
    store = new Promise((resolve) =>
      resolve({
        getReactions: jest.fn(),
        toggleReaction: jest.fn(),
        addReaction: jest.fn(),
        getDetailedReaction: jest.fn(),
        getState: jest.fn(),
        onChange: jest.fn(),
        removeOnChangeListener: jest.fn(),
      }),
    );
  });

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it(`Should call addReaction onSelection`, async () => {
    renderWithIntl(
      <ConnectedReactionPicker
        store={store}
        containerAri={containerAri}
        ari={ari}
        emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
      />,
    );
    const triggerPickerButton = await screen.findByLabelText('Add reaction');

    const btn = triggerPickerButton.closest('button');
    expect(btn).toBeDefined();
    if (btn) {
      fireEvent.click(btn);
    }
    const selectorButtons = await screen.findAllByTestId(RENDER_BUTTON_TESTID);
    const firstEmoji = selectorButtons[0];
    expect(firstEmoji).toBeDefined();
    if (firstEmoji) {
      fireEvent.click(firstEmoji);
    }

    // Fast-forward until all timers have been executed
    jest.runAllTimers();

    const _store = await Promise.resolve(store);
    expect(_store.addReaction).toHaveBeenCalled();
  });
});
