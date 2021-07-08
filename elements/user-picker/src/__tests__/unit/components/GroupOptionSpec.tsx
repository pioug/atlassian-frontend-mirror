import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { N800, N200, B400 } from '@atlaskit/theme/colors';
import PeopleIcon from '@atlaskit/icon/glyph/people';

import {
  AvatarItemOption,
  TextWrapper,
} from '../../../components/AvatarItemOption';
import { HighlightText } from '../../../components/HighlightText';
import {
  GroupOption,
  GroupOptionProps,
  GroupOptionIconWrapper,
} from '../../../components/GroupOption';
import { Group } from '../../../types';

describe('GroupOption', () => {
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
    expect(avatarItemOption.props()).toMatchObject({
      avatar: (
        <GroupOptionIconWrapper>
          <PeopleIcon label="group-icon" size="medium" />
        </GroupOptionIconWrapper>
      ),
      primaryText: [
        <TextWrapper key="name" color={N800}>
          <HighlightText>dead-jedi-admins</HighlightText>
        </TextWrapper>,
      ],
      secondaryText: (
        <TextWrapper color={N200}>
          <FormattedMessage
            id="fabric.elements.user-picker.group.byline"
            defaultMessage="Admin-managed group"
            description="Byline for admin-managed groups"
          />
        </TextWrapper>
      ),
    });
  });

  it('should render GroupOption in selected state', () => {
    const component = shallowOption({ isSelected: true });
    const avatarItemOption = component.find(AvatarItemOption);
    expect(avatarItemOption.props()).toMatchObject(
      expect.objectContaining({
        primaryText: [
          <TextWrapper key="name" color={B400}>
            <HighlightText>dead-jedi-admins</HighlightText>
          </TextWrapper>,
        ],
        secondaryText: (
          <TextWrapper color={B400}>
            <FormattedMessage
              id="fabric.elements.user-picker.group.byline"
              defaultMessage="Admin-managed group"
              description="Byline for admin-managed groups"
            />
          </TextWrapper>
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
    expect(avatarItemOption.prop('primaryText')).toEqual([
      <TextWrapper key="name" color={N800}>
        <HighlightText highlights={[testHighlightRange]}>
          dead-jedi-admins
        </HighlightText>
      </TextWrapper>,
    ]);
  });
});
