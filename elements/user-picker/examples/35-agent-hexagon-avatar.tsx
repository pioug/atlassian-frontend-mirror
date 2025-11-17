import React from 'react';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';
import { type User } from '../src/types';
const mockAvatarUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

const agentUsers: User[] = [
	{
		id: '1',
		name: 'Agent Rovo',
		publicName: 'rovo',
		appType: 'agent',
		avatarUrl: mockAvatarUrl,
		byline: 'AI Assistant',
		lozenge: 'AGENT',
	},
	{
		id: '2',
		name: 'Agent Smith',
		publicName: 'smith',
		appType: 'agent',
		avatarUrl: mockAvatarUrl,
		byline: 'Task Automation',
		lozenge: 'AGENT',
	},
	{
		id: '3',
		name: 'Regular User',
		publicName: 'user',
		avatarUrl: mockAvatarUrl,
		byline: 'Team Member',
	},
	{
		id: '4',
		name: 'Team Name',
		publicName: 'team-name',
		avatarUrl: mockAvatarUrl,
		byline: 'Team Name',
		appType: 'team',
	},
];

const Example = (): JSX.Element => (
	<ExampleWrapper>
		{({ onInputChange, onSelection }) => (
			<UserPicker
				fieldId="agent-example"
				options={agentUsers}
				defaultValue={agentUsers[0]}
				onChange={console.log}
				onInputChange={onInputChange}
				onSelection={onSelection}
				placeholder="Select a user or agent..."
				autoFocus
			/>
		)}
	</ExampleWrapper>
);

export default Example;
