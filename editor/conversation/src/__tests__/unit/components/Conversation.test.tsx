import React from 'react';
import { shallow } from 'enzyme';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  mockConversation,
  MOCK_USERS,
} from '../../../../example-helpers/MockData';
import Conversation from '../../../components/Conversation';
import Editor from '../../../components/Editor';
import CommentContainer from '../../../containers/Comment';

const objectId = 'ari:cloud:platform::conversation/demo';
const { comments } = mockConversation;
const [user] = MOCK_USERS;

describe('Conversation', () => {
  const createAnalyticsEvent: CreateUIAnalyticsEvent = jest
    .fn()
    .mockReturnValue({
      update: () => {},
      fire() {},
      attributes: { foo: 'bar' },
    });
  const defaultProps = {
    createAnalyticsEvent,
    sendAnalyticsEvent: () => {},
  };

  const conversation = shallow(
    <Conversation
      {...defaultProps}
      objectId={objectId}
      conversation={mockConversation}
      comments={comments}
      user={user}
    />,
  );

  describe('comments', () => {
    it('should render comments if any', () => {
      // @ts-ignore
      expect(conversation.find(CommentContainer).length).toBe(comments.length);
    });
  });

  describe('editor', () => {
    it('should render if meta is not set', () => {
      expect(conversation.find(Editor).length).toBe(1);
    });

    it('should not render if meta is set', () => {
      const conversation = shallow(
        <Conversation
          {...defaultProps}
          objectId={objectId}
          meta={{ test: 'testing' }}
          user={user}
        />,
      );
      expect(conversation.find(Editor).length).toBe(0);
    });

    it('should render if isExpanded is true', () => {
      const conversation = shallow(
        <Conversation
          {...defaultProps}
          objectId={objectId}
          meta={{ test: 'testing' }}
          isExpanded={true}
          user={user}
        />,
      );
      expect(conversation.find(Editor).length).toBe(1);
    });

    describe('no user', () => {
      it('should not render if meta is not set', () => {
        const conversation = shallow(
          <Conversation {...defaultProps} objectId={objectId} />,
        );
        expect(conversation.find(Editor).length).toBe(0);
      });

      it('should not render if meta is set', () => {
        const conversation = shallow(
          <Conversation
            {...defaultProps}
            objectId={objectId}
            meta={{ test: 'testing' }}
          />,
        );
        expect(conversation.find(Editor).length).toBe(0);
      });

      it('should not render if isExpanded is true', () => {
        const conversation = shallow(
          <Conversation
            {...defaultProps}
            objectId={objectId}
            meta={{ test: 'testing' }}
            isExpanded={true}
          />,
        );
        expect(conversation.find(Editor).length).toBe(0);
      });
    });
  });
});
