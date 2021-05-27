import { EmojiProvider } from '@atlaskit/emoji';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import ReactionPickerContainer from '../../../containers/ReactionsPickerContainer';
import { ReactionConsumer } from '../../../reaction-store/ReactionConsumer';

describe('ReactionPickerContainer', () => {
  const containerAri = 'container-ari';
  const ari = 'ari';

  const actions = {
    getReactions: jest.fn(),
    toggleReaction: jest.fn(),
    addReaction: jest.fn(),
    getDetailedReaction: jest.fn(),
  };

  let container: ShallowWrapper<ReactionPickerContainer>;
  let actionsMapper: any;

  const store = {
    getReactions: jest.fn(),
    toggleReaction: jest.fn(),
    addReaction: jest.fn(),
    getDetailedReaction: jest.fn(),
    getState: jest.fn(),
    onChange: jest.fn(),
    removeOnChangeListener: jest.fn(),
  };

  beforeAll(() => {
    container = shallow(
      <ReactionPickerContainer
        store={store}
        containerAri={containerAri}
        ari={ari}
        emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
      />,
    );

    const props = container.find(ReactionConsumer).props();
    actionsMapper = props.actionsMapper;
  });

  describe('actions', () => {
    let mappedActions: any;
    beforeAll(() => {
      mappedActions = actionsMapper(actions);
    });

    it('should call addReaction onSelection', () => {
      mappedActions.onSelection('emojiA');

      expect(actions.addReaction).toHaveBeenCalledTimes(1);
      expect(actions.addReaction).toHaveBeenCalledWith(
        containerAri,
        ari,
        'emojiA',
      );
    });
  });

  it('should set store in the consumer', () => {
    expect(container.find(ReactionConsumer).prop('store')).toBe(store);
  });
});
