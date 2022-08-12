/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/custom-theme-button';
import { CustomThemeButtonProps } from '@atlaskit/button/types';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const integrationButtonCopyWrapperStyle = css`
  display: flex;
  justify-content: left;
`;

const integrationIconWrapperStyle = css`
  margin: 1px 8px 0 0;
`;

type Props = CustomThemeButtonProps & {
  text: React.ReactNode;
  IntegrationIcon: React.ComponentType;
  textColor?: string;
};

const IntegrationButton: React.FC<Props> = (props) => {
  const { text, textColor, IntegrationIcon, ...restProps } = props;
  return (
    <Button {...restProps}>
      <span
        css={integrationButtonCopyWrapperStyle}
        style={{ color: textColor || token('color.text', N500) }}
      >
        <span css={integrationIconWrapperStyle}>
          <IntegrationIcon />
        </span>
        <span>{text}</span>
      </span>
    </Button>
  );
};

IntegrationButton.displayName = 'IntegrationButton';

export default IntegrationButton;
