import { State } from './store';
import { Comment, Conversation, User } from '../model';

export const getConversation = (
  state: State,
  conversationId: string,
): Conversation | undefined =>
  state.conversations.filter(
    (c) => c.conversationId === conversationId || c.localId === conversationId,
  )[0];

export const getComments = (
  state: State,
  conversationId: string,
  parentId?: string,
): Comment[] => {
  const conversation = getConversation(state, conversationId);
  if (conversation) {
    if (parentId) {
      return (conversation.comments || []).filter(
        (c) => c.parentId === parentId,
      );
    }

    return (conversation.comments || [])
      .filter(
        (c) =>
          (!c.parentId && c.conversationId === conversation.conversationId) ||
          (c.parentId && c.parentId === conversation.conversationId),
      )
      .sort((a, b) => {
        if (a.createdAt === b.createdAt) {
          return 0;
        }
        return a.createdAt < b.createdAt ? -1 : 1;
      });
  }
  return [];
};

export const getHighlighted = (state: State): string | undefined =>
  state.highlighted;

export const getUser = (state: State): User | undefined => state.user;
