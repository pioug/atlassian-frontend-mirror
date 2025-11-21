import React, { type SyntheticEvent, useCallback } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import Select from '@atlaskit/select';
import { RadioGroup } from '@atlaskit/radio';
import { exampleOptions } from '../example-helpers';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';
import { type UserSource, type UserSourceResult } from '../src/types';
import { isExternalUser } from '../src/components/utils';
import { token } from '@atlaskit/tokens';

interface Option {
	label: string;
	value: string;
}

const sources: Array<{ label: string; value: UserSource }> = [
	{ value: 'jira', label: 'Jira' },
	{ value: 'confluence', label: 'Confluence' },
	{ value: 'other-atlassian', label: 'Other Atlassian Products' },
	{ value: 'slack', label: 'Slack' },
	{ value: 'microsoft', label: 'Microsoft' },
	{ value: 'google', label: 'Google' },
];

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ExampleContainer = styled.div({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-around',
	width: '320px',
	height: '120px',
	padding: token('space.500', '40px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const InputWrapper = styled.div({
	marginBottom: token('space.250', '20px'),
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Example = (): React.JSX.Element => {
	const [hasAsyncSources, setHasAsyncSources] = React.useState(true);
	const [selectedSources, setSelectedSources] = React.useState<Option[]>(sources);
	const loadUserSource = useCallback(
		async (accountId: string) => {
			const randomFailure = Math.random() < 0.2;
			await sleep(1500);

			if (randomFailure) {
				throw new Error('Random failure');
			} else {
				return selectedSources.map((source, index) => {
					return {
						sourceId: String(index),
						sourceType: source.value as UserSource,
					};
				}) as UserSourceResult[];
			}
		},
		[selectedSources],
	);

	return (
		<ExampleContainer>
			<>
				<h4>Async Sources</h4>
				<InputWrapper>
					<RadioGroup
						options={[
							{
								name: 'true',
								value: 'true',
								label: 'Has Async Sources API',
							},
							{
								name: 'false',
								value: 'false',
								label: 'No Async Sources API',
							},
						]}
						onChange={(e: SyntheticEvent<HTMLInputElement>) => {
							setHasAsyncSources(e.currentTarget.value === 'true');
						}}
						defaultValue={'true'}
					/>
				</InputWrapper>
				<InputWrapper>
					<Select
						options={sources}
						placeholder="Choose external sources"
						onChange={(options) => setSelectedSources(options as Option[])}
						defaultValue={selectedSources}
						isMulti
					/>
				</InputWrapper>
			</>
			<ExampleWrapper>
				{({ onInputChange }) => (
					<UserPicker
						fieldId="example"
						loadUserSource={hasAsyncSources ? loadUserSource : undefined}
						options={exampleOptions.filter((o) => isExternalUser(o) || o.id === '0')}
						onChange={console.log}
						onInputChange={onInputChange}
						noOptionsMessage={() => null}
						isMulti
					/>
				)}
			</ExampleWrapper>
		</ExampleContainer>
	);
};
export default Example;
