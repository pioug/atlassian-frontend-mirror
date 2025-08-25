import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from 'styled-components';
import type { ResourceProvider } from '../src/api/ConversationResource';
import { Conversation } from '../src';
// https://atlassian.slack.com/archives/CNZTJCZ7U/p1634674323008000
// import SingleSelect from '@atlaskit/single-select';
import type { Conversation as ConversationType } from '../src/model/Conversation';
import type { User } from '../src/model/User';
import type { State } from '../src/internal/store';
import { MOCK_USERS } from './MockData';

import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';

const DUMMY_CODE = `
class Main() {
  constructor() {
    ...
  }
}
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Line = styled.div({
	display: 'flex',
	flexDirection: 'row',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const LineNumber = styled.div({
	padding: '2px',
	background: '#dfe1e5',
	flex: '20px 0 0',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > a': {
		color: '#5e6c84',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Code = styled.div({
	background: '#fafbfc',
	margin: 0,
	flex: 'auto',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > pre': {
		padding: '2px',
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ConvoWrapper = styled.div({
	borderTop: '1px solid #c1c7d0',
	borderBottom: '1px solid #c1c7d0',
	padding: '10px',
	background: '#fff',
});

interface FileProps {
	code: string;
	conversations: ConversationType[];
	dataProviders?: ProviderFactory;
	name: string;
	provider: ResourceProvider;
}

const objectId = 'container:abc:abc/1234567';

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class File extends React.Component<FileProps, { addAt?: number }> {
	constructor(props: FileProps) {
		super(props);

		this.state = {};
	}

	private onLineClick = (evt: React.MouseEvent<HTMLAnchorElement>, index: number) => {
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
			conversations && conversations.filter((c) => c.meta && c.meta.lineNumber === index);

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
						{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
						{fg('dst-a11y__replace-anchor-with-link__bitbucket-core') ? (
							// eslint-disable-next-line jsx-a11y/anchor-is-valid
							<Link href="#" onClick={(evt) => this.onLineClick(evt, index)}>
								{index}
							</Link>
						) : (
							// eslint-disable-next-line @atlaskit/design-system/no-html-anchor, jsx-a11y/anchor-is-valid
							<a href="#" onClick={(evt) => this.onLineClick(evt, index)}>
								{index}
							</a>
						)}
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
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ marginTop: '20px' }}>
				{/*  eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
				<strong>{name}</strong>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ border: '1px solid #C1C7D0', borderRadius: '3px' }}>
					{lines.map((line, index) => this.renderLine(line, index))}
				</div>
			</div>
		);
	}
}

type DemoProps = { dataProviders: ProviderFactory; provider: ResourceProvider };
// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class Demo extends React.Component<
	DemoProps,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	{ conversations: any[]; responseCode: number; selectedUser: User }
> {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

	// Ignored via go/ees005
	// eslint-disable-next-line require-await
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
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					borderBottom: '1px solid #ccc',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					paddingBottom: '10px',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
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
		const prConversations = conversations.filter((c) => !Object.keys(c.meta).length);

		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ margin: '20px' }}>
				{/* {this.renderOptions()} */}
				{this.renderConversations(prConversations)}
				{prConversations.length === 0 ? (
					<Conversation provider={provider} dataProviders={dataProviders} objectId={objectId} />
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
					conversations={conversations.filter((c) => c.meta.name === 'stuff.js')}
					dataProviders={dataProviders}
				/>
			</div>
		);
	}
}
