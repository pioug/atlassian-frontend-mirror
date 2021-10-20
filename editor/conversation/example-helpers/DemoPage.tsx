import React from 'react';
import styled from 'styled-components';
import { ResourceProvider } from '../src/api/ConversationResource';
import { Conversation } from '../src';
// https://atlassian.slack.com/archives/CNZTJCZ7U/p1634674323008000
// import SingleSelect from '@atlaskit/single-select';
import { Conversation as ConversationType, User } from '../src/model';
import { State } from '../src/internal/store';
import { MOCK_USERS } from './MockData';
import { ProviderFactory } from '@atlaskit/editor-common';

const DUMMY_CODE = `
class Main() {
  constructor() {
    ...
  }
}
`;

const Line = styled.div`
  display: flex;
  flex-direction: row;
`;

const LineNumber = styled.div`
  padding: 2px;
  background: #dfe1e5;
  flex: 20px 0 0;

  & > a {
    color: #5e6c84;
  }
`;

const Code = styled.div`
  background: #fafbfc;
  margin: 0;
  flex: auto;

  & > pre {
    padding: 2px;
  }
`;

const ConvoWrapper = styled.div`
  border-top: 1px solid #c1c7d0;
  border-bottom: 1px solid #c1c7d0;
  padding: 10px;
  background: #fff;
`;

interface FileProps {
  name: string;
  code: string;
  conversations: ConversationType[];
  provider: ResourceProvider;
  dataProviders?: ProviderFactory;
}

const objectId = 'container:abc:abc/1234567';

class File extends React.Component<FileProps, { addAt?: number }> {
  constructor(props: FileProps) {
    super(props);

    this.state = {};
  }

  private onLineClick = (
    evt: React.MouseEvent<HTMLAnchorElement>,
    index: number,
  ) => {
    evt.preventDefault();

    this.setState({
      addAt: index,
    });
  };

  private onCancel = () => {
    this.setState({
      addAt: undefined,
    });
  };

  private renderConvoForLine = (index: number) => {
    const { addAt } = this.state;
    const { conversations, name, provider, dataProviders } = this.props;

    const [conversation] =
      conversations &&
      conversations.filter((c) => c.meta && c.meta.lineNumber === index);

    if (conversation) {
      return (
        <ConvoWrapper>
          <Conversation
            id={conversation.conversationId}
            provider={provider}
            dataProviders={dataProviders}
            isExpanded={false}
            meta={{ name, lineNumber: index }}
            objectId={objectId}
          />
        </ConvoWrapper>
      );
    }

    if (addAt === index) {
      return (
        <ConvoWrapper>
          <Conversation
            onCancel={this.onCancel}
            provider={provider}
            dataProviders={dataProviders}
            isExpanded={true}
            meta={{ name, lineNumber: index }}
            objectId={objectId}
          />
        </ConvoWrapper>
      );
    }

    return null;
  };

  private renderLine = (line: string, index: number) => {
    return (
      <div key={index}>
        <Line key={index}>
          <LineNumber>
            <a href="#" onClick={(evt) => this.onLineClick(evt, index)}>
              {index}
            </a>
          </LineNumber>
          <Code>
            <pre>{line}</pre>
            {this.renderConvoForLine(index)}
          </Code>
        </Line>
      </div>
    );
  };

  render() {
    const { name, code } = this.props;
    const lines = code.split('\n');

    return (
      <div style={{ marginTop: '20px' }}>
        <strong>{name}</strong>
        <div style={{ border: '1px solid #C1C7D0', borderRadius: '3px' }}>
          {lines.map((line, index) => this.renderLine(line, index))}
        </div>
      </div>
    );
  }
}

type DemoProps = { provider: ResourceProvider; dataProviders: ProviderFactory };
export class Demo extends React.Component<
  DemoProps,
  { conversations: any[]; selectedUser: User; responseCode: number }
> {
  private unsubscribe: any;

  constructor(props: DemoProps) {
    super(props);

    this.state = {
      conversations: [],
      selectedUser: MOCK_USERS[0],
      responseCode: 200,
    };
  }

  async componentDidMount() {
    const { provider } = this.props;
    // First get a list of all conversations for this page
    try {
      const conversations = await provider.getConversations(objectId);
      this.setState({ conversations });
      this.unsubscribe = provider.subscribe(this.handleDispatch);
    } catch (err) {
      // Handle error
    }
  }

  async componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleDispatch = (state: State | undefined): void => {
    const { conversations } = state || { conversations: [] };
    this.setState({ conversations });
  };

  // private onUserSelect = (selected: any) => {
  //   const { item } = selected;
  //   const { provider } = this.props;
  //   const userId = item.value;

  //   const [selectedUser] = MOCK_USERS.filter((user) => user.id === userId);

  //   if (userId === undefined) {
  //     provider.updateUser(undefined);
  //   } else {
  //     provider.updateUser(selectedUser);
  //   }

  //   this.setState({
  //     selectedUser,
  //   });
  // };

  // private onResponseCodeSelect = (selected: any) => {
  //   const { item } = selected;
  //   const { provider } = this.props;
  //   const responseCode = item.value;

  //   (provider as any).updateResponseCode(responseCode);

  //   this.setState({
  //     responseCode,
  //   });
  // };

  private renderConversations(conversations: ConversationType[]) {
    const { provider, dataProviders } = this.props;

    return conversations.map((conversation) => (
      <div
        key={conversation.conversationId}
        style={{
          borderBottom: '1px solid #ccc',
          paddingBottom: '10px',
          marginBottom: '10px',
        }}
      >
        <Conversation
          provider={provider}
          dataProviders={dataProviders}
          id={conversation.conversationId}
          objectId={objectId}
        />
      </div>
    ));
  }

  // https://atlassian.slack.com/archives/CNZTJCZ7U/p1634674323008000
  // private renderOptions() {
  //   const { selectedUser, responseCode } = this.state;
  //   const users = {
  //     heading: 'Users',
  //     items: MOCK_USERS.map((user: User) => {
  //       return {
  //         content: user.name,
  //         value: user.id,
  //         label: user.name,
  //         isSelected: selectedUser.id === user.id,
  //       };
  //     }),
  //   };
  //   const success = {
  //     heading: 'Success',
  //     items: [200, 201, 204].map((code: number) => {
  //       return {
  //         content: code,
  //         value: code,
  //         label: String(code),
  //         isSelected: responseCode === code,
  //       };
  //     }),
  //   };
  //   const error = {
  //     heading: 'Error',
  //     items: [400, 403, 404, 500, 503].map((code: number) => {
  //       return {
  //         content: code,
  //         value: code,
  //         label: String(code),
  //         isSelected: responseCode === code,
  //       };
  //     }),
  //   };

  //   return (
  //     <div
  //       style={{
  //         marginBottom: '10px',
  //         paddingBottom: '10px',
  //         borderBottom: '1px solid #ccc',
  //         display: 'flex',
  //       }}
  //     >
  //       <div>
  //         <SingleSelect
  //           label="Change User"
  //           defaultSelected={users.items[0]}
  //           items={[users]}
  //           onSelected={this.onUserSelect}
  //         />
  //       </div>
  //       <div style={{ marginLeft: '30px' }}>
  //         <SingleSelect
  //           label="Provider Response Code"
  //           defaultSelected={success.items[0]}
  //           items={[success, error]}
  //           onSelected={this.onResponseCodeSelect}
  //         />
  //       </div>
  //     </div>
  //   );
  // }

  render() {
    const { conversations } = this.state;
    const { provider, dataProviders } = this.props;
    const prConversations = conversations.filter(
      (c) => !Object.keys(c.meta).length,
    );

    return (
      <div style={{ margin: '20px' }}>
        {/* {this.renderOptions()} */}
        {this.renderConversations(prConversations)}
        {prConversations.length === 0 ? (
          <Conversation
            provider={provider}
            dataProviders={dataProviders}
            objectId={objectId}
          />
        ) : null}
        <File
          name="main.js"
          code={DUMMY_CODE}
          provider={provider}
          conversations={conversations.filter((c) => c.meta.name === 'main.js')}
          dataProviders={dataProviders}
        />
        <File
          name="stuff.js"
          code={DUMMY_CODE}
          provider={provider}
          conversations={conversations.filter(
            (c) => c.meta.name === 'stuff.js',
          )}
          dataProviders={dataProviders}
        />
      </div>
    );
  }
}
