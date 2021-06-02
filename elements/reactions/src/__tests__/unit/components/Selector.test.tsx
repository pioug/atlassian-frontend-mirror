import { EmojiProvider, OnEmojiEvent } from '@atlaskit/emoji';
import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import {
  mountWithIntl,
  shallowWithIntl,
} from '@atlaskit/editor-test-helpers/enzyme';
import React from 'react';
import { EmojiButton } from '../../../components/EmojiButton';
import {
  defaultReactions,
  isDefaultReaction,
  revealStyle,
  Selector,
} from '../../../components/Selector';

const renderSelector = (
  onSelection: OnEmojiEvent = () => {},
  showMore = false,
  onMoreClick = () => {},
) => {
  return (
    <Selector
      emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
      onSelection={onSelection}
      showMore={showMore}
      onMoreClick={onMoreClick}
    />
  );
};

describe('@atlaskit/reactions/selector', () => {
  beforeEach(function () {
    jest.useFakeTimers();
  });

  afterEach(function () {
    jest.useRealTimers();
  });

  it('should render default reactions', () => {
    const selector = shallowWithIntl(renderSelector());
    const emojis = selector.find(EmojiButton);

    expect(emojis.length).toEqual(defaultReactions.length);

    emojis.forEach((emoji) => {
      expect(isDefaultReaction(emoji.props().emojiId)).toEqual(true);
    });

    expect(selector.find(EditorMoreIcon)).toHaveLength(0);
  });

  it('should call "onSelection" on selection', () => {
    const onSelection = jest.fn();
    const selector = mountWithIntl(renderSelector(onSelection));
    selector.find(EmojiButton).first().simulate('mouseup', { button: 0 });

    jest.runTimersToTime(500);
    expect(onSelection).toHaveBeenCalled();
  });

  it('should call "onMoreClick" when more button is clicked', () => {
    const onSelection = jest.fn();
    const onMoreClick = jest.fn();
    const selector = mountWithIntl(
      renderSelector(onSelection, true, onMoreClick),
    );

    selector.find(`button.${revealStyle}`).first().simulate('mousedown');

    expect(onMoreClick.mock.calls).toHaveLength(1);
  });

  it('should calculate animation delay based on reaction index', () => {
    const selector = mountWithIntl(renderSelector());

    expect(selector.find(`.${revealStyle}`).at(2).prop('style')).toHaveProperty(
      'animationDelay',
      '100ms',
    );
  });
});
