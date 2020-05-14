import createStore from '../../../internal/store';
// @ts-ignore
import { reducers } from '../../../internal/reducers';
import {
  FETCH_CONVERSATIONS_REQUEST,
  FETCH_CONVERSATIONS_SUCCESS,
  CREATE_CONVERSATION_REQUEST,
  CREATE_CONVERSATION_SUCCESS,
  CREATE_CONVERSATION_ERROR,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_ERROR,
  UPDATE_COMMENT_REQUEST,
  UPDATE_COMMENT_SUCCESS,
  UPDATE_COMMENT_ERROR,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_ERROR,
  REVERT_COMMENT,
} from '../../../internal/actions';

import {
  mockInlineConversation as mockInlineConversationClean,
  mockConversation as mockConversationClean,
  mockComment2 as mockComment2Clean,
  mockComment as mockCommentClean,
  mockReplyComment,
} from '../../../../example-helpers/MockData';
import { Dispatch, Store } from 'react-redux';
import { Comment, Conversation } from '../../../model';

describe('Reducers', () => {
  let mockInlineConversation: Conversation;
  let mockConversation: Conversation;
  let mockComment2: Comment;
  let mockComment: Comment;
  let store: Store<any>;
  let dispatch: Dispatch<any>;

  beforeEach(() => {
    mockInlineConversation = mockInlineConversationClean;
    mockConversation = mockConversationClean;
    mockComment2 = mockComment2Clean;
    mockComment = mockCommentClean;

    store = createStore({
      conversations: [mockConversation],
    });
    dispatch = store.dispatch;
  });

  describe('Fetch Conversations', () => {
    beforeEach(() => {
      store = createStore();
      dispatch = store.dispatch;
    });

    it('should return initial state on REQUEST', () => {
      dispatch({
        type: FETCH_CONVERSATIONS_REQUEST,
      });

      expect(store.getState()).toEqual({
        conversations: [],
      });
    });

    it('should add conversations to state on SUCCESS', () => {
      dispatch({
        type: FETCH_CONVERSATIONS_SUCCESS,
        payload: [mockConversation],
      });

      mockConversation.comments![0].nestedDepth = 0;
      mockConversation.comments![1].nestedDepth = 0;

      expect(store.getState()).toEqual({
        conversations: [mockConversation],
      });
    });
  });

  describe('Create Conversation', () => {
    it('should optimistically add a conversation to state on REQUEST', () => {
      store = createStore();
      dispatch = store.dispatch;

      dispatch({
        type: CREATE_CONVERSATION_REQUEST,
        payload: mockConversation,
      });

      if (!mockConversation.comments) {
        throw Error('mockConversation.comments should not be empty');
      }
      const [comment] = mockConversation.comments;

      expect(store.getState()).toEqual({
        conversations: [
          {
            ...mockConversation,
            comments: [
              {
                ...comment,
                state: 'SAVING',
                isPlaceholder: true,
              },
            ],
          },
        ],
      });
    });

    it('should remove SAVING state from comment on SUCCESS', () => {
      dispatch({
        type: CREATE_CONVERSATION_SUCCESS,
        payload: mockConversation,
      });

      expect(store.getState()).toEqual({
        conversations: [mockConversation],
      });
    });

    it('should apply ERROR state to the comment on ERROR', () => {
      const err = new Error('foo');
      dispatch({
        type: CREATE_CONVERSATION_REQUEST,
        payload: mockInlineConversation,
      });

      dispatch({
        type: CREATE_CONVERSATION_ERROR,
        payload: {
          ...mockInlineConversation,
          error: err,
        },
      });

      expect(store.getState()).toEqual({
        conversations: [
          mockConversation,
          {
            ...mockInlineConversation,
            comments: [
              {
                ...mockInlineConversation.comments![0],
                state: 'ERROR',
                error: err,
                isPlaceholder: true,
                oldDocument: mockInlineConversation.comments![0].document,
              },
            ],
          },
        ],
      });
    });
  });

  describe('Add Comment', () => {
    it('should optimistically add a comment to conversation on REQUEST', () => {
      dispatch({
        type: ADD_COMMENT_REQUEST,
        payload: mockComment2,
      });

      const comments = mockConversation.comments || [];

      expect(store.getState()).toEqual({
        conversations: [
          {
            ...mockConversation,
            comments: [
              ...comments,
              {
                ...mockComment2,
                state: 'SAVING',
                isPlaceholder: true,
                nestedDepth: 0,
              },
            ],
          },
        ],
      });
    });

    it('When replying it should assign the right nestedDepth', () => {
      dispatch({
        type: ADD_COMMENT_REQUEST,
        payload: mockReplyComment,
      });

      const comments = mockConversation.comments || [];

      expect(store.getState()).toEqual({
        conversations: [
          {
            ...mockConversation,
            comments: [
              ...comments,
              {
                ...mockReplyComment,
                state: 'SAVING',
                isPlaceholder: true,
                nestedDepth: 1,
              },
            ],
          },
        ],
      });
    });

    it('should cleanup comment state properties on SUCCESS', () => {
      dispatch({
        type: ADD_COMMENT_SUCCESS,
        payload: {
          ...mockComment2,
          localId: undefined, // Will update existing if defined
          nestedDepth: 0,
        },
      });

      const comments = mockConversation.comments || [];

      expect(store.getState()).toEqual({
        conversations: [
          {
            ...mockConversation,
            comments: [
              ...comments,
              {
                ...mockComment2,
                state: undefined,
                oldDocument: undefined,
                isPlaceholder: false,
                localId: undefined,
                nestedDepth: 0,
              },
            ],
          },
        ],
      });
    });

    it('should apply ERROR state to the comment on ERROR', () => {
      dispatch({
        type: ADD_COMMENT_REQUEST,
        payload: mockComment2,
      });

      dispatch({
        type: ADD_COMMENT_ERROR,
        payload: mockComment2,
      });

      const comments = mockConversation.comments || [];

      expect(store.getState()).toEqual({
        conversations: [
          {
            ...mockConversation,
            comments: [
              ...comments,
              {
                ...mockComment2,
                state: 'ERROR',
                oldDocument: mockComment2.document,
                isPlaceholder: true,
                nestedDepth: 0,
              },
            ],
          },
        ],
      });
    });

    it('should not duplicate the comment on RETRY', () => {
      expect(store.getState().conversations[0].comments.length).toEqual(2);

      // First request - pending
      dispatch({
        type: ADD_COMMENT_REQUEST,
        payload: mockComment2,
      });

      expect(store.getState().conversations[0].comments.length).toEqual(3);

      // Retry
      dispatch({
        type: ADD_COMMENT_REQUEST,
        payload: mockComment2,
      });

      expect(store.getState().conversations[0].comments.length).toEqual(3);
    });
  });

  describe('Update Comment', () => {
    it('should optimistically update the comment on REQUEST', () => {
      dispatch({
        type: UPDATE_COMMENT_REQUEST,
        payload: mockComment,
      });

      const [firstComment, ...otherComments] = mockConversation.comments || [];

      expect(store.getState()).toEqual({
        conversations: [
          {
            ...mockConversation,
            comments: [
              {
                ...firstComment,
                state: 'SAVING',
                oldDocument: firstComment.document,
              },
              ...otherComments,
            ],
          },
        ],
      });
    });

    it('should remove SAVING state from comment on SUCCESS', () => {
      dispatch({
        type: UPDATE_COMMENT_SUCCESS,
        payload: mockComment,
      });

      expect(store.getState()).toEqual({
        conversations: [mockConversation],
      });
    });

    it('should apply ERROR state to the comment on ERROR', () => {
      dispatch({
        type: UPDATE_COMMENT_ERROR,
        payload: mockComment,
      });

      const [firstComment, ...otherComments] = mockConversation.comments || [];

      expect(store.getState()).toEqual({
        conversations: [
          {
            ...mockConversation,
            comments: [
              {
                ...firstComment,
                oldDocument: firstComment.document,
                state: 'ERROR',
              },
              ...otherComments,
            ],
          },
        ],
      });
    });
  });

  describe('Delete Comment', () => {
    it('should optimistically update the comment on REQUEST', () => {
      dispatch({
        type: DELETE_COMMENT_REQUEST,
        payload: mockComment,
      });

      const [firstComment, ...otherComments] = mockConversation.comments || [];

      expect(store.getState()).toEqual({
        conversations: [
          {
            ...mockConversation,
            comments: [
              {
                ...firstComment,
                state: 'SAVING',
                oldDocument: firstComment.document,
              },
              ...otherComments,
            ],
          },
        ],
      });
    });

    it('should mark comment as deleted on SUCCESS', () => {
      dispatch({
        type: DELETE_COMMENT_SUCCESS,
        payload: mockComment,
      });

      const [firstComment, ...otherComments] = mockConversation.comments || [];

      expect(store.getState()).toEqual({
        conversations: [
          {
            ...mockConversation,
            comments: [
              {
                ...firstComment,
                deleted: true,
                oldDocument: undefined,
                state: undefined,
              },
              ...otherComments,
            ],
          },
        ],
      });
    });

    it('should apply ERROR state to the comment on ERROR', () => {
      dispatch({
        type: DELETE_COMMENT_ERROR,
        payload: mockComment,
      });

      const [firstComment, ...otherComments] = mockConversation.comments || [];

      expect(store.getState()).toEqual({
        conversations: [
          {
            ...mockConversation,
            comments: [
              {
                ...firstComment,
                oldDocument: firstComment.document,
                state: 'ERROR',
              },
              ...otherComments,
            ],
          },
        ],
      });
    });
  });

  describe('Revert comment', () => {
    it('should restore the comment to its previous state', () => {
      dispatch({
        type: UPDATE_COMMENT_REQUEST,
        payload: {
          ...mockComment,
          document: {
            adf: {
              content: [
                {
                  type: 'text',
                  text: 'foo bar',
                },
              ],
            },
          },
        },
      });

      const state = store.getState();
      const [comment] = state.conversations[0].comments.filter(
        (comment: Comment) => comment.localId === mockComment.localId,
      );
      expect(comment.document.adf.content).toEqual([
        {
          type: 'text',
          text: 'foo bar',
        },
      ]);

      dispatch({
        type: REVERT_COMMENT,
        payload: {
          ...mockComment,
          oldDocument: mockComment.document,
        },
      });

      const newState = store.getState();
      const [revertedComment] = newState.conversations[0].comments.filter(
        (comment: Comment) => comment.localId === mockComment.localId,
      );
      expect(revertedComment.document).toEqual(mockComment.document);
    });

    it('should remove the comment if it is an optimistic placeholder', () => {
      dispatch({
        type: ADD_COMMENT_REQUEST,
        payload: mockComment2,
      });

      dispatch({
        type: REVERT_COMMENT,
        payload: {
          ...mockComment2,
          isPlaceholder: true,
        },
      });

      const state = store.getState();
      const [comment] = state.conversations[0].comments.filter(
        (comment: Comment) => comment.localId === mockComment2.localId,
      );
      expect(comment).toBeUndefined();
    });

    it('should remove the conversation if the removed comment was the only one', () => {
      const dummyComment = {
        ...mockComment2,
        conversationId: mockInlineConversation.conversationId,
      };

      dispatch({
        type: CREATE_CONVERSATION_REQUEST,
        payload: {
          ...mockInlineConversation,
          comments: [dummyComment],
        },
      });

      const state = store.getState();
      expect(state.conversations.length).toEqual(2);

      dispatch({
        type: REVERT_COMMENT,
        payload: {
          ...dummyComment,
          isPlaceholder: true,
        },
      });

      const newState = store.getState();
      expect(newState.conversations.length).toEqual(1);
    });
  });
});
