import { components } from '@atlaskit/select';
import noop from 'lodash/noop';
import { IntlProvider } from 'react-intl-next';

import { mount } from 'enzyme';
import React, { ReactChildren } from 'react';
import { AvatarItemOption } from '../../../components/AvatarItemOption';
import { EmailOption } from '../../../components/EmailOption/main';
import { Option } from '../../../components/Option';
import { TeamOption } from '../../../components/TeamOption/main';
import { UserOption } from '../../../components/UserOption';
import { GroupOption } from '../../../components/GroupOption/main';
import { Email, Team, User, Group, ExternalUser } from '../../../types';
import { ExternalUserOption } from '../../../components/ExternalUserOption/main';

// Helper to make <React.Suspense> and React.lazy() work with Enzyme
jest.mock('react', () => {
  const React = jest.requireActual('react');

  return {
    ...React,
    Suspense: ({ children }: { children: ReactChildren }) => children,
    lazy: jest.fn().mockImplementation((fn) => {
      const Component = (props: any) => {
        const [C, setC] = React.useState();

        React.useEffect(() => {
          fn().then((v: any) => {
            setC(v);
          });
        }, []);

        return C ? <C.default {...props} /> : null;
      };

      return Component;
    }),
  };
});

describe('Option', () => {
  const selectProps: any = {};

  // assigning props as any to avoid nooping all react-select Option props.
  // Option is a react-select plugin so it passes down a heap of style-based props
  // which we're not interested in testing here.
  const renderOption = (props: any) =>
    mount(
      <IntlProvider locale="en">
        <Option {...props} getStyles={noop} cx={noop} />
      </IntlProvider>,
    );

  describe('UserOption', () => {
    const user: User = {
      id: 'abc-123',
      name: 'Jace Beleren',
      publicName: 'jbeleren',
      avatarUrl: 'http://avatars.atlassian.com/jace.png',
    };

    it('should render Option with UserOption', () => {
      const component = renderOption({
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

    it('should render option with ExternalUserOption', async () => {
      const component = renderOption({
        data: {
          data: externalUser,
          label: externalUser.name,
          value: externalUser.id,
        },
        status: 'online',
        isSelected: true,
        selectProps,
      });

      // fallback
      component.find(AvatarItemOption);

      // wait for lazy load to resolve
      await new Promise(setImmediate);
      component.update();

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

    it('should render Option with EmailOption', async () => {
      const component = renderOption({
        data: { data: email, label: email.name, value: email.id },
        isSelected: false,
        selectProps: {
          emailLabel: 'Invite',
        },
      });

      // fallback
      component.find(AvatarItemOption);

      // wait for lazy load to resolve
      await new Promise(setImmediate);
      component.update();

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

    it('should render option with TeamOption', async () => {
      const component = renderOption({
        data: { data: team, label: team.name, value: team.id },
        status: 'online',
        isSelected: true,
        selectProps,
      });

      // fallback
      component.find(AvatarItemOption);

      // wait for lazy load to resolve
      await new Promise(setImmediate);
      component.update();

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

    it('should render option with GroupOption', async () => {
      const component = renderOption({
        data: { data: group, label: group.name, value: group.id },
        isSelected: true,
        selectProps,
      });

      // fallback
      component.find(AvatarItemOption);

      // wait for lazy load to resolve
      await new Promise(setImmediate);
      component.update();

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
