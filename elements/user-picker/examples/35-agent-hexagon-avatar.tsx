import React from 'react';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';
import { type User } from '../src/types';

const agentUsers: User[] = [
	{
		id: '1',
		name: 'Agent Rovo',
		publicName: 'rovo',
		appType: 'agent',
		avatarUrl: 'https://api.adorable.io/avatars/agent-rovo',
		byline: 'AI Assistant',
		lozenge: 'AGENT',
	},
	{
		id: '2',
		name: 'Agent Smith',
		publicName: 'smith',
		appType: 'agent',
		avatarUrl: 'https://api.adorable.io/avatars/agent-smith',
		byline: 'Task Automation',
		lozenge: 'AGENT',
	},
	{
		id: '3',
		name: 'Regular User',
		publicName: 'user',
		avatarUrl: 'https://api.adorable.io/avatars/regular-user',
		byline: 'Team Member',
	},
	{
		id: '4',
		name: 'Team Name',
		publicName: 'team-name',
		avatarUrl: 'https://api.adorable.io/avatars/team-name',
		byline: 'Team Name',
		appType: 'team',
	},
];

const Example = (): JSX.Element => (
	<ExampleWrapper>
		{({ onInputChange }) => (
			<UserPicker
				fieldId="agent-example"
				options={agentUsers}
				onChange={console.log}
				onInputChange={onInputChange}
				placeholder="Select a user or agent..."
				isMulti
			/>
		)}
	</ExampleWrapper>
);

export default Example;
