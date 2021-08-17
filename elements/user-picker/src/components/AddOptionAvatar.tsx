import EmailIcon from '@atlaskit/icon/glyph/email';
import MentionIcon from '@atlaskit/icon/glyph/mention';
import { N40, N50, N200 } from '@atlaskit/theme/colors';
import React from 'react';
import styled from 'styled-components';

const AddOptionAvatarWrapper = styled.span`
  color: black;
  padding: 2px;

  background-color: ${N50};
  border-radius: 50%;
`;

const EmailAvatarWrapper = styled.span`
  color: black;
  padding: 2px;

  background-color: ${N40};
  border-radius: 50%;
`;

export type AddOptionAvatarProps = {
  label: string;
  size?: 'small' | 'medium' | 'large';
  suggestion?: boolean;
  invalidOption?: boolean;
};

export const AddOptionAvatar: React.FunctionComponent<AddOptionAvatarProps> = ({
  size,
  label,
  suggestion,
  invalidOption,
}) => {
  if (invalidOption) {
    return (
      <AddOptionAvatarWrapper>
        <MentionIcon
          label={label}
          size={size}
          primaryColor={suggestion ? N200 : 'white'}
        />
      </AddOptionAvatarWrapper>
    );
  }

  return (
    <EmailAvatarWrapper>
      <EmailIcon label={label} size={size} primaryColor={N200} />
    </EmailAvatarWrapper>
  );
};

AddOptionAvatar.defaultProps = {
  size: 'large',
};
