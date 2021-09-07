import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { N200, N800 } from '@atlaskit/theme/colors';
import { AddOptionAvatar } from '../../../components/AddOptionAvatar';
import {
  AvatarItemOption,
  TextWrapper,
} from '../../../components/AvatarItemOption';
import { EmailOption, EmailOptionProps } from '../../../components/EmailOption';
import { Email, EmailType } from '../../../types';
import { renderProp } from '../_testUtils';

describe('EmailOption', () => {
  const shallowEmailOption = (props: EmailOptionProps) =>
    shallow(<EmailOption {...props} />);

  const email: Email = {
    type: EmailType,
    id: 'test@test.com',
    name: 'test@test.com',
    lozenge: 'EMAIL',
  };

  const suggestedEmail: Email = {
    type: EmailType,
    id: 'test@test.com',
    name: 'test@test.com',
    lozenge: 'EMAIL',
    suggestion: true,
  };

  it('should render AvatarItemOption with default message', () => {
    const component = shallowEmailOption({
      isSelected: false,
      email,
      emailValidity: 'VALID',
    });

    const formattedMessage = component.find(FormattedMessage);
    expect(formattedMessage).toHaveLength(1);
    const message = renderProp(formattedMessage, 'children', 'Invite');
    const avatarItemOption = message.find(AvatarItemOption);
    expect(avatarItemOption.props()).toMatchObject({
      avatar: <AddOptionAvatar label="Invite" />,
      primaryText: (
        <TextWrapper key="name" color={N800}>
          test@test.com
        </TextWrapper>
      ),
      secondaryText: <TextWrapper color={N200}>Invite</TextWrapper>,
      lozenge: {
        text: 'EMAIL',
      },
    });
  });

  it('should render AvatarItemOption for suggested emails', () => {
    const component = shallowEmailOption({
      isSelected: false,
      email: suggestedEmail,
      emailValidity: 'VALID',
    });

    const formattedMessage = component.find(FormattedMessage);
    expect(formattedMessage).toHaveLength(1);
    const message = renderProp(formattedMessage, 'children', 'Invite');
    const avatarItemOption = message.find(AvatarItemOption);
    expect(avatarItemOption.props()).toMatchObject({
      avatar: <AddOptionAvatar label="Invite" />,
      primaryText: (
        <TextWrapper key="name" color={N800}>
          test@test.com
        </TextWrapper>
      ),
      secondaryText: <TextWrapper color={N200}>Invite</TextWrapper>,
      lozenge: {
        text: 'EMAIL',
      },
    });
  });

  it('should override the default label', () => {
    const component = shallowEmailOption({
      isSelected: false,
      email,
      label: 'Add new user',
      emailValidity: 'VALID',
    });
    const avatarItemOption = component.find(AvatarItemOption);
    expect(avatarItemOption.props()).toMatchObject({
      avatar: <AddOptionAvatar label="Add new user" />,
      primaryText: (
        <TextWrapper key="name" color={N800}>
          test@test.com
        </TextWrapper>
      ),
      secondaryText: <TextWrapper color={N200}>Add new user</TextWrapper>,
    });
  });
});
