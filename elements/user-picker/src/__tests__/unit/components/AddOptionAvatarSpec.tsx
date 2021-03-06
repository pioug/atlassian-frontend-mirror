import InviteTeamIcon from '@atlaskit/icon/glyph/invite-team';
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

  it('should render add avatar Icon', () => {
    const component = shallowAddOptionAvatar({
      label: 'Invite',
      size: 'small',
    });

    const inviteIcon = component.find(InviteTeamIcon);
    expect(inviteIcon).toHaveLength(1);
    expect(inviteIcon.props()).toMatchObject({
      label: 'Invite',
      size: 'small',
      primaryColor: 'white',
    });
  });

  it('should render add avatar Icon when it is a suggestion', () => {
    const component = shallowAddOptionAvatar({
      label: 'Invite',
      size: 'small',
      suggestion: true,
    });

    const inviteIcon = component.find(InviteTeamIcon);
    expect(inviteIcon).toHaveLength(1);
    expect(inviteIcon.props()).toMatchObject({
      label: 'Invite',
      size: 'small',
      primaryColor: N200,
    });
  });
});
