import { components } from '@atlaskit/select';
import { shallow } from 'enzyme';
import React from 'react';
import { EmailOption } from '../../../components/EmailOption';
import { Option, OptionProps } from '../../../components/Option';
import { TeamOption } from '../../../components/TeamOption';
import { UserOption } from '../../../components/UserOption';
import { GroupOption } from '../../../components/GroupOption';
import { Email, Team, User, Group, ExternalUser } from '../../../types';
import { ExternalUserOption } from '../../../components/ExternalUserOption';

describe('Option', () => {
  const selectProps: any = {};

  const shallowOption = (props: OptionProps) => shallow(<Option {...props} />);

  describe('UserOption', () => {
    const user: User = {
      id: 'abc-123',
      name: 'Jace Beleren',
      publicName: 'jbeleren',
      avatarUrl: 'http://avatars.atlassian.com/jace.png',
    };

    it('should render Option with UserOption', () => {
      const component = shallowOption({
        data: { data: user, label: user.name, value: user.id },
        isSelected: true,
        status: 'online',
        selectProps,
      });
      const option = component.find(components.Option);
      expect(option).toHaveLength(1);
      expect(option.props()).toMatchObject({
        data: { data: user },
        status: 'online',
        isSelected: true,
      });

      const userOption = component.find(UserOption);
      expect(userOption).toHaveLength(1);
      expect(userOption.props()).toMatchObject({
        user,
        status: 'online',
        isSelected: true,
      });
    });
  });

  describe('ExternalUserOption', () => {
    const externalUser: ExternalUser = {
      id: 'external-user-123',
      name: 'That Awesome External User',
      type: 'user',
      isExternal: true,
      sources: [],
    };

    it('should render option with ExternalUserOption', () => {
      const component = shallowOption({
        data: {
          data: externalUser,
          label: externalUser.name,
          value: externalUser.id,
        },
        status: 'online',
        isSelected: true,
        selectProps,
      });
      const option = component.find(components.Option);
      expect(option).toHaveLength(1);
      expect(option.props()).toMatchObject({
        data: { data: externalUser },
        status: 'online',
        isSelected: true,
      });

      const externalUserOption = component.find(ExternalUserOption);
      expect(externalUserOption).toHaveLength(1);
      expect(externalUserOption.props()).toMatchObject({
        user: externalUser,
        status: 'online',
        isSelected: true,
      });
    });
  });

  describe('EmailOption', () => {
    const email: Email = {
      type: 'email',
      id: 'test@test.com',
      name: 'test@test.com',
    };

    it('should render Option with EmailOption', () => {
      const component = shallowOption({
        data: { data: email, label: email.name, value: email.id },
        isSelected: false,
        selectProps: {
          emailLabel: 'Invite',
        },
      });

      const option = component.find(components.Option);
      expect(option).toHaveLength(1);
      expect(option.props()).toMatchObject({
        data: { data: email },
        isSelected: false,
      });

      const emailOption = component.find(EmailOption);
      expect(emailOption).toHaveLength(1);
      expect(emailOption.props()).toMatchObject({
        email,
        isSelected: false,
        label: 'Invite',
      });
    });
  });

  describe('TeamOption', () => {
    const team: Team = {
      id: 'team-123',
      name: 'That Awesome team',
      type: 'team',
    };

    it('should render option with TeamOption', () => {
      const component = shallowOption({
        data: { data: team, label: team.name, value: team.id },
        status: 'online',
        isSelected: true,
        selectProps,
      });

      const option = component.find(components.Option);
      expect(option).toHaveLength(1);
      expect(option.props()).toMatchObject({
        data: { data: team },
        isSelected: true,
      });

      const teamOption = component.find(TeamOption);
      expect(teamOption).toHaveLength(1);
      expect(teamOption.props()).toMatchObject({
        team,
        isSelected: true,
      });
    });
  });

  describe('GroupOption', () => {
    const group: Group = {
      id: 'group-123',
      name: 'group-that-groups-groups',
      type: 'group',
    };

    it('should render option with GroupOption', () => {
      const component = shallowOption({
        data: { data: group, label: group.name, value: group.id },
        isSelected: true,
        selectProps,
      });

      const option = component.find(components.Option);
      expect(option).toHaveLength(1);
      expect(option.props()).toMatchObject({
        data: { data: group },
        isSelected: true,
      });

      const groupOption = component.find(GroupOption);
      expect(groupOption).toHaveLength(1);
      expect(groupOption.props()).toMatchObject({
        group,
        isSelected: true,
      });
    });
  });
});
