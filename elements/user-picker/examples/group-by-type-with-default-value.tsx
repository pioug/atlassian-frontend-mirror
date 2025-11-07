import React from 'react';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';

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

const Example = () => {
	return (
		<ExampleWrapper>
			{({ options, onInputChange }) => {
				const optionByGroup = groupOptionsByType(options);

				const { team = [], group = [] } = optionByGroup;

				return (
					<UserPicker
						fieldId="example"
						options={team.slice(0, 2).concat(group.slice(0, 2))}
						onChange={console.log}
						onInputChange={onInputChange}
						isMulti
						defaultValue={[options[0], options[1]]}
						groupByTypeOrder={['team', 'group']}
						autoFocus
					/>
				);
			}}
		</ExampleWrapper>
	);
};

export default Example;
