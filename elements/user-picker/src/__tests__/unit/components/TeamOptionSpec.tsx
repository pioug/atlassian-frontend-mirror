import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import {
  AvatarItemOption,
  textWrapper,
} from '../../../components/AvatarItemOption';
import { HighlightText } from '../../../components/HighlightText';
import { SizeableAvatar } from '../../../components/SizeableAvatar';
import {
  TeamOption,
  TeamOptionProps,
} from '../../../components/TeamOption/main';
import { Team } from '../../../types';

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
    shallow(<TeamOption team={team} isSelected={false} {...props} />);

  const buildTeam = (teamData: Partial<Team> = {}): Team => {
    return {
      ...basicTeam,
      ...teamData,
    };
  };

  it('should not render byline if member count is undefined', () => {
    const component = shallowOption(
      { isSelected: true },
      buildTeam({ includesYou: true }),
    );
    const avatarOptionProps = component.find(AvatarItemOption);
    expect(mockTextWrapper).toHaveBeenCalledWith(
      token('color.text.selected', colors.B400),
    );
    expect(avatarOptionProps.props()).toMatchObject({
      avatar: (
        <SizeableAvatar
          appearance="big"
          src="https://avatars.atlassian.com/team-1.png"
          name="Team-1"
        />
      ),
      primaryText: [
        <span
          key="name"
          css={textWrapper(token('color.text.selected', colors.B400))}
        >
          <HighlightText>Team-1</HighlightText>
        </span>,
      ],
      secondaryText: undefined,
    });
  });

  it('should render correct byline if includesYou is undefined and memberCount <= 50', () => {
    const component = shallowOption(
      { isSelected: true },
      buildTeam({
        memberCount: 45,
      }),
    );
    const avatarOptionProps = component.find(AvatarItemOption);
    expect(mockTextWrapper).toHaveBeenCalledWith(
      token('color.text.selected', colors.B400),
    );
    expect(avatarOptionProps.prop('secondaryText')).toEqual(
      <span>
        <FormattedMessage
          defaultMessage="Team • {count} {count, plural, one {member} other {members}}"
          description="Byline to show the number of members in the team when the current user is not a member of the team"
          id="fabric.elements.user-picker.team.member.count"
          values={{
            count: 45,
          }}
        />
      </span>,
    );
  });

  it('should render correct byline if includesYou is undefined and memberCount > 50', () => {
    const component = shallowOption(
      { isSelected: true },
      buildTeam({
        memberCount: 51,
      }),
    );
    const avatarOptionProps = component.find(AvatarItemOption);
    expect(mockTextWrapper).toHaveBeenCalledWith(
      token('color.text.selected', colors.B400),
    );
    expect(avatarOptionProps.prop('secondaryText')).toEqual(
      <span>
        <FormattedMessage
          defaultMessage="Team • 50+ members"
          description="Byline to show the number of members in the team when the number exceeds 50"
          id="fabric.elements.user-picker.team.member.50plus"
        />
      </span>,
    );
  });

  it('should render correct byline if includesYou = false and memberCount <= 50', () => {
    const component = shallowOption(
      { isSelected: true },
      buildTeam({
        includesYou: false,
        memberCount: 45,
      }),
    );
    const avatarOptionProps = component.find(AvatarItemOption);
    expect(mockTextWrapper).toHaveBeenCalledWith(
      token('color.text.selected', colors.B400),
    );
    expect(avatarOptionProps.prop('secondaryText')).toEqual(
      <span>
        <FormattedMessage
          defaultMessage="Team • {count} {count, plural, one {member} other {members}}"
          description="Byline to show the number of members in the team when the current user is not a member of the team"
          id="fabric.elements.user-picker.team.member.count"
          values={{
            count: 45,
          }}
        />
      </span>,
    );
  });

  it('should render correct byline if includesYou = false and memberCount > 50', () => {
    const component = shallowOption(
      { isSelected: true },
      buildTeam({
        includesYou: false,
        memberCount: 51,
      }),
    );
    const avatarOptionProps = component.find(AvatarItemOption);
    expect(mockTextWrapper).toHaveBeenCalledWith(
      token('color.text.selected', colors.B400),
    );
    expect(avatarOptionProps.prop('secondaryText')).toEqual(
      <span>
        <FormattedMessage
          defaultMessage="Team • 50+ members"
          description="Byline to show the number of members in the team when the number exceeds 50"
          id="fabric.elements.user-picker.team.member.50plus"
        />
      </span>,
    );
  });

  it('should render correct byline if includesYou = true and memberCount <= 50', () => {
    const component = shallowOption(
      { isSelected: true },
      buildTeam({
        includesYou: true,
        memberCount: 45,
      }),
    );
    const avatarOptionProps = component.find(AvatarItemOption);
    expect(mockTextWrapper).toHaveBeenCalledWith(
      token('color.text.selected', colors.B400),
    );
    expect(avatarOptionProps.prop('secondaryText')).toEqual(
      <span>
        <FormattedMessage
          defaultMessage="Team • {count} {count, plural, one {member} other {members}}, including you"
          description="Byline to show the number of members in the team when the current user is also a member of the team"
          id="fabric.elements.user-picker.team.member.count.including.you"
          values={{
            count: 45,
          }}
        />
      </span>,
    );
  });

  it('should render correct byline if includesYou = true and memberCount > 50', () => {
    const component = shallowOption(
      { isSelected: true },
      buildTeam({
        includesYou: true,
        memberCount: 51,
      }),
    );
    const avatarOptionProps = component.find(AvatarItemOption);
    expect(mockTextWrapper).toHaveBeenCalledWith(
      token('color.text.selected', colors.B400),
    );
    expect(avatarOptionProps.prop('secondaryText')).toEqual(
      <span>
        <FormattedMessage
          defaultMessage="Team • 50+ members, including you"
          description="Byline to show the number of members in the team when the number exceeds 50 and also includes the current user"
          id="fabric.elements.user-picker.team.member.50plus.including.you"
        />
      </span>,
    );
  });
});
