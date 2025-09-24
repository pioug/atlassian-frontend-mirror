import React, { useState } from 'react';

import { cssMap } from '@atlaskit/css';
import InlineEdit from '@atlaskit/inline-edit';
import { Box } from '@atlaskit/primitives/compiled';
import Select, { type ValueType } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import ProfileCardClient from '../src/client/ProfileCardClient';
import TeamProfileCardClient from '../src/client/TeamProfileCardClient';
import TeamProfilecardTrigger from '../src/components/Team';
import teamData from '../src/mocks/team-data';
import { type Team } from '../src/types';

import { Radios, TeamCustomizer } from './helper/customization';
import ExampleWrapper from './helper/example-wrapper';

const styles = cssMap({
	container: {
		borderColor: token('color.border'),
		borderRadius: token('radius.small', '3px'),
		marginTop: token('space.100', '8px'),
		marginRight: token('space.100', '8px'),
		marginBottom: token('space.100', '8px'),
		marginLeft: token('space.100', '8px'),
		paddingTop: token('space.100', '8px'),
		paddingRight: token('space.100', '8px'),
		paddingBottom: token('space.100', '8px'),
		paddingLeft: token('space.100', '8px'),
	},
	editViewContainer: {
		zIndex: 300,
		position: 'relative',
	},
});

const EditViewContainer = ({ children }: { children: React.ReactNode }) => {
	return <Box xcss={styles.editViewContainer}>{children}</Box>;
};

const Container = ({ children }: { children: React.ReactNode }) => {
	return <Box xcss={styles.container}>{children}</Box>;
};

const teams: Record<string, { displayName: string; largeHeaderImageUrl: string }> = {
	'Air-Guitar': {
		displayName: 'Air-Guitar',
		largeHeaderImageUrl:
			'https://teams-directory-frontend.stg-east.frontend.public.atl-paas.net/assets/gradients/1.svg',
	},
	Bongos: {
		displayName: 'Bongos',
		largeHeaderImageUrl:
			'https://teams-directory-frontend.stg-east.frontend.public.atl-paas.net/assets/gradients/2.svg',
	},
	Clappers: {
		displayName: 'Clappers',
		largeHeaderImageUrl:
			'https://teams-directory-frontend.stg-east.frontend.public.atl-paas.net/assets/gradients/4.svg',
	},
};

const baseTeam: { team: Team } = {
	team: teamData({}),
};

const actions = [
	{
		label: 'Secondary',
		callback: () => { },
		link: 'about:blank',
	},
	{
		label: 'Option with callback',
		callback: () => alert('First option clicked'),
	},
	{
		label: 'Option with link',
		link: 'about:blank',
	},
	{
		label: 'Option with both',
		callback: () => alert('Third option clicked'),
		link: 'about:blank',
	},
];

interface OptionType {
	label: string;
	value: string;
}

const selectOptions: OptionType[] = [
	{ label: 'Air-Guitar', value: 'Air-Guitar' },
	{ label: 'Bongos', value: 'Bongos' },
	{ label: 'Clappers', value: 'Clappers' },
];

class MockTeamClient extends TeamProfileCardClient {
	makeRequest(teamId: string): Promise<Team> {
		const team: Team = {
			...baseTeam.team,
			...(teams[teamId] || {}),
		};
		return Promise.resolve(team);
	}
}

const args = {
	cacheSize: 10,
	maxCacheAge: 0,
	url: 'DUMMY',
	cloudId: 'site-id',
};

const profileClient = new ProfileCardClient(args, {
	teamClient: new MockTeamClient(args),
});

function MiniEditor(props: {
	label: string;
	trigger: 'click' | 'hover' | 'hover-click';
	numActions: number;
}) {
	const [value, setValue] = useState<OptionType>(selectOptions[0]);

	const onConfirm = (value: ValueType<OptionType>) => {
		if (!value) {
			return;
		}

		setValue(value as OptionType);
	};

	return (
		<ExampleWrapper>
			<InlineEdit<ValueType<OptionType>>
				defaultValue={value}
				label={props.label}
				editView={(fieldProps) => (
					<EditViewContainer>
						<Select<OptionType> {...fieldProps} options={selectOptions} autoFocus openMenuOnClick />
					</EditViewContainer>
				)}
				readView={() => (
					<div
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							padding: token('space.100', '8px'),
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							width: '300px',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							display: 'inline-block',
						}}
					>
						<TeamProfilecardTrigger
							orgId="DUMMY"
							resourceClient={profileClient}
							teamId={value.value}
							viewProfileLink="about:blank"
							trigger={props.trigger}
							actions={actions.slice(0, props.numActions)}
						>
							<strong
								style={{
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
									color: token('color.text', 'black'),
								}}
							>
								{value.label}
							</strong>
						</TeamProfilecardTrigger>
					</div>
				)}
				onConfirm={onConfirm}
			/>
		</ExampleWrapper>
	);
}

export default function InlineEditExample() {
	const [numActions, setNumActions] = useState(0);

	return (
		<div
			style={{
				padding: `${token('space.100', '8px')} ${token(
					'space.100',
					'8px',
				)} ${token('space.600', '48px')}`,
			}}
		>
			<input value="Sample" type="text" />
			<button>Purely demo purposes</button>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ width: '600px' }}>
				<Container>
					<p>
						Hover only is fine for mouse users. Screen reader users trying to interact with the
						trigger get taken to the link.
					</p>
					<p>Generally not the recommended type of trigger.</p>
					<MiniEditor numActions={numActions} label="Assigned team (hover only)" trigger="hover" />
				</Container>
				<Container>
					<p>
						Click only doesn't work <i>here</i> for mouse users as clicking opens the inline edit.
						Pressing enter works well for screen reader users.
					</p>
					<p>Generally preferred if clicking to interact works for your use case.</p>
					<MiniEditor numActions={numActions} label="Assigned team (click only)" trigger="click" />
				</Container>
				<Container>
					<p>
						Hover works well here for mouse users. Screen reader users can also interact with the
						trigger to open the profile card.
					</p>
					<p>Ideal if mouse users are not able to click to open the profile card.</p>
					<MiniEditor
						numActions={numActions}
						label="Assigned team (click + hover)"
						trigger="hover-click"
					/>
				</Container>
				<Container>
					<TeamCustomizer
						setTeam={(team) => {
							baseTeam.team = team;
						}}
					/>
					Extra actions
					<Radios
						label="actions"
						options={[0, 1, 2, 3, 4]}
						setter={(value) => {
							setNumActions(value);
						}}
						currentValue={numActions}
					/>
				</Container>
			</div>
		</div>
	);
}
