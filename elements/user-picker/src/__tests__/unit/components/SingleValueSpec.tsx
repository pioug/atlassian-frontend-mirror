import { shallow } from 'enzyme';
import { render, screen } from '@testing-library/react';
import noop from 'lodash/noop';
import React from 'react';
import { type Props } from '../../../components/SingleValue';
import { SingleValue } from '../../../components/SingleValue';
import { SizeableAvatar } from '../../../components/SizeableAvatar';
import { type Team } from '../../../types';
import { type Props as SizeableAvatarProps } from '../../../components/SizeableAvatar';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { fg } from '@atlaskit/platform-feature-flags';
import { getAppearanceForAppType } from '@atlaskit/avatar';

const data = {
	label: 'Jace Beleren',
	value: 'abc-123',
	data: {
		id: 'abc-123',
		name: 'Jace Beleren',
		publicName: 'jbeleren',
		avatarUrl: 'http://avatars.atlassian.com/jace.png',
		byline: 'teammate',
	},
};

const selectProps = {
	appearance: 'normal',
};

const defaultSingleValueProps = {
	children: null,
	hasValue: false,
	isMulti: false,
	isRtl: false,
	innerProps: noop as Props['innerProps'],
	getStyles: noop as Props['getStyles'],
	getClassNames: noop as Props['getClassNames'],
	setValue: noop,
	isDisabled: false,
	clearValue: noop,
	cx: noop as Props['cx'],
	getValue: noop as Props['getValue'],
	options: [],
	selectOption: noop,
	data: data as Props['data'],
	selectProps: selectProps as unknown as Props['selectProps'],
};

jest.mock('../../../components/SizeableAvatar', () => ({
	SizeableAvatar: (props: SizeableAvatarProps) => (
		<div>SizeableAvatar - {JSON.stringify(props)}</div>
	),
}));

jest.mock('@atlaskit/people-teams-ui-public/verified-team-icon', () => ({
	VerifiedTeamIcon: () => <div>VerifiedTeamIcon</div>,
}));

/**
 * ffTest.on is causing some issues, given the mock is only temporary I'm just manually mocking the fg function
 */
jest.mock('@atlaskit/platform-feature-flags', () => ({
	...jest.requireActual('@atlaskit/platform-feature-flags'),
	fg: jest.fn(),
}));

jest.mock('@atlaskit/avatar', () => ({
	...jest.requireActual('@atlaskit/avatar'),
	getAppearanceForAppType: jest.fn(),
}));

describe('SingleValue', () => {
	const shallowSingleValue = (props = {}) =>
		shallow(<SingleValue {...defaultSingleValueProps} {...props} />);

	it('should render SingleValue', () => {
		const component = shallowSingleValue();
		expect(component.find(SizeableAvatar).props()).toMatchObject({
			src: 'http://avatars.atlassian.com/jace.png',
			appearance: 'normal',
		});
	});

	it('should render SizeableAvatar when the appearance is compact', () => {
		const component = shallowSingleValue({
			selectProps: {
				appearance: 'compact',
			},
		});
		expect(component.find(SizeableAvatar).props()).toMatchObject({
			src: 'http://avatars.atlassian.com/jace.png',
			appearance: 'compact',
		});
	});

	describe('TeamValue', () => {
		const mockTeam: Team = {
			name: 'team name',
			type: 'team',
			id: 'team-id',
		};

		const renderTeamValue = (team: Team) =>
			render(
				<SingleValue
					{...defaultSingleValueProps}
					data={{
						label: team.name,
						value: team.id,
						data: team,
					}}
				/>,
			);

		it('should render team name', () => {
			renderTeamValue(mockTeam);
			expect(screen.getByText('team name')).toBeInTheDocument();
		});

		it('should render SizeableAvatar with team type', async () => {
			(fg as jest.Mock).mockReturnValue(true);
			renderTeamValue({
				...mockTeam,
				avatarUrl: 'avatar-url',
			});

			expect(
				await screen.findByText(
					'SizeableAvatar - {"src":"avatar-url","appearance":"normal","type":"team"}',
				),
			).toBeInTheDocument();
		});

		it('should render verified team icon if team is verified', async () => {
			(fg as jest.Mock).mockReturnValue(true);
			renderTeamValue({
				...mockTeam,
				verified: true,
			});

			expect(await screen.findByText('VerifiedTeamIcon')).toBeInTheDocument();
		});

		it('should not render verified team icon if team is not verified', () => {
			(fg as jest.Mock).mockReturnValue(true);
			renderTeamValue({
				...mockTeam,
				verified: false,
			});
			expect(screen.queryByText('VerifiedTeamIcon')).not.toBeInTheDocument();
		});
	});

	describe('avatarAppearanceShape', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		ffTest.on('jira_ai_agent_avatar_user_picker_user_option', 'on', () => {
			it('should set avatarAppearanceShape', async () => {
				(getAppearanceForAppType as jest.Mock).mockReturnValue('hexagon');

				render(
					<SingleValue
						{...defaultSingleValueProps}
						data={{
							label: 'Jace Beleren',
							value: 'abc-123',
							data: {
								id: 'abc-123',
								name: 'Jace Beleren',
								avatarUrl: 'http://avatars.atlassian.com/jace.png',
								appType: 'agent',
							},
						}}
					/>,
				);

				expect(getAppearanceForAppType).toHaveBeenCalledWith('agent');
				expect(
					await screen.findByText(
						'SizeableAvatar - {"src":"http://avatars.atlassian.com/jace.png","appearance":"normal","type":"person","avatarAppearanceShape":"hexagon"}',
					),
				).toBeInTheDocument();
			});
		});

		ffTest.off('jira_ai_agent_avatar_user_picker_user_option', 'off', () => {
			it('should not set avatarAppearanceShape when jira_ai_agent_avatar_user_picker_user_option gate is disabled', async () => {
				(getAppearanceForAppType as jest.Mock).mockReturnValue('hexagon');

				render(
					<SingleValue
						{...defaultSingleValueProps}
						data={{
							label: 'Jace Beleren',
							value: 'abc-123',
							data: {
								id: 'abc-123',
								name: 'Jace Beleren',
								avatarUrl: 'http://avatars.atlassian.com/jace.png',
								appType: 'agent',
							},
						}}
					/>,
				);

				expect(getAppearanceForAppType).not.toHaveBeenCalled();
				expect(
					await screen.findByText(
						'SizeableAvatar - {"src":"http://avatars.atlassian.com/jace.png","appearance":"normal","type":"person"}',
					),
				).toBeInTheDocument();
			});
		});
	});
});
