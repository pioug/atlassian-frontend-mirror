import EmailIcon from '@atlaskit/icon/glyph/email';
import { N40, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import React from 'react';
import styled from 'styled-components';

const EmailAvatarWrapper = styled.span`
  padding: ${(props: { isLozenge?: boolean }) => (props.isLozenge ? 0 : 4)}px;

  background-color: ${token('color.background.neutral', N40)};
  border-radius: 50%;
  display: flex;
  align-items: center;
`;

export type AddOptionAvatarProps = {
  label: string;
  isLozenge?: boolean;
};

export const AddOptionAvatar: React.FunctionComponent<AddOptionAvatarProps> = ({
  isLozenge,
  label,
}) => {
  return (
    <EmailAvatarWrapper isLozenge={isLozenge}>
      <EmailIcon
        label={label}
        size={isLozenge ? 'small' : 'medium'}
        primaryColor={token('color.text.subtle', N500)}
      />
    </EmailAvatarWrapper>
  );
};
