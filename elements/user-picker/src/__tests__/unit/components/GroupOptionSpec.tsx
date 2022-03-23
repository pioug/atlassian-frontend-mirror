import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl-next';

import { N800, N200, B400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import {
  AvatarItemOption,
  textWrapper,
} from '../../../components/AvatarItemOption';
import { HighlightText } from '../../../components/HighlightText';
import {
  GroupOption,
  GroupOptionProps,
} from '../../../components/GroupOption/main';
import { Group } from '../../../types';

jest.mock('../../../components/AvatarItemOption', () => ({
  ...(jest.requireActual('../../../components/AvatarItemOption') as any),
  textWrapper: jest.fn(),
}));

describe('GroupOption', () => {
  const mockTextWrapper = textWrapper as jest.Mock;

  afterEach(() => {
    jest.resetAllMocks();
  });

  const group: Group = {
    id: 'group-66',
    name: 'dead-jedi-admins',
    type: 'group',
  };

  const shallowOption = (props: Partial<GroupOptionProps> = {}) =>
    shallow(<GroupOption isSelected={false} group={group} {...props} />);

  it('should render GroupOption component', () => {
    const component = shallowOption();
    const avatarItemOption = component.find(AvatarItemOption);
    expect(mockTextWrapper).toHaveBeenCalledWith(token('color.text', N800));
    expect(mockTextWrapper).toHaveBeenCalledWith(
      token('color.text.subtlest', N200),
    );
    // emotion css doesn't play well with component equality
    expect(avatarItemOption.prop('avatar')).toMatchInlineSnapshot(`
      <span
        css="unknown styles"
      >
        <PeopleIcon
          label="group-icon"
          size="medium"
        />
      </span>
    `);
    expect(avatarItemOption.prop('primaryText')).toEqual([
      <span key="name">
        <HighlightText>dead-jedi-admins</HighlightText>
      </span>,
    ]);
    expect(avatarItemOption.prop('secondaryText')).toEqual(
      <span>
        <FormattedMessage
          id="fabric.elements.user-picker.group.byline"
          defaultMessage="Admin-managed group"
          description="Byline for admin-managed groups"
        />
      </span>,
    );
  });

  it('should render GroupOption in selected state', () => {
    const component = shallowOption({ isSelected: true });
    const avatarItemOption = component.find(AvatarItemOption);
    expect(mockTextWrapper).toHaveBeenNthCalledWith(
      2,
      token('color.text.selected', B400),
    );
    expect(avatarItemOption.props()).toMatchObject(
      expect.objectContaining({
        primaryText: [
          <span key="name">
            <HighlightText>dead-jedi-admins</HighlightText>
          </span>,
        ],
        secondaryText: (
          <span>
            <FormattedMessage
              id="fabric.elements.user-picker.group.byline"
              defaultMessage="Admin-managed group"
              description="Byline for admin-managed groups"
            />
          </span>
        ),
      }),
    );
  });

  it('should highlight the primaryText', () => {
    const testHighlightRange = { start: 4, end: 11 };
    const groupWithHighlight = {
      ...group,
      highlight: {
        name: [testHighlightRange],
      },
    };
    const component = shallowOption({ group: groupWithHighlight });
    const avatarItemOption = component.find(AvatarItemOption);
    expect(mockTextWrapper).toHaveBeenCalledWith(token('color.text', N800));
    expect(avatarItemOption.prop('primaryText')).toEqual([
      <span key="name">
        <HighlightText highlights={[testHighlightRange]}>
          dead-jedi-admins
        </HighlightText>
      </span>,
    ]);
  });
});
