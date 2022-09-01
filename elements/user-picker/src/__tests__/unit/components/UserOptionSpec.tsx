import * as colors from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { shallow } from 'enzyme';
import React, { ReactElement } from 'react';
import { LozengeProps } from '../../../types';
import {
  AvatarItemOption,
  textWrapper,
} from '../../../components/AvatarItemOption';
import { HighlightText } from '../../../components/HighlightText';
import { SizeableAvatar } from '../../../components/SizeableAvatar';
import { UserOption, UserOptionProps } from '../../../components/UserOption';

jest.mock('../../../components/AvatarItemOption', () => ({
  ...(jest.requireActual('../../../components/AvatarItemOption') as any),
  textWrapper: jest.fn(),
}));

describe('User Option', () => {
  const mockTextWrapper = textWrapper as jest.Mock;

  afterEach(() => {
    jest.resetAllMocks();
  });

  const user = {
    id: 'abc-123',
    name: 'Jace Beleren',
    publicName: 'jbeleren',
    avatarUrl: 'http://avatars.atlassian.com/jace.png',
    byline: 'Teammate',
    lozenge: 'WORKSPACE',
  };

  const shallowOption = (props: Partial<UserOptionProps> = {}) =>
    shallow<UserOption>(
      <UserOption
        user={user}
        status="approved"
        isSelected={false}
        {...props}
      />,
    );

  it('should render UserOption component', () => {
    const component = shallowOption();
    const avatarItemOption = component.find(AvatarItemOption);

    expect(avatarItemOption.props().avatar).toEqual(
      <SizeableAvatar
        appearance="big"
        src="http://avatars.atlassian.com/jace.png"
        presence="approved"
        name="Jace Beleren"
      />,
    );

    expect(mockTextWrapper).toHaveBeenCalledWith(
      token('color.text', colors.N800),
    );

    const primaryText = avatarItemOption.props().primaryText as ReactElement[];

    expect(primaryText[0].key).toEqual('name');
    expect(primaryText[0].props.children).toEqual(
      <HighlightText>Jace Beleren</HighlightText>,
    );
    expect(primaryText[1].key).toEqual('publicName');
    expect(primaryText[1].props.children[1].props.children[1]).toEqual(
      <HighlightText>jbeleren</HighlightText>,
    );

    const secondaryText = avatarItemOption.props()
      .secondaryText as ReactElement;

    expect(secondaryText.props.children).toEqual('Teammate');
    expect(avatarItemOption.props().lozenge).toEqual({
      text: 'WORKSPACE',
    });
  });

  it('should render Option in selected state', () => {
    const component = shallowOption({ isSelected: true });
    const avatarItemOption = component.find(AvatarItemOption);
    expect(mockTextWrapper).toHaveBeenNthCalledWith(
      3,
      token('color.text.selected', colors.B400),
    );

    expect(avatarItemOption.props().avatar).toEqual(
      <SizeableAvatar
        appearance="big"
        src="http://avatars.atlassian.com/jace.png"
        presence="approved"
        name="Jace Beleren"
      />,
    );

    const primaryText = avatarItemOption.props().primaryText as ReactElement[];

    expect(primaryText[0].key).toEqual('name');
    expect(primaryText[0].props.children).toEqual(
      <HighlightText>Jace Beleren</HighlightText>,
    );
    expect(primaryText[1].key).toEqual('publicName');
    expect(primaryText[1].props.children[1].props.children[1]).toEqual(
      <HighlightText>jbeleren</HighlightText>,
    );

    const secondaryText = avatarItemOption.props()
      .secondaryText as ReactElement;

    expect(secondaryText.props.children).toEqual('Teammate');
    expect(avatarItemOption.props().lozenge).toEqual({
      text: 'WORKSPACE',
    });
  });

  it('should render lozenge when providing LozengeProps type object', () => {
    const lozengeObject: LozengeProps = {
      text: 'GUEST',
      appearance: 'new',
    };

    const userWithLozenge = {
      ...user,
      lozenge: lozengeObject,
    };

    const component = shallowOption({ user: userWithLozenge });

    const avatarItemOption = component.find(AvatarItemOption);

    expect(mockTextWrapper).toHaveBeenCalledWith(
      token('color.text', colors.N800),
    );
    expect(mockTextWrapper).toHaveBeenNthCalledWith(
      2,
      token('color.text.subtlest', colors.N200),
    );
    expect(avatarItemOption.props().avatar).toEqual(
      <SizeableAvatar
        appearance="big"
        src="http://avatars.atlassian.com/jace.png"
        presence="approved"
        name="Jace Beleren"
      />,
    );

    const primaryText = avatarItemOption.props().primaryText as ReactElement[];

    expect(primaryText[0].key).toEqual('name');
    expect(primaryText[0].props.children).toEqual(
      <HighlightText>Jace Beleren</HighlightText>,
    );
    expect(primaryText[1].key).toEqual('publicName');
    expect(primaryText[1].props.children[1].props.children[1]).toEqual(
      <HighlightText>jbeleren</HighlightText>,
    );

    const secondaryText = avatarItemOption.props()
      .secondaryText as ReactElement;

    expect(secondaryText.props.children).toEqual('Teammate');
    expect(avatarItemOption.props().lozenge).toEqual({
      text: 'GUEST',
      appearance: 'new',
    });
  });

  it('should highlight text', () => {
    const userWithHighlight = {
      ...user,
      highlight: {
        name: [{ start: 0, end: 2 }],
        publicName: [{ start: 2, end: 4 }],
      },
    };
    const component = shallowOption({ user: userWithHighlight });
    const avatarItemOption = component.find(AvatarItemOption);

    expect(mockTextWrapper).toHaveBeenCalledWith(
      token('color.text', colors.N800),
    );
    expect(mockTextWrapper).toHaveBeenNthCalledWith(
      2,
      token('color.text.subtlest', colors.N200),
    );
    expect(avatarItemOption.props().avatar).toEqual(
      <SizeableAvatar
        appearance="big"
        src="http://avatars.atlassian.com/jace.png"
        presence="approved"
        name="Jace Beleren"
      />,
    );

    const primaryText = avatarItemOption.props().primaryText as ReactElement[];

    expect(primaryText[0].key).toEqual('name');
    expect(primaryText[0].props.children).toEqual(
      <HighlightText highlights={[{ start: 0, end: 2 }]}>
        Jace Beleren
      </HighlightText>,
    );
    expect(primaryText[1].key).toEqual('publicName');
    expect(primaryText[1].props.children[1].props.children[1]).toEqual(
      <HighlightText highlights={[{ start: 2, end: 4 }]}>
        jbeleren
      </HighlightText>,
    );

    const secondaryText = avatarItemOption.props()
      .secondaryText as ReactElement;

    expect(secondaryText.props.children).toEqual('Teammate');
  });

  it('should show only the name when no publicName is provided', () => {
    const userWithoutName = {
      id: 'abc-123',
      name: 'jbeleren',
      highlight: {
        name: [{ start: 2, end: 4 }],
        publicName: [],
      },
    };
    const component = shallowOption({ user: userWithoutName });
    const avatarItemOption = component.find(AvatarItemOption);
    expect(mockTextWrapper).toHaveBeenCalledWith(
      token('color.text', colors.N800),
    );

    const primaryText = avatarItemOption.props().primaryText as ReactElement[];

    expect(primaryText[0].props.children).toEqual(
      <HighlightText highlights={[{ start: 2, end: 4 }]}>
        jbeleren
      </HighlightText>,
    );
  });

  it('should show only name', () => {
    const userWithSamePublicName = {
      ...user,
      publicName: user.name,
    };
    const component = shallowOption({ user: userWithSamePublicName });
    const avatarItemOption = component.find(AvatarItemOption);
    expect(mockTextWrapper).toHaveBeenCalledWith(
      token('color.text', colors.N800),
    );

    const primaryText = avatarItemOption.props().primaryText as ReactElement[];

    expect(primaryText[0].key).toEqual('name');
    expect(primaryText[0].props.children).toEqual(
      <HighlightText>Jace Beleren</HighlightText>,
    );
  });

  it('should ignore blank spaces while comparing', () => {
    const userWithSamePublicName = {
      ...user,
      publicName: `  ${user.name}  `,
    };
    const component = shallowOption({ user: userWithSamePublicName });
    const avatarItemOption = component.find(AvatarItemOption);
    expect(mockTextWrapper).toHaveBeenCalledWith(
      token('color.text', colors.N800),
    );

    const primaryText = avatarItemOption.props().primaryText as ReactElement[];

    expect(primaryText[0].key).toEqual('name');
    expect(primaryText[0].props.children).toEqual(
      <HighlightText>Jace Beleren</HighlightText>,
    );
  });
});
