import { shallow } from 'enzyme';
import { render, screen } from '@testing-library/react';
import noop from 'lodash/noop';
import React from 'react';
import { type Props } from '../../../components/SingleValue';
import { SingleValue } from '../../../components/SingleValue';
import { SizeableAvatar } from '../../../components/SizeableAvatar';
import { type Team, type Group } from '../../../types';
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

	it('should render SingleValue', async () => {
		const component = shallowSingleValue();
		expect(component.find(SizeableAvatar).props()).toMatchObject({
			src: 'http://avatars.atlassian.com/jace.png',
			appearance: 'normal',
		});

		await expect(document.body).toBeAccessible();
	});

	it('should render SizeableAvatar when the appearance is compact', async () => {
		const component = shallowSingleValue({
			selectProps: {
				appearance: 'compact',
			},
		});
		expect(component.find(SizeableAvatar).props()).toMatchObject({
			src: 'http://avatars.atlassian.com/jace.png',
			appearance: 'compact',
		});

		await expect(document.body).toBeAccessible();
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

		it('should render team name', async () => {
			renderTeamValue(mockTeam);
			expect(screen.getByText('team name')).toBeInTheDocument();

			await expect(document.body).toBeAccessible();
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

			await expect(document.body).toBeAccessible();
		});

		it('should render verified team icon if team is verified', async () => {
			(fg as jest.Mock).mockReturnValue(true);
			renderTeamValue({
				...mockTeam,
				verified: true,
			});

			expect(await screen.findByText('VerifiedTeamIcon')).toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});

		it('should not render verified team icon if team is not verified', async () => {
			(fg as jest.Mock).mockReturnValue(true);
			renderTeamValue({
				...mockTeam,
				verified: false,
			});
			expect(screen.queryByText('VerifiedTeamIcon')).not.toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});
	});

	describe('GroupValue', () => {
		const mockGroup: Group = {
			name: 'group name',
			type: 'group' as const,
			id: 'group-id',
		};

		const renderGroupValue = (group: any, includeTeamsUpdates: boolean = false) =>
			render(
				<SingleValue
					{...defaultSingleValueProps}
					data={{
						label: group.name,
						value: group.id,
						data: {
							...group,
							includeTeamsUpdates,
						},
					}}
				/>,
			);

		it('should render verified icon for group when includeTeamsUpdates is true', async () => {
			renderGroupValue(mockGroup, true);

			expect(await screen.findByText('VerifiedTeamIcon')).toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});

		it('should not render verified icon for group when includeTeamsUpdates is false', async () => {
			renderGroupValue(mockGroup, false);

			expect(screen.queryByText('VerifiedTeamIcon')).not.toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});
	});

	describe('shouldShowVerifiedIcon', () => {
		const mockUser = {
			name: 'John Doe',
			type: 'user' as const,
			id: 'user-id',
		};

		it('should use shouldShowVerifiedIcon prop when provided', async () => {
			const shouldShowVerifiedIcon = jest.fn().mockReturnValue(true);

			render(
				<SingleValue
					{...defaultSingleValueProps}
					data={{
						label: mockUser.name,
						value: mockUser.id,
						data: mockUser,
					}}
					shouldShowVerifiedIcon={shouldShowVerifiedIcon}
				/>,
			);

			expect(shouldShowVerifiedIcon).toHaveBeenCalledWith(mockUser);
			expect(await screen.findByText('VerifiedTeamIcon')).toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});

		it('should not render verified icon when shouldShowVerifiedIcon returns false', async () => {
			const shouldShowVerifiedIcon = jest.fn().mockReturnValue(false);

			render(
				<SingleValue
					{...defaultSingleValueProps}
					data={{
						label: mockUser.name,
						value: mockUser.id,
						data: mockUser,
					}}
					shouldShowVerifiedIcon={shouldShowVerifiedIcon}
				/>,
			);

			expect(shouldShowVerifiedIcon).toHaveBeenCalledWith(mockUser);
			expect(screen.queryByText('VerifiedTeamIcon')).not.toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});

		it('should prioritize shouldShowVerifiedIcon over default logic', async () => {
			const shouldShowVerifiedIcon = jest.fn().mockReturnValue(true);
			const mockTeam: Team = {
				name: 'team name',
				type: 'team',
				id: 'team-id',
				verified: false,
			};

			render(
				<SingleValue
					{...defaultSingleValueProps}
					data={{
						label: mockTeam.name,
						value: mockTeam.id,
						data: mockTeam,
					}}
					shouldShowVerifiedIcon={shouldShowVerifiedIcon}
				/>,
			);

			expect(shouldShowVerifiedIcon).toHaveBeenCalledWith(mockTeam);
			expect(await screen.findByText('VerifiedTeamIcon')).toBeInTheDocument();

			await expect(document.body).toBeAccessible();
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

				await expect(document.body).toBeAccessible();
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

				await expect(document.body).toBeAccessible();
			});
		});
	});
});
