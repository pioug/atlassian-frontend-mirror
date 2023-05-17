import React from 'react';

import styled from '@emotion/styled';
import { FormattedMessage } from 'react-intl-next';

import Avatar, { SizeType } from '@atlaskit/avatar';
import { User } from '@atlaskit/linking-types';

import { userTypeMessages } from './messages';

const UserWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  margin-right: 5px;
`;

interface UserProps extends User {
  children?: React.ReactElement;
  testId?: string;
  avatarSize?: SizeType;
}

export const USER_TYPE_TEST_ID = 'link-datasource-render-type--user';

const UserType = ({
  avatarSource,
  avatarSize = 'small',
  displayName,
  testId = USER_TYPE_TEST_ID,
  children,
}: UserProps) => {
  return (
    <UserWrapper data-testid={testId}>
      <AvatarWrapper>
        <Avatar appearance="circle" size={avatarSize} src={avatarSource} />
      </AvatarWrapper>
      {children || displayName || (
        <FormattedMessage {...userTypeMessages.userDefaultdisplayNameValue} />
      )}
    </UserWrapper>
  );
};

export default UserType;
