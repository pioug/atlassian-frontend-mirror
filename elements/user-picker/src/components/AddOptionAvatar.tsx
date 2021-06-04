import InviteTeamIcon from '@atlaskit/icon/glyph/invite-team';
import MentionIcon from '@atlaskit/icon/glyph/mention';
import { N50, N200 } from '@atlaskit/theme/colors';
import React from 'react';
import styled from 'styled-components';

const AddOptionAvatarWrapper = styled.span<{ suggestion?: boolean }>`
  color: black;
  padding: 2px;

  background-color: ${N50};
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
  const Icon = invalidOption ? MentionIcon : InviteTeamIcon;
  return (
    <AddOptionAvatarWrapper>
      <Icon
        label={label}
        size={size}
        primaryColor={suggestion ? N200 : 'white'}
      />
    </AddOptionAvatarWrapper>
  );
};

AddOptionAvatar.defaultProps = {
  size: 'large',
};
