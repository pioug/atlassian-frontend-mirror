import { EmojiPicker, EmojiProvider } from '@atlaskit/emoji';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import React from 'react';
import { EmojiButton } from '../../../components/EmojiButton';
import { ReactionPicker } from '../../../components/ReactionPicker';
import { revealStyle, Selector } from '../../../components/Selector';
import { Trigger } from '../../../components/Trigger';

describe('@atlaskit/reactions/reaction-picker', () => {
  const renderPicker = (
    onSelection: (emojiId: string) => void = () => {},
    disabled = false,
  ) => {
    return (
      <ReactionPicker
        emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
        onSelection={onSelection}
        allowAllEmojis={true}
        disabled={disabled}
      />
    );
  };

  const animStub = window.cancelAnimationFrame;

  beforeEach(function () {
    window.cancelAnimationFrame = () => {};
    jest.useFakeTimers();
  });

  afterEach(function () {
    jest.useRealTimers();
    window.cancelAnimationFrame = animStub;
  });

  it('should render a trigger', () => {
    const picker = mountWithIntl(renderPicker());
    expect(picker.find(Trigger).length).toEqual(1);
  });

  it('should render selector when trigger is clicked', () => {
    const picker = mountWithIntl(renderPicker());
    const trigger = picker.find(Trigger);
    trigger.simulate('click');
    expect(picker.find(Selector).length).toEqual(1);
  });

  it('should render emoji picker when "..." button is clicked', () => {
    const picker = mountWithIntl(renderPicker());
    const trigger = picker.find(Trigger);
    trigger.simulate('click');
    const moreButton = picker.find(`button.${revealStyle}`);
    moreButton.simulate('mousedown', { button: 0 });
    expect(picker.find(EmojiPicker).length).toEqual(1);
  });

  it('should call "onSelection" when an emoji is seleted', () => {
    const onSelectionSpy = jest.fn();
    const picker = mountWithIntl(renderPicker(onSelectionSpy));
    const trigger = picker.find(Trigger);
    trigger.simulate('click');
    const selector = picker.find(Selector);
    selector.find(EmojiButton).first().simulate('mouseup', { button: 0 });

    jest.runTimersToTime(500);
    expect(onSelectionSpy).toHaveBeenCalled();
  });

  it('should disable trigger', () => {
    const onSelectionSpy = jest.fn();
    const picker = mountWithIntl(renderPicker(onSelectionSpy, true));
    expect(picker.find(Trigger).prop('disabled')).toBeTruthy();
  });
});
