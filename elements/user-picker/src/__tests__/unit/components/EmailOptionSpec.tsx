import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { AddOptionAvatar } from '../../../components/AddOptionAvatar';
import { AvatarItemOption } from '../../../components/AvatarItemOption';
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
      primaryText: 'test@test.com',
      secondaryText: 'Invite',
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
      primaryText: 'test@test.com',
      secondaryText: 'Add new user',
    });
  });
});
