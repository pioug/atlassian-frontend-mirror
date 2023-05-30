/** @jsx jsx */
import React from 'react';

import { css, jsx, Theme, useTheme } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { h500 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { messages } from '../i18n';

export type Props = {
  title?: React.ReactNode;
};
const headerWrapperStyles = css`
  display: flex;
  justify-content: space-between;
`;

export const getFormHeaderTitleStyles = (theme: Theme) => css`
  ${h500(theme)}
  line-height: ${token('font.lineHeight.500', '32px')};
  margin-right: ${token('space.400', '32px')};
  margin-top: ${token('space.400', '32px')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  > span {
    font-size: initial;
  }
`;

export const ShareHeader: React.StatelessComponent<Props> = ({ title }) => {
  const theme = useTheme();

  return (
    <div css={headerWrapperStyles}>
      <h1 css={getFormHeaderTitleStyles(theme)}>
        {title || <FormattedMessage {...messages.formTitle} />}
      </h1>
    </div>
  );
};
