import React from 'react';
import { fireEvent } from '@testing-library/react';
import {
  EmojiDescription,
  EmojiProvider,
  OnEmojiEvent,
  toEmojiId,
} from '@atlaskit/emoji';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { getTestEmojiRepository } from '@atlaskit/util-data-test/get-test-emoji-repository';
import {
  mockReactDomWarningGlobal,
  renderWithIntl,
} from '../../__tests__/_testing-library';
import { EmojiButton, RENDER_BUTTON_TESTID } from './EmojiButton';

const emojiRepository = getTestEmojiRepository();

const shortName = ':smiley:';

const smiley: EmojiDescription = emojiRepository.findByShortName(
  shortName,
) as EmojiDescription;
const emojiId = toEmojiId(smiley);

const renderButton = async (onClick: OnEmojiEvent = () => {}) => {
  return renderWithIntl(
    <EmojiButton
      onClick={onClick}
      emojiId={emojiId}
      emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
    />,
  );
};

describe('@atlaskit/reactions/components/EmojiButton', () => {
  mockReactDomWarningGlobal();

  it('should render a button', async () => {
    const renderer = await renderButton();
    const elem = renderer.getByTestId(RENDER_BUTTON_TESTID);
    expect(elem).toBeInTheDocument();
  });

  it('should render an emoji', async () => {
    const renderer = await renderButton();
    const emoji = renderer.getByTestId(`emoji-placeholder-${shortName}`);
    expect(emoji).toBeInTheDocument();
  });

  it('should call "onClick" when clicked', async () => {
    const onClick = jest.fn();
    const renderer = await renderButton(onClick);
    fireEvent.click(renderer.getByTestId(RENDER_BUTTON_TESTID));
    expect(onClick).toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
