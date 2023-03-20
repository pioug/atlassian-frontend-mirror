import React from 'react';
import { fireEvent, act, screen } from '@testing-library/react';
import { EmojiProvider } from '@atlaskit/emoji';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import {
  mockReactDomWarningGlobal,
  renderWithIntl,
  useFakeTimers,
} from '../../__tests__/_testing-library';
import { DefaultReactions } from '../../shared/constants';
import { ReactionPicker } from '../ReactionPicker';
import { RENDER_BUTTON_TESTID } from '../EmojiButton';
import { RENDER_REACTIONPICKERPANEL_TESTID } from './ReactionPicker';

describe('@atlaskit/reactions/components/ReactionPicker', () => {
  const renderPicker = (
    onSelection: (emojiId: string) => void = () => {},
    disabled = false,
  ) => {
    return (
      <ReactionPicker
        emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
        onSelection={onSelection}
        allowAllEmojis
        pickerQuickReactionEmojiIds={DefaultReactions}
        disabled={disabled}
      />
    );
  };
  const animStub = window.cancelAnimationFrame;
  const onSelectionSpy = jest.fn();
  mockReactDomWarningGlobal(
    () => {
      window.cancelAnimationFrame = () => {};
    },
    () => {
      window.cancelAnimationFrame = animStub;
    },
  );
  useFakeTimers(() => {
    onSelectionSpy.mockClear();
  });

  it('should render a trigger button', async () => {
    renderWithIntl(renderPicker());
    const triggerPickerButton = await screen.findByLabelText('Add reaction');

    const btn = triggerPickerButton.closest('button');
    expect(btn).toBeInTheDocument();
  });

  it('should render selector options when trigger button is clicked', async () => {
    renderWithIntl(renderPicker());
    const triggerPickerButton = await screen.findByLabelText('Add reaction');

    const btn = triggerPickerButton.closest('button');
    expect(btn).toBeInTheDocument();
    if (btn) {
      fireEvent.click(btn);
    }
    const selectorButtons = await screen.findAllByTestId(RENDER_BUTTON_TESTID);
    expect(selectorButtons).toBeDefined();
    expect(selectorButtons.length).toEqual(DefaultReactions.length);
  });

  it('should call "onSelection" when an emoji is seleted', async () => {
    renderWithIntl(renderPicker(onSelectionSpy));
    const triggerPickerButton = await screen.findByLabelText('Add reaction');
    const btn = triggerPickerButton.closest('button');
    expect(btn).toBeInTheDocument();
    if (btn) {
      fireEvent.click(btn);
    }

    const selectorButtons = await screen.findAllByTestId(RENDER_BUTTON_TESTID);

    const firstEmoji = selectorButtons.at(0);
    expect(firstEmoji).toBeInTheDocument();
    if (firstEmoji) {
      fireEvent.click(firstEmoji);
    }

    // advance the timers by a 500ms to kick off the "setTimeout" delay
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(onSelectionSpy).toHaveBeenCalled();
  });

  it('should disable trigger', async () => {
    renderWithIntl(renderPicker(onSelectionSpy, true));

    const triggerPickerButton = screen
      .getByLabelText('Add reaction')
      .closest('button');
    expect(triggerPickerButton).toBeInTheDocument();
    if (triggerPickerButton) {
      const prop = triggerPickerButton.getAttribute('disabled');
      expect(prop).toBeDefined();
    }
  });

  it('should close emoji picker when `ESC` is pressed', async () => {
    renderWithIntl(renderPicker());

    const triggerPickerButton = await screen.findByLabelText('Add reaction');
    expect(triggerPickerButton).toBeInTheDocument();
    fireEvent.click(triggerPickerButton);

    const emojiPicker = screen.getByTestId(RENDER_REACTIONPICKERPANEL_TESTID);
    fireEvent.keyDown(emojiPicker, { key: 'Escape' });
    expect(emojiPicker).not.toBeInTheDocument();
  });
});
