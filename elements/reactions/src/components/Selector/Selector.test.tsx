import React from 'react';
import { EmojiProvider, OnEmojiEvent } from '@atlaskit/emoji';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { render } from '@testing-library/react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { EmojiButton } from '../EmojiButton';
import { RENDER_SHOWMORE_TESTID } from '../ShowMore';
import { constants } from '../../shared';
import { RENDER_SELECTOR_TESTID, Selector } from './Selector';

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

describe('@atlaskit/reactions/components/selector', () => {
  beforeEach(function () {
    jest.useFakeTimers();
  });

  afterEach(function () {
    jest.useRealTimers();
  });

  it('should render default reactions', async () => {
    const renderer = render(renderSelector());
    const emojiWrappers = renderer.getAllByRole('presentation');
    expect(emojiWrappers.length).toEqual(constants.DefaultReactions.length);

    constants.DefaultReactions.forEach(({ id, shortName }) => {
      const elem = renderer.getByLabelText(shortName);
      expect(elem).toBeInTheDocument();
    });
  });

  it('should call "onSelection" on selection', () => {
    const onSelection = jest.fn();
    const selector = mountWithIntl(renderSelector(onSelection));
    selector.find(EmojiButton).first().props().onClick();

    jest.runTimersToTime(500);
    expect(onSelection).toHaveBeenCalled();
  });

  it('should call "onMoreClick" when more button is clicked', () => {
    const onSelection = jest.fn();
    const onMoreClick = jest.fn();
    const selector = mountWithIntl(
      renderSelector(onSelection, true, onMoreClick),
    );

    selector
      .find(`button[data-testid="${RENDER_SHOWMORE_TESTID}"]`)
      .simulate('mousedown');

    expect(onMoreClick.mock.calls).toHaveLength(1);
  });

  it('should calculate animation delay based on reaction index', () => {
    const selector = mountWithIntl(renderSelector());

    expect(
      selector
        .find(`div[data-testid="${RENDER_SELECTOR_TESTID}"]`)
        .at(2)
        .prop('style'),
    ).toHaveProperty('animationDelay', '100ms');
  });
});
