/** @jsx jsx */
import React from 'react';

import { css, jsx, type Theme, useTheme } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import { h500 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import { messages } from '../i18n';

export type Props = {
  title?: React.ReactNode;
};
const headerWrapperStyles = css({
  display: 'flex',
  justifyContent: 'space-between',
});

export const getFormHeaderTitleStyles = (theme: Theme) =>
  css(h500(theme), {
    lineHeight: token('space.400', '32px'),
    marginRight: token('space.400', '32px'),
    marginTop: token('space.400', '32px'),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '> span': {
      fontSize: 'initial',
    },
  });

export const ShareHeader: React.FunctionComponent<Props> = ({ title }) => {
  const theme = useTheme();

  return (
    <div css={headerWrapperStyles}>
      <h1 css={getFormHeaderTitleStyles(theme)}>
        {title || <FormattedMessage {...messages.formTitle} />}
      </h1>
    </div>
  );
};
