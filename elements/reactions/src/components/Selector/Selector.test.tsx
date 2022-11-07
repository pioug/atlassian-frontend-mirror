import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { matchers } from '@emotion/jest';
import { EmojiProvider, OnEmojiEvent } from '@atlaskit/emoji';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import {
  mockReactDomWarningGlobal,
  renderWithIntl,
  useFakeTimers,
} from '../../__tests__/_testing-library';
import { RENDER_SHOWMORE_TESTID } from '../ShowMore';
import { constants, i18n } from '../../shared';
import { RENDER_SELECTOR_TESTID, Selector } from './Selector';

expect.extend(matchers);

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
  mockReactDomWarningGlobal();
  useFakeTimers();

  it('should render default reactions', async () => {
    renderWithIntl(renderSelector());

    const emojiWrappers = screen.getAllByRole('presentation');
    expect(emojiWrappers.length).toEqual(constants.DefaultReactions.length);

    constants.DefaultReactions.forEach(({ id, shortName }) => {
      const elem = screen.getByLabelText(shortName);
      expect(elem).toBeInTheDocument();
    });
  });

  it('should call "onSelection" on selection', async () => {
    const onSelection = jest.fn();
    renderWithIntl(renderSelector(onSelection));

    const firstButton = await screen.findByLabelText(
      i18n.messages.reactWithEmoji.defaultMessage.replace(
        '{emoji}',
        constants.DefaultReactions[0].shortName,
      ),
    );

    expect(firstButton).toBeInTheDocument();
    fireEvent.click(firstButton);

    jest.runTimersToTime(500); // Skip the animation

    expect(onSelection).toHaveBeenCalled();
  });

  it('should call "onMoreClick" when more button is clicked', async () => {
    const onSelection = jest.fn();
    const onMoreClick = jest.fn();

    renderWithIntl(renderSelector(onSelection, true, onMoreClick));
    const button = await screen.findByTestId(RENDER_SHOWMORE_TESTID);
    expect(button).toBeInTheDocument();
    fireEvent.mouseDown(button);

    expect(onMoreClick.mock.calls).toHaveLength(1);
  });

  it('should calculate animation delay based on reaction index', async () => {
    renderWithIntl(renderSelector());
    const buttons = await screen.findAllByTestId(RENDER_SELECTOR_TESTID);
    expect(buttons.length).toBeGreaterThan(0);

    const btn = buttons[2];
    expect(btn).toHaveStyle('animation-delay: 100ms');
  });
});
