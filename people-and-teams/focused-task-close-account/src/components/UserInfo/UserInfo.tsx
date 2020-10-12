import React from 'react';
import Avatar from '@atlaskit/avatar';

import { User } from '../../types';
import * as Styled from './styles';

interface Props {
  user: User;
}

export class UserInfo extends React.Component<Props> {
  render() {
    const { user } = this.props;
    return (
      <Styled.UserInfoOuter>
        <Styled.Avatar>
          <Avatar size="large" src={user.avatarUrl} />
        </Styled.Avatar>
        <Styled.UserDetails>
          <Styled.UserName>{user.fullName}</Styled.UserName>
          <Styled.UserEmail>{user.email}</Styled.UserEmail>
        </Styled.UserDetails>
      </Styled.UserInfoOuter>
    );
  }
}

export default UserInfo;
