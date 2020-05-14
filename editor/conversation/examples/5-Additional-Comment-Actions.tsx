import React from 'react';
import { MOCK_USERS } from '../example-helpers/MockData';
import {
  getDataProviderFactory,
  MockProvider as ConversationResource,
} from '../example-helpers/MockProvider';
import { Conversation } from '../src';

const provider = new ConversationResource({
  url: 'http://mockservice/',
  user: MOCK_USERS[3],
});
type State = { conversationId?: string; likes: { [key: string]: boolean } };
export default class AdditionalCommentActions extends React.Component<
  {},
  State
> {
  state: State = {
    conversationId: undefined,
    likes: {},
  };

  async componentDidMount() {
    const [conversation] = await provider.getConversations();

    this.setState({
      conversationId: conversation.conversationId,
    });
  }

  render() {
    const { conversationId } = this.state;
    if (!conversationId) {
      return null;
    }

    return (
      <Conversation
        id={conversationId}
        objectId="ari:cloud:platform::conversation/demo"
        provider={provider}
        dataProviders={getDataProviderFactory()}
        renderEditor={(Editor: any, props: any) => (
          <Editor {...props} saveOnEnter={true} />
        )}
        renderAdditionalCommentActions={(CommentAction, comment) => [
          <CommentAction
            key="like-action"
            onClick={() => {
              const likes = { ...this.state.likes };
              likes[comment.commentId] = !likes[comment.commentId];
              this.setState({
                likes,
              });
            }}
          >
            {this.state.likes[comment.commentId] ? 'Unlike' : 'Like'}
          </CommentAction>,
        ]}
      />
    );
  }
}
