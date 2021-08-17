import EmailIcon from '@atlaskit/icon/glyph/email';
import { N200 } from '@atlaskit/theme/colors';
import { shallow } from 'enzyme';
import React from 'react';
import {
  AddOptionAvatar,
  AddOptionAvatarProps,
} from '../../../components/AddOptionAvatar';

describe('AddOptionAvatar', () => {
  const shallowAddOptionAvatar = (props: AddOptionAvatarProps) =>
    shallow(<AddOptionAvatar {...props} />);

  it('should render email Icon', () => {
    const component = shallowAddOptionAvatar({
      label: 'Invite',
      size: 'small',
    });

    const inviteIcon = component.find(EmailIcon);
    expect(inviteIcon).toHaveLength(1);
    expect(inviteIcon.props()).toMatchObject({
      label: 'Invite',
      size: 'small',
      primaryColor: N200,
    });
  });
});
