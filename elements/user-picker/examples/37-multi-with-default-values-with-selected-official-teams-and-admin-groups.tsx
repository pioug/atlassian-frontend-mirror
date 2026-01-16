import React from 'react';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';
import { type Team, type Group, type OptionData } from '../src/types';

const groupOptionsByType = <T extends { type?: string }>(options: T[]): Record<string, T[]> => {
	return options.reduce(
		(acc, option) => {
			const group = option.type || 'undefined';
			if (!acc[group]) {
				acc[group] = [];
			}
			acc[group].push(option);
			return acc;
		},
		{} as Record<string, T[]>,
	);
};

const Example = (): React.JSX.Element => {
	return (
		<ExampleWrapper>
			{({ options, onInputChange }) => {
				const optionByGroup = groupOptionsByType(options);

				const { team = [], group = [] } = optionByGroup;

				// Select a verified team to display the VerifiedTeamIcon
				const selectedTeam = team.find((t) => (t as Team).verified);

				// Add includeTeamsUpdates flag to the group data to display VerifiedTeamIcon for groups
				const firstGroup = group[0] as Group;
				const selectedGroup = firstGroup
					? { ...firstGroup, includeTeamsUpdates: true }
					: undefined;

				const defaultValues: OptionData[] = [selectedTeam, selectedGroup].filter(
					Boolean,
				) as OptionData[];

				return (
					<UserPicker
						fieldId="example"
						options={team.slice(0, 2).concat(group.slice(0, 2))}
						onChange={console.log}
						onInputChange={onInputChange}
						isMulti
						includeTeamsUpdates
						defaultValue={defaultValues}
						groupByTypeOrder={['team', 'group']}
						autoFocus
					/>
				);
			}}
		</ExampleWrapper>
	);
};

export default Example;