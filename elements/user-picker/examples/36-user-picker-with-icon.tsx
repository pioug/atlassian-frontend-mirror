import React from 'react';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';
import { type User } from '../src/types';
import EmailIcon from '@atlaskit/icon/core/email';
import StatusErrorIcon from '@atlaskit/icon/core/status-error';
import { token } from '@atlaskit/tokens';
import { R400 } from '@atlaskit/theme/colors';

const agentUsers: User[] = [
	{
		id: '1',
		name: 'Tom Adams',
		appType: 'person',
		icon: <EmailIcon label="Email" />,
		byline: 'Add new user',
	},
	{
		id: '4',
		name: 'Team user',
		icon: <StatusErrorIcon label="Status Error" />,
		byline: 'Enter a valid email',
		appType: 'team',
		iconColor: token('color.icon.danger', R400),
	},
];
const Example = (): React.JSX.Element => {
	return (
		<ExampleWrapper>
			{({ options, onInputChange, onSelection }) => (
				<UserPicker
					fieldId="example"
					options={[...agentUsers, ...options]}
					onChange={console.log}
					onInputChange={onInputChange}
					onSelection={onSelection}
					autoFocus
				/>
			)}
		</ExampleWrapper>
	);
};
export default Example;
