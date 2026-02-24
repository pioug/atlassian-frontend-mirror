import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { shallow } from 'enzyme';
import React, { type ReactElement } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { render, screen } from '@testing-library/react';
import { AvatarItemOption, textWrapper } from '../../../components/AvatarItemOption';
import { SizeableAvatar } from '../../../components/SizeableAvatar';
import { AvatarOrIcon } from '../../../components/AvatarOrIcon';
import { TeamOption, type TeamOptionProps } from '../../../components/TeamOption/main';
import { type Team } from '../../../types';
import { VerifiedTeamIcon } from '@atlaskit/people-teams-ui-public/verified-team-icon';

jest.mock('../../../components/AvatarItemOption', () => ({
	...(jest.requireActual('../../../components/AvatarItemOption') as any),
	textWrapper: jest.fn(),
}));

describe('Team Option', () => {
	const mockTextWrapper = textWrapper as jest.Mock;

	afterEach(() => {
		jest.resetAllMocks();
	});

	const basicTeam: Team = {
		id: 'team-7',
		name: 'Team-1',
		avatarUrl: 'https://avatars.atlassian.com/team-1.png',
		type: 'team',
	};

	const shallowOption = (props: Partial<TeamOptionProps> = {}, team: Team) =>
		shallow(<TeamOption team={team} isSelected={false} includeTeamsUpdates={false} {...props} />);

	const buildTeam = (teamData: Partial<Team> = {}): Team => {
		return {
			...basicTeam,
			...teamData,
		};
	};

	it('should not render basic byline if member count is undefined', async () => {
		render(
			<TeamOption
				team={buildTeam({ includesYou: true })}
				isSelected={true}
				includeTeamsUpdates={false}
			/>,
		);
		expect(screen.queryByTestId('user-picker-team-secondary-text')).not.toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	it('should render correct byline if includesYou is undefined and memberCount <= 50', async () => {
		const component = shallowOption(
			{ isSelected: true },
			buildTeam({
				memberCount: 45,
			}),
		);
		const avatarOptionProps = component.find(AvatarItemOption);
		expect(mockTextWrapper).toHaveBeenCalledWith(token('color.text.selected', colors.B400));

		expect(avatarOptionProps.props().avatar).toEqual(
			<SizeableAvatar
				appearance="big"
				src="https://avatars.atlassian.com/team-1.png"
				type="team"
			/>,
		);

		const secondaryText = avatarOptionProps.props().secondaryText as ReactElement;
		expect(secondaryText.props.children).toEqual(
			<FormattedMessage
				defaultMessage="Team • {count} {count, plural, one {member} other {members}}"
				description="Byline to show the number of members in the team when the current user is not a member of the team"
				id="fabric.elements.user-picker.team.member.count"
				values={{
					count: 45,
				}}
			/>,
		);

		await expect(document.body).toBeAccessible();
	});

	it('should render correct byline if includesYou is undefined and memberCount > 50', async () => {
		const component = shallowOption(
			{ isSelected: true },
			buildTeam({
				memberCount: 51,
			}),
		);
		const avatarOptionProps = component.find(AvatarItemOption);
		expect(mockTextWrapper).toHaveBeenCalledWith(token('color.text.selected', colors.B400));

		const secondaryText = avatarOptionProps.props().secondaryText as ReactElement;

		expect(secondaryText.props.children).toEqual(
			<FormattedMessage
				defaultMessage="Team • 50+ members"
				description="Byline to show the number of members in the team when the number exceeds 50"
				id="fabric.elements.user-picker.team.member.50plus"
			/>,
		);

		await expect(document.body).toBeAccessible();
	});

	it('should render correct byline if includesYou = false and memberCount <= 50', async () => {
		const component = shallowOption(
			{ isSelected: true },
			buildTeam({
				includesYou: false,
				memberCount: 45,
			}),
		);
		const avatarOptionProps = component.find(AvatarItemOption);
		expect(mockTextWrapper).toHaveBeenCalledWith(token('color.text.selected', colors.B400));

		const secondaryText = avatarOptionProps.props().secondaryText as ReactElement;
		expect(secondaryText.props.children).toEqual(
			<FormattedMessage
				defaultMessage="Team • {count} {count, plural, one {member} other {members}}"
				description="Byline to show the number of members in the team when the current user is not a member of the team"
				id="fabric.elements.user-picker.team.member.count"
				values={{
					count: 45,
				}}
			/>,
		);

		await expect(document.body).toBeAccessible();
	});

	it('should render correct byline if includesYou = false and memberCount > 50', async () => {
		const component = shallowOption(
			{ isSelected: true },
			buildTeam({
				includesYou: false,
				memberCount: 51,
			}),
		);
		const avatarOptionProps = component.find(AvatarItemOption);
		expect(mockTextWrapper).toHaveBeenCalledWith(token('color.text.selected', colors.B400));
		const secondaryText = avatarOptionProps.props().secondaryText as ReactElement;

		expect(secondaryText.props.children).toEqual(
			<FormattedMessage
				defaultMessage="Team • 50+ members"
				description="Byline to show the number of members in the team when the number exceeds 50"
				id="fabric.elements.user-picker.team.member.50plus"
			/>,
		);

		await expect(document.body).toBeAccessible();
	});

	it('should render correct byline if includesYou = true and memberCount <= 50', async () => {
		const component = shallowOption(
			{ isSelected: true },
			buildTeam({
				includesYou: true,
				memberCount: 45,
			}),
		);
		const avatarOptionProps = component.find(AvatarItemOption);
		expect(mockTextWrapper).toHaveBeenCalledWith(token('color.text.selected', colors.B400));

		const secondaryText = avatarOptionProps.props().secondaryText as ReactElement;

		expect(secondaryText.props.children).toEqual(
			<FormattedMessage
				defaultMessage="Team • {count} {count, plural, one {member} other {members}}, including you"
				description="Byline to show the number of members in the team when the current user is also a member of the team"
				id="fabric.elements.user-picker.team.member.count.including.you"
				values={{
					count: 45,
				}}
			/>,
		);

		await expect(document.body).toBeAccessible();
	});

	it('should render correct byline if includesYou = true and memberCount > 50', async () => {
		const component = shallowOption(
			{ isSelected: true },
			buildTeam({
				includesYou: true,
				memberCount: 51,
			}),
		);
		const avatarOptionProps = component.find(AvatarItemOption);
		expect(mockTextWrapper).toHaveBeenCalledWith(token('color.text.selected', colors.B400));

		const secondaryText = avatarOptionProps.props().secondaryText as ReactElement;

		expect(secondaryText.props.children).toEqual(
			<FormattedMessage
				defaultMessage="Team • 50+ members, including you"
				description="Byline to show the number of members in the team when the number exceeds 50 and also includes the current user"
				id="fabric.elements.user-picker.team.member.50plus.including.you"
			/>,
		);

		await expect(document.body).toBeAccessible();
	});

	it('should render custom byline if byline is set on team and memberCount and includesYou is provided', async () => {
		const customByline = 'A custom byline';
		const component = shallowOption(
			{ isSelected: true },
			buildTeam({
				byline: customByline,
				includesYou: true,
				memberCount: 45,
			}),
		);
		const avatarOptionProps = component.find(AvatarItemOption);
		expect(mockTextWrapper).toHaveBeenCalledWith(token('color.text.selected', colors.B400));

		const secondaryText = avatarOptionProps.props().secondaryText as ReactElement;

		expect(secondaryText.props.children).toEqual(customByline);

		await expect(document.body).toBeAccessible();
	});
	it('should render basic Team byline when verified but no teamTypeName provided', async () => {
		const component = shallowOption(
			{ isSelected: true, includeTeamsUpdates: true },
			buildTeam({
				verified: true,
				memberCount: 2,
			}),
		);
		const avatarItemOption = component.find(AvatarItemOption);
		const secondaryText = avatarItemOption.props().secondaryText as ReactElement;
		// When no teamTypeName is provided, fall back to basic "Team" message regardless of verification
		expect(secondaryText.props.children).toEqual(
			<FormattedMessage
				id="fabric.elements.user-picker.team.member.count"
				defaultMessage="Team • {count} {count, plural, one {member} other {members}}"
				description="Byline to show the number of members in the team when the current user is not a member of the team"
				values={{ count: 2 }}
			/>,
		);

		await expect(document.body).toBeAccessible();
	});

	it('should render teamTypeName without verified icon when team is not verified', async () => {
		const component = shallowOption(
			{ isSelected: true, includeTeamsUpdates: true },
			buildTeam({
				verified: false,
				memberCount: 5,
				teamTypeName: 'Custom team',
			}),
		);
		const avatarItemOption = component.find(AvatarItemOption);
		const secondaryText = avatarItemOption.props().secondaryText as ReactElement;
		// teamTypeName should be shown, but verifiedIcon should be null since team is not verified
		expect(secondaryText.props.children).toEqual(
			<FormattedMessage
				id="fabric.elements.user-picker.team.member.count.official"
				defaultMessage="{teamTypeName} {verifiedIcon} • {count} {count, plural, one {member} other {members}}"
				description="Byline to show the number of members in the team when the current user is not a member of the team"
				values={{
					verifiedIcon: null,
					count: 5,
					teamTypeName: 'Custom team',
				}}
			/>,
		);

		await expect(document.body).toBeAccessible();
	});

	it('should render the verified team with dynamic teamTypeName from server', async () => {
		const component = shallowOption(
			{ isSelected: true, includeTeamsUpdates: true },
			buildTeam({
				verified: true,
				memberCount: 2,
				teamTypeName: 'Managed team',
			}),
		);
		const avatarItemOption = component.find(AvatarItemOption);
		const secondaryText = avatarItemOption.props().secondaryText as ReactElement;
		expect(secondaryText.props.children).toEqual(
			<FormattedMessage
				id="fabric.elements.user-picker.team.member.count.official"
				defaultMessage="{teamTypeName} {verifiedIcon} • {count} {count, plural, one {member} other {members}}"
				description="Byline to show the number of members in the team when the current user is not a member of the team"
				values={{
					verifiedIcon: <VerifiedTeamIcon label="" size="small" />,
					count: 2,
					teamTypeName: 'Managed team',
				}}
			/>,
		);

		await expect(document.body).toBeAccessible();
	});

	it('should not render the verified team icon if the team is not verified', async () => {
		const component = shallowOption(
			{ isSelected: true, includeTeamsUpdates: true },
			buildTeam({
				verified: false,
				memberCount: 2,
			}),
		);
		const avatarItemOption = component.find(AvatarItemOption);
		const secondaryText = avatarItemOption.props().secondaryText as ReactElement;
		expect(secondaryText.props.children).toEqual(
			<FormattedMessage
				id="fabric.elements.user-picker.team.member.count"
				defaultMessage="Team • {count} {count, plural, one {member} other {members}}"
				description="Byline to show the number of members in the team when the current user is not a member of the team"
				values={{ count: 2 }}
			/>,
		);

		await expect(document.body).toBeAccessible();
	});

	it('should render verified team with 50+ members and dynamic teamTypeName', async () => {
		const component = shallowOption(
			{ isSelected: true, includeTeamsUpdates: true },
			buildTeam({
				verified: true,
				memberCount: 51,
				teamTypeName: 'Enterprise team',
			}),
		);
		const avatarItemOption = component.find(AvatarItemOption);
		const secondaryText = avatarItemOption.props().secondaryText as ReactElement;
		expect(secondaryText.props.children).toEqual(
			<FormattedMessage
				id="fabric.elements.user-picker.team.member.50plus.official"
				defaultMessage="{teamTypeName} {verifiedIcon} • 50+ members"
				description="Byline to show the number of members in the team when the number exceeds 50"
				values={{
					verifiedIcon: <VerifiedTeamIcon label="" size="small" />,
					teamTypeName: 'Enterprise team',
				}}
			/>,
		);

		await expect(document.body).toBeAccessible();
	});

	it('should render verified team with includesYou and dynamic teamTypeName', async () => {
		const component = shallowOption(
			{ isSelected: true, includeTeamsUpdates: true },
			buildTeam({
				verified: true,
				memberCount: 10,
				includesYou: true,
				teamTypeName: 'Project team',
			}),
		);
		const avatarItemOption = component.find(AvatarItemOption);
		const secondaryText = avatarItemOption.props().secondaryText as ReactElement;
		expect(secondaryText.props.children).toEqual(
			<FormattedMessage
				id="fabric.elements.user-picker.team.member.count.official.including.you"
				defaultMessage="{teamTypeName} {verifiedIcon} • {count} {count, plural, one {member} other {members}}, including you"
				description="Byline to show the number of members in the team when the current user is also a member of the team"
				values={{
					verifiedIcon: <VerifiedTeamIcon label="" size="small" />,
					count: 10,
					teamTypeName: 'Project team',
				}}
			/>,
		);

		await expect(document.body).toBeAccessible();
	});

	it('should render verified team with 50+ members, includesYou, and dynamic teamTypeName', async () => {
		const component = shallowOption(
			{ isSelected: true, includeTeamsUpdates: true },
			buildTeam({
				verified: true,
				memberCount: 100,
				includesYou: true,
				teamTypeName: 'Organization team',
			}),
		);
		const avatarItemOption = component.find(AvatarItemOption);
		const secondaryText = avatarItemOption.props().secondaryText as ReactElement;
		expect(secondaryText.props.children).toEqual(
			<FormattedMessage
				id="fabric.elements.user-picker.team.member.50plus.official.including.you"
				defaultMessage="{teamTypeName} {verifiedIcon} • 50+ members, including you"
				description="Byline to show the number of members in the team when the number exceeds 50 and also includes the current user"
				values={{
					verifiedIcon: <VerifiedTeamIcon label="" size="small" />,
					teamTypeName: 'Organization team',
				}}
			/>,
		);

		await expect(document.body).toBeAccessible();
	});

	describe('icon support', () => {
		const mockIcon = <div data-testid="test-icon">Icon</div>;

		it('should render AvatarOrIcon when icon is provided', () => {
			const teamWithIcon = buildTeam({
				icon: mockIcon,
			});

			const component = shallowOption({}, teamWithIcon);
			const avatarItemOption = component.find(AvatarItemOption);
			const avatar = avatarItemOption.props().avatar as ReactElement;

			expect(avatar.type).toBe(AvatarOrIcon);
			expect(avatar.props.icon).toEqual(mockIcon);
			expect(avatar.props.src).toEqual(basicTeam.avatarUrl);
		});

		it('should render AvatarOrIcon with iconColor when both icon and iconColor are provided', () => {
			const iconColor = '#FF0000';
			const teamWithIconAndColor = buildTeam({
				icon: mockIcon,
				iconColor,
			});

			const component = shallowOption({}, teamWithIconAndColor);
			const avatarItemOption = component.find(AvatarItemOption);
			const avatar = avatarItemOption.props().avatar as ReactElement;

			expect(avatar.type).toBe(AvatarOrIcon);
			expect(avatar.props.icon).toEqual(mockIcon);
			expect(avatar.props.iconColor).toEqual(iconColor);
		});

		it('should render SizeableAvatar when no icon is provided', () => {
			const component = shallowOption({}, basicTeam);
			const avatarItemOption = component.find(AvatarItemOption);
			const avatar = avatarItemOption.props().avatar as ReactElement;

			expect(avatar.type).toBe(SizeableAvatar);
		});
	});
});
