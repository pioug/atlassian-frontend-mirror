/** @jsx jsx */
import React from 'react';

import { css, jsx, Theme, useTheme } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { gridSize } from '@atlaskit/theme/constants';
import { h500 } from '@atlaskit/theme/typography';

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
  line-height: ${gridSize() * 4}px;
  margin-right: ${gridSize() * 4}px;
  margin-top: ${gridSize() * 4}px;
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
