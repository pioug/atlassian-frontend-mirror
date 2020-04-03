import { ProviderFactory } from '@atlaskit/editor-common';
import { MemoryReactionsStore } from '@atlaskit/reactions';
import { MockReactionsClient } from '@atlaskit/reactions/src/client/MockReactionsClient';
import { emoji, mention } from '@atlaskit/util-data-test';
import {
  AbstractConversationResource,
  ConversationResourceConfig,
} from '../src/api/ConversationResource';
import { HttpError } from '../src/api/HttpError';
import {
  ADD_COMMENT_ERROR,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  CREATE_CONVERSATION_ERROR,
  CREATE_CONVERSATION_REQUEST,
  CREATE_CONVERSATION_SUCCESS,
  DELETE_COMMENT_ERROR,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
  FETCH_CONVERSATIONS_REQUEST,
  FETCH_CONVERSATIONS_SUCCESS,
  REVERT_COMMENT,
  UPDATE_COMMENT_ERROR,
  UPDATE_COMMENT_REQUEST,
  UPDATE_COMMENT_SUCCESS,
  UPDATE_USER_SUCCESS,
} from '../src/internal/actions';
import { uuid } from '../src/internal/uuid';
import { Comment, Conversation, User } from '../src/model';
import {
  generateMockConversation,
  mockInlineConversation,
  mockMediaConversation,
} from './MockData';

const MockDataProviders = {
  mentionProvider: Promise.resolve(mention.storyData.resourceProvider),
  emojiProvider: Promise.resolve(
    emoji.storyData.getEmojiResource({ uploadSupported: true }),
  ),
  reactionsStore: Promise.resolve(
    new MemoryReactionsStore(new MockReactionsClient()),
  ),
};

const RESPONSE_MESSAGES = {
  200: 'OK',
  201: 'OK',
  204: 'No Content',

  400: 'Bad Request',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Server error',
  503: 'Service Unavailable',
};

export const getDataProviderFactory = (onlyInclude: string[] = []) => {
  const dataProviderFactory = new ProviderFactory();
  (Object.keys(MockDataProviders) as Array<
    keyof typeof MockDataProviders
  >).forEach(provider => {
    if (onlyInclude.length === 0 || onlyInclude.indexOf(provider) !== -1) {
      dataProviderFactory.setProvider(provider, MockDataProviders[provider]);
    }
  });
  return dataProviderFactory;
};

export class MockProvider extends AbstractConversationResource {
  private config: ConversationResourceConfig;
  private responseCode: keyof typeof RESPONSE_MESSAGES;

  constructor(config: ConversationResourceConfig) {
    super();
    this.config = config;
    //@ts-ignore
    this.updateUser(config.user);
    this.responseCode = 200;
  }

  /**
   * Retrieve the IDs (and meta-data) for all conversations associated with the object ID.
   */
  async getConversations(): Promise<Conversation[]> {
    const { dispatch } = this;
    dispatch({ type: FETCH_CONVERSATIONS_REQUEST });

    const values = [
      generateMockConversation(),
      mockInlineConversation,
      mockMediaConversation,
    ];
    dispatch({ type: FETCH_CONVERSATIONS_SUCCESS, payload: values });

    return values;
  }

  /**
   * Creates a new Conversation and associates it with the objectId provided.
   */
  async create(
    localId: string,
    value: any,
    meta: any,
    objectId: string,
    containerId?: string,
  ): Promise<Conversation> {
    const conversationId = <string>uuid.generate();

    const result = {
      conversationId,
      objectId,
      containerId,
      localId,
      comments: [this.createComment(conversationId, conversationId, value)],
      meta: meta,
    };

    const { dispatch, responseCode } = this;

    dispatch({ type: CREATE_CONVERSATION_REQUEST, payload: result });

    window.setTimeout(() => {
      const errResult = {
        ...result,
        error: new HttpError(responseCode, RESPONSE_MESSAGES[responseCode]),
      };
      const type =
        responseCode >= 400
          ? CREATE_CONVERSATION_ERROR
          : CREATE_CONVERSATION_SUCCESS;
      const payload = responseCode >= 400 ? errResult : result;
      dispatch({ type, payload });
    }, 1000);

    return result;
  }

  /**
   * Adds a comment to a parent, or update if existing. ParentId can be either a conversation or another comment.
   */
  async addComment(
    conversationId: string,
    parentId: string,
    doc: any,
    localId?: string,
  ): Promise<Comment> {
    const result = localId
      ? { conversationId, localId }
      : this.createComment(conversationId, parentId, doc);
    const { dispatch, responseCode } = this;

    dispatch({ type: ADD_COMMENT_REQUEST, payload: result });

    await new Promise(resolve => {
      window.setTimeout(() => {
        const errResult = {
          ...result,
          error: new HttpError(responseCode, RESPONSE_MESSAGES[responseCode]),
        };
        const type =
          responseCode >= 400 ? ADD_COMMENT_ERROR : ADD_COMMENT_SUCCESS;
        const payload = responseCode >= 400 ? errResult : result;
        dispatch({ type, payload });
        resolve();
      }, 1000);
    });

    return result as Comment;
  }

  private createComment(
    conversationId: string,
    parentId: string,
    doc: any,
    localId: string = <string>uuid.generate(),
  ): Comment {
    return {
      commentAri: `abc:cloud:platform::comment/${localId}`,
      createdBy: this.config.user!,
      createdAt: Date.now(),
      commentId: <string>uuid.generate(),
      document: {
        adf: doc,
      },
      conversationId,
      parentId,
      comments: [],
      localId,
    };
  }

  /**
   * Updates a comment based on ID. Returns updated content
   */
  async updateComment(
    conversationId: string,
    commentId: string,
    document: any,
  ): Promise<Comment> {
    const result = {
      createdBy: this.config.user,
      createdAt: Date.now(),
      document: {
        adf: document,
      },
      conversationId,
      commentId,
      comments: [],
    };

    const { dispatch, responseCode } = this;
    dispatch({ type: UPDATE_COMMENT_REQUEST, payload: result });

    window.setTimeout(() => {
      const errResult = {
        conversationId,
        commentId,
        error: new HttpError(responseCode, RESPONSE_MESSAGES[responseCode]),
      };

      const type =
        responseCode >= 400 ? UPDATE_COMMENT_ERROR : UPDATE_COMMENT_SUCCESS;
      const payload = responseCode >= 400 ? errResult : result;
      dispatch({ type, payload });
    }, 500);

    //@ts-ignore
    return result;
  }

  /**
   * Deletes a comment based on ID. Returns deleted comment
   * @param {string} conversationId
   * @param {string} commentId
   * @returns {Promise<Comment>}
   */
  async deleteComment(
    conversationId: string,
    commentId: string,
  ): Promise<Pick<Comment, 'conversationId' | 'commentId' | 'error'>> {
    const { dispatch, responseCode } = this;
    const result = {
      conversationId,
      commentId,
      error: new HttpError(responseCode, RESPONSE_MESSAGES[responseCode]),
    };
    dispatch({ type: DELETE_COMMENT_REQUEST, payload: result });

    window.setTimeout(() => {
      const type =
        responseCode >= 400 ? DELETE_COMMENT_ERROR : DELETE_COMMENT_SUCCESS;
      dispatch({ type, payload: result });
    }, 500);

    return result;
  }

  /**
   * Reverts a comment based on ID. Returns updated comment.
   */
  async revertComment(
    conversationId: string,
    commentId: string,
  ): Promise<Pick<Comment, 'conversationId' | 'commentId'>> {
    const { dispatch } = this;
    const comment = { conversationId, commentId };

    dispatch({ type: REVERT_COMMENT, payload: comment });

    return comment;
  }

  /**
   * Updates a user in the store. Returns updated user
   */
  async updateUser(user: User): Promise<User> {
    const { dispatch } = this;
    dispatch({ type: UPDATE_USER_SUCCESS, payload: { user } });
    this.config.user = user;

    return user;
  }

  updateResponseCode = (code: keyof typeof RESPONSE_MESSAGES): void => {
    this.responseCode = code;
  };
}
