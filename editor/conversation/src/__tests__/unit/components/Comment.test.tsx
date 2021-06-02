import AkAvatar from '@atlaskit/avatar';
import AkComment, { CommentAction, CommentAuthor } from '@atlaskit/comment';
import { ConnectedReactionsView } from '@atlaskit/reactions';
import { mount, shallow, ReactWrapper } from 'enzyme';
import React from 'react';
import {
  mockComment,
  mockInlineComment,
  MOCK_USERS,
} from '../../../../example-helpers/MockData';
import { getDataProviderFactory } from '../../../../example-helpers/MockProvider';
import Comment, { DeletedMessage } from '../../../../src/components/Comment';
import Editor from '../../../../src/components/Editor';
import CommentContainer from '../../../../src/containers/Comment';
import { User } from '../../../model';

const findAction = (comment: ReactWrapper, key: string): ReactWrapper =>
  comment
    .first()
    .find(CommentAction)
    .findWhere(
      (item: ReactWrapper) => item.is(CommentAction) && item.key() === key,
    );

// avoid polluting test logs with error message in console
// please ensure you fix it if you expect console.error to be thrown
// eslint-disable-next-line no-console
let consoleError = console.error;
describe('Comment', () => {
  const defaultProps = {
    sendAnalyticsEvent: () => {},
  };

  let comment: any;
  beforeEach(() => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
  });
  afterEach(() => {
    // eslint-disable-next-line no-console
    console.error = consoleError;
  });
  describe('rendering', () => {
    beforeEach(() => {
      comment = shallow(
        <Comment
          {...defaultProps}
          conversationId={mockComment.conversationId}
          comment={mockComment}
        />,
      );
    });

    it('should render as AkComment', () => {
      expect(comment.first().is(AkComment)).toBe(true);
    });

    it('should render author', () => {
      expect(comment.first().props()).toHaveProperty(
        'author',
        <CommentAuthor>{mockComment.createdBy.name}</CommentAuthor>,
      );
    });

    it('should render avatar', () => {
      expect(comment.first().props()).toHaveProperty(
        'avatar',
        <AkAvatar
          src={mockComment.createdBy.avatarUrl}
          name={mockComment.createdBy.name}
        />,
      );
    });

    it('should render editor in reply-mode', () => {
      comment.setState({
        isReplying: true,
      });

      expect(comment.find(Editor).length).toBe(1);
    });

    it('should render child-comments if any', () => {
      const comment = shallow(
        <Comment
          {...defaultProps}
          conversationId={mockComment.conversationId}
          comment={mockComment}
          comments={[mockInlineComment]}
        />,
      );

      expect(comment.first().find(CommentContainer).length).toBe(1);
    });

    it('should render a message for deleted comments', () => {
      const deletedComment = {
        ...mockComment,
        deleted: true,
      };

      const deleted = mount(
        <Comment
          {...defaultProps}
          conversationId={mockComment.conversationId}
          comment={deletedComment}
        />,
      );
      expect(deleted.find(DeletedMessage).length).toBe(1);

      deleted.unmount();
    });
  });

  describe('reply link', () => {
    const [user] = MOCK_USERS;

    it('should render reply link if user is set', () => {
      const comment = mount(
        <Comment
          {...defaultProps}
          conversationId={mockComment.conversationId}
          comment={mockComment}
          user={user}
        />,
      );

      expect(findAction(comment, 'reply').length).toEqual(1);

      comment.unmount();
    });

    it('should not render reply link if user is not set', () => {
      const comment = mount(
        <Comment
          {...defaultProps}
          conversationId={mockComment.conversationId}
          comment={mockComment}
        />,
      );

      expect(findAction(comment, 'reply').length).toEqual(0);

      comment.unmount();
    });
  });

  describe('edit link', () => {
    let user;
    let editLink: ReactWrapper;
    let onUpdateComment: jest.Mock;

    beforeEach(() => {
      user = MOCK_USERS[0];

      onUpdateComment = jest.fn();

      comment = mount(
        <Comment
          {...defaultProps}
          conversationId={mockComment.conversationId}
          comment={mockComment}
          user={user}
          onUpdateComment={onUpdateComment}
        />,
      );

      editLink = findAction(comment, 'edit');
    });

    afterEach(() => {
      comment.unmount();
    });

    it('should be shown for comments by the logged in user only', () => {
      expect(editLink.length).toEqual(1);

      // Mount another component to verify a different user doesn't get the edit button
      const otherUser = MOCK_USERS[1];
      const secondComment = mount(
        <Comment
          {...defaultProps}
          conversationId={mockComment.conversationId}
          comment={mockComment}
          user={otherUser}
        />,
      );

      expect(findAction(secondComment, 'edit').length).toEqual(0);

      secondComment.unmount();
    });

    describe.skip('when clicked', () => {
      let editor: ReactWrapper;

      beforeEach(() => {
        expect(comment.find(Editor).length).toBe(0);
        editLink.simulate('click');
        editor = comment.find(Editor);
      });

      it('should show an editor containing the comment text', () => {
        expect(editor.length).toBe(1);
        expect(editor.first().props()).toHaveProperty(
          'defaultValue',
          mockComment.document.adf,
        );
      });

      describe('and saved', () => {
        let newDoc: object;

        beforeEach(() => {
          newDoc = {
            ...mockComment.document.adf,
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'New content',
                  },
                ],
              },
            ],
          };

          const { onSave } = editor.first().props() as any;
          onSave(newDoc);
          comment.update();
        });

        it('should update the comment', () => {
          expect(onUpdateComment).toBeCalledWith(
            mockComment.conversationId,
            mockComment.commentId,
            newDoc,
          );
        });

        it('should hide the editor', () => {
          expect(comment.first().find(Editor).length).toBe(0);
        });
      });

      describe('and cancelled', () => {
        beforeEach(() => {
          const { onCancel } = editor.first().props() as any;
          onCancel();
          comment.update();
        });

        it('should not update the comment', () => {
          expect(onUpdateComment.mock.calls.length).toBe(0);
        });

        it('should hide the editor', () => {
          expect(comment.first().find(Editor).length).toBe(0);
        });
      });
    });
  });

  describe('delete link', () => {
    let user;
    let deleteLink: ReactWrapper;
    let onDeleteComment: jest.Mock;

    beforeEach(() => {
      user = MOCK_USERS[0];

      onDeleteComment = jest.fn();

      comment = mount(
        <Comment
          {...defaultProps}
          conversationId={mockComment.conversationId}
          comment={mockComment}
          user={user}
          onDeleteComment={onDeleteComment}
        />,
      );

      deleteLink = findAction(comment, 'delete');
    });

    afterEach(() => {
      comment.unmount();
    });

    it('should be shown for comments by the logged in user only', () => {
      expect(deleteLink.length).toEqual(1);

      // Mount another component to verify a different user doesn't get the edit button
      const otherUser = MOCK_USERS[1];
      const secondComment = mount(
        <Comment
          {...defaultProps}
          conversationId={mockComment.conversationId}
          comment={mockComment}
          user={otherUser}
        />,
      );
      expect(findAction(secondComment, 'delete').length).toEqual(0);

      secondComment.unmount();
    });

    it('should be shown for comments when user can moderate them', () => {
      const someUser = MOCK_USERS[2];

      const comment = mount(
        <Comment
          {...defaultProps}
          conversationId={mockComment.conversationId}
          comment={mockComment}
          user={someUser}
          canModerateComment={true}
        />,
      );

      expect(findAction(comment, 'delete').length).toEqual(1);
    });

    it.skip('should delete the comment when clicked', () => {
      deleteLink.simulate('click');
      expect(onDeleteComment).toBeCalledWith(
        mockComment.conversationId,
        mockComment.commentId,
      );
    });
  });

  describe('username link', () => {
    let user: User;
    let usernameLink: ReactWrapper;
    let onUserClick: jest.Mock;

    beforeEach(() => {
      user = MOCK_USERS[0];

      onUserClick = jest.fn();

      comment = mount(
        <Comment
          {...defaultProps}
          conversationId={mockComment.conversationId}
          comment={mockComment}
          user={user}
          onUserClick={onUserClick}
        />,
      );

      usernameLink = comment.first().find(CommentAuthor).first();
    });

    afterEach(() => {
      comment.unmount();
    });

    it('should invoke the onUserClick with the clicked user if specified', () => {
      expect(onUserClick.mock.calls.length).toBe(0);
      usernameLink.simulate('click');
      expect(onUserClick).toHaveBeenCalledWith(user);
    });
  });

  describe('reactions', () => {
    const [user] = MOCK_USERS;

    it('should render reactions-component if dataProvider contains reactionsProvider and emojiProvider', () => {
      const comment = mount(
        <Comment
          {...defaultProps}
          conversationId={mockComment.conversationId}
          objectId="ari:cloud:platform::conversation/demo"
          comment={mockComment}
          dataProviders={getDataProviderFactory()}
          user={user}
        />,
      );

      expect(comment.first().find(ConnectedReactionsView).length).toEqual(1);
      comment.unmount();
    });

    it('should render reactions-component if dataProvider contains emojiProvider', () => {
      const comment = mount(
        <Comment
          {...defaultProps}
          conversationId={mockComment.conversationId}
          objectId="ari:cloud:platform::conversation/demo"
          comment={mockComment}
          dataProviders={getDataProviderFactory()}
          user={user}
        />,
      );

      expect(comment.first().find(ConnectedReactionsView).length).toEqual(1);
      comment.unmount();
    });

    it('should not render reactions-component if emojiProvider is missing', () => {
      const comment = mount(
        <Comment
          {...defaultProps}
          conversationId={mockComment.conversationId}
          objectId="ari:cloud:platform::conversation/demo"
          comment={mockComment}
          dataProviders={getDataProviderFactory(['mentionProvider'])}
          user={user}
        />,
      );

      expect(comment.first().find(ConnectedReactionsView).length).toEqual(0);

      comment.unmount();
    });

    it('should not render reactions-component if objectId is missing', () => {
      const comment = mount(
        <Comment
          {...defaultProps}
          conversationId={mockComment.conversationId}
          comment={mockComment}
          dataProviders={getDataProviderFactory()}
          user={user}
        />,
      );

      expect(comment.first().find(ConnectedReactionsView).length).toEqual(0);

      comment.unmount();
    });

    it('should not render reactions-component if commentAri is missing', () => {
      const comment = mount(
        <Comment
          {...defaultProps}
          conversationId={mockComment.conversationId}
          objectId="ari:cloud:platform::conversation/demo"
          comment={{
            ...mockComment,
            commentAri: undefined,
          }}
          dataProviders={getDataProviderFactory()}
          user={user}
        />,
      );

      expect(comment.first().find(ConnectedReactionsView).length).toEqual(0);

      comment.unmount();
    });

    it('should not render reactions-component if user is missing', () => {
      const comment = mount(
        <Comment
          {...defaultProps}
          conversationId={mockComment.conversationId}
          objectId="ari:cloud:platform::conversation/demo"
          comment={mockComment}
          dataProviders={getDataProviderFactory()}
        />,
      );

      expect(comment.first().find(ConnectedReactionsView).length).toEqual(0);

      comment.unmount();
    });
  });

  describe('more actions', () => {
    const [user] = MOCK_USERS;
    let comment: ReactWrapper;
    afterEach(() => {
      if (comment && comment.length) {
        comment.unmount();
      }
    });

    it('should render additional comment actions when provided', () => {
      comment = mount(
        <Comment
          {...defaultProps}
          conversationId={mockComment.conversationId}
          comment={mockComment}
          user={user}
          renderAdditionalCommentActions={(CommentAction) => [
            <CommentAction key="create-task">Create Task</CommentAction>,
          ]}
        />,
      );

      expect(findAction(comment, 'create-task').length).toEqual(1);
    });

    it('updates component with additional comment actions when they change', () => {
      let actionsResolved = false;
      const renderCommentAction = (CommentAction: any) => {
        return actionsResolved
          ? [<CommentAction key="create-task">Create Task</CommentAction>]
          : [];
      };

      comment = mount(
        <Comment
          {...defaultProps}
          conversationId={mockComment.conversationId}
          comment={mockComment}
          user={user}
          renderAdditionalCommentActions={renderCommentAction}
        />,
      );
      expect(findAction(comment, 'create-task').length).toEqual(0);
      actionsResolved = true;

      // force rerender by re-setting props - comment.update() does not do rerender
      comment.setProps(comment.props());
      expect(findAction(comment, 'create-task').length).toEqual(1);
    });

    it('CS-2155 updates component with additional comment actions when renderEditor prop is passed', () => {
      const renderCommentAction1 = (CommentAction: any) => [
        <CommentAction key="like">Like</CommentAction>,
      ];
      const renderEditor1 = (Editor: any, props: any) => (
        <Editor {...props} saveOnEnter={true} />
      );

      comment = mount(
        <Comment
          {...defaultProps}
          conversationId={mockComment.conversationId}
          comment={mockComment}
          user={user}
          renderEditor={renderEditor1}
          renderAdditionalCommentActions={renderCommentAction1}
        />,
      );
      expect(findAction(comment, 'like').length).toEqual(1);
      expect(findAction(comment, 'unlike').length).toEqual(0);

      const renderCommentAction2 = (CommentAction: any) => [
        <CommentAction key="unlike">Unike</CommentAction>,
      ];
      const renderEditor2 = (Editor: any, props: any) => (
        <Editor {...props} saveOnEnter={true} />
      );

      // set new props and observe re-render
      comment.setProps({
        ...comment.props(),
        renderEditor: renderEditor2,
        renderAdditionalCommentActions: renderCommentAction2,
      });
      expect(findAction(comment, 'like').length).toEqual(0);
      expect(findAction(comment, 'unlike').length).toEqual(1);
    });
  });
});
