import { getConversation, getComments } from '../../../internal/selectors';
import {
  mockConversation,
  mockComment,
  mockReplyComment,
} from '../../../../example-helpers/MockData';

const state = {
  conversations: [mockConversation],
};

describe('Selectors', () => {
  describe('getConversation', () => {
    it('should return conversation by conversationId', () => {
      expect(getConversation(state, 'mock-conversation')).toBe(
        mockConversation,
      );
    });

    it('should return conversation by localId', () => {
      expect(getConversation(state, 'local-conversation')).toBe(
        mockConversation,
      );
    });
  });

  describe('getComments', () => {
    it('should return all comments directly under conversation', () => {
      expect(getComments(state, 'mock-conversation')).toEqual([mockComment]);
    });

    it('should return all comments directly under parentId', () => {
      expect(
        getComments(state, 'mock-conversation', 'mock-comment-1'),
      ).toEqual([mockReplyComment]);
    });
  });
});
