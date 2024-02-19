/** @jsx jsx */
import EmailIcon from '@atlaskit/icon/glyph/email';
import { N40, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { css, jsx } from '@emotion/react';
import React from 'react';

const getEmailAvatarWrapperStyle = (isLozenge?: boolean) => {
  const padding = isLozenge
    ? `${token('space.0', '0px')}`
    : `${token('space.050', '4px')}`;

  return css({
    padding: padding,
    backgroundColor: token('color.background.neutral', N40),
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
  });
};

export type AddOptionAvatarProps = {
  label: string;
  isLozenge?: boolean;
};

export const AddOptionAvatar: React.FunctionComponent<AddOptionAvatarProps> = ({
  isLozenge,
  label,
}) => {
  return (
    <div css={getEmailAvatarWrapperStyle(isLozenge)}>
      <EmailIcon
        label={label}
        size={isLozenge ? 'small' : 'medium'}
        primaryColor={token('color.text.subtle', N500)}
      />
    </div>
  );
};
