import React from 'react';
import { exampleOptions } from '../example-helpers';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';
import { isTeam } from '../src/components/utils';
import { type Team } from '../src/types';

const Example = (): React.JSX.Element => {
	// Select a verified team to display the VerifiedTeamIcon
	const verifiedTeam = exampleOptions.find((o) => isTeam(o) && (o as Team).verified);

	return (
		<ExampleWrapper>
			{({ options, onInputChange }) => (
				<UserPicker
					fieldId="example"
					options={options}
					onChange={console.log}
					onInputChange={onInputChange}
					includeTeamsUpdates
					defaultValue={verifiedTeam}
				/>
			)}
		</ExampleWrapper>
	);
};
export default Example;
