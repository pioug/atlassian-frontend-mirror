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

jest.mock('../../../components/AvatarOrIcon', () => ({
	AvatarOrIcon: (props: any) => <div>AvatarOrIcon - {JSON.stringify(props)}</div>,
}));

jest.mock('@atlaskit/people-teams-ui-public/verified-team-icon', () => ({
	VerifiedTeamIcon: () => <div>VerifiedTeamIcon</div>,
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
			renderTeamValue({
				...mockTeam,
				verified: true,
			});

			expect(await screen.findByText('VerifiedTeamIcon')).toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});

		it('should not render verified team icon if team is not verified', async () => {
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

	describe('icon support', () => {
		const mockIcon = <div data-testid="test-icon">Icon</div>;
		const iconAsString = '{"type":"div","key":null,"ref":null,"props":{"data-testid":"test-icon","children":"Icon"},"_owner":null,"_store":{}}';

		ffTest.on('atlaskit_user_picker_support_icon', 'on', () => {
			it('should render AvatarOrIcon when feature gate is enabled and icon is provided', async () => {
				const userWithIcon = {
					...data.data,
					icon: mockIcon,
				};

				render(
					<SingleValue
						{...defaultSingleValueProps}
						data={{
							...data,
							data: userWithIcon,
						}}
					/>,
				);

				expect(
					await screen.findByText(
						`AvatarOrIcon - {"icon":${iconAsString},"src":"http://avatars.atlassian.com/jace.png","appearance":"normal","type":"person"}`,
					),
				).toBeInTheDocument();
			});

			it('should render AvatarOrIcon with iconColor when both icon and iconColor are provided', async () => {
				const iconColor = '#FF0000';
				const userWithIconAndColor = {
					...data.data,
					icon: mockIcon,
					iconColor,
				};

				render(
					<SingleValue
						{...defaultSingleValueProps}
						data={{
							...data,
							data: userWithIconAndColor,
						}}
					/>,
				);

				expect(
					await screen.findByText(
						`AvatarOrIcon - {"icon":${iconAsString},"iconColor":"#FF0000","src":"http://avatars.atlassian.com/jace.png","appearance":"normal","type":"person"}`,
					),
				).toBeInTheDocument();
			});

			it('should render SizeableAvatar when feature gate is enabled but no icon is provided', async () => {
				render(<SingleValue {...defaultSingleValueProps} />);

				expect(
					await screen.findByText(
						'SizeableAvatar - {"src":"http://avatars.atlassian.com/jace.png","appearance":"normal","type":"person"}',
					),
				).toBeInTheDocument();
			});
		});

		ffTest.off('atlaskit_user_picker_support_icon', 'off', () => {
			it('should render SizeableAvatar when feature gate is disabled even if icon is provided', async () => {
				const userWithIcon = {
					...data.data,
					icon: mockIcon,
				};

				render(
					<SingleValue
						{...defaultSingleValueProps}
						data={{
							...data,
							data: userWithIcon,
						}}
					/>,
				);

				expect(
					await screen.findByText(
						'SizeableAvatar - {"src":"http://avatars.atlassian.com/jace.png","appearance":"normal","type":"person"}',
					),
				).toBeInTheDocument();
			});
		});
	});
});
