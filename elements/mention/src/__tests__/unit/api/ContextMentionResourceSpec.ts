import ContextMentionResource from '../../../api/ContextMentionResource';
import { MentionProvider } from '../../../api/MentionResource';

describe('ContextMentionResource', () => {
  let mentionProviderMock: MentionProvider;
  let resourceWithContainerIdAndFriends: ContextMentionResource;

  const CONTEXT_IDENTIFIER = {
    containerId: 'someContainerId',
    objectId: 'someObjectId',
  };

  beforeEach(() => {
    mentionProviderMock = {
      filter: jest.fn(),
      recordMentionSelection: jest.fn(),

      shouldHighlightMention: jest.fn(),
      isFiltering: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    };

    resourceWithContainerIdAndFriends = new ContextMentionResource(
      mentionProviderMock,
      CONTEXT_IDENTIFIER,
    );
  });

  describe('MentionProvider', () => {
    it('filter should be called with containerId/objectId', () => {
      resourceWithContainerIdAndFriends.filter('craig');
      expect(mentionProviderMock.filter).toBeCalledWith(
        'craig',
        CONTEXT_IDENTIFIER,
      );
    });

    it('recordMentionSelection should be called with containerId/objectId', () => {
      resourceWithContainerIdAndFriends.recordMentionSelection({ id: '666' });
      expect(mentionProviderMock.recordMentionSelection).toBeCalledWith(
        { id: '666' },
        CONTEXT_IDENTIFIER,
      );
    });

    it('subscribe should ignore containerId/objectId', () => {
      const subscribeCallback = jest.fn();
      resourceWithContainerIdAndFriends.subscribe('boo', subscribeCallback);
      expect(mentionProviderMock.subscribe).toBeCalledWith(
        'boo',
        subscribeCallback,
      );
    });

    it('unsubscribe should ignore containerId/objectId', () => {
      resourceWithContainerIdAndFriends.unsubscribe('boo');
      expect(mentionProviderMock.unsubscribe).toBeCalledWith('boo');
    });
  });
});
