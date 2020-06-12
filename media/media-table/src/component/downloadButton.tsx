import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { N40 } from '@atlaskit/theme/colors';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import Button from '@atlaskit/button';
import { messages } from '@atlaskit/media-ui';

interface Props {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const MediaDownloadButton = (props: Props & InjectedIntlProps) => {
  const {
    onClick,
    intl: { formatMessage },
  } = props;

  return (
    <Button
      appearance="subtle"
      iconAfter={<DownloadIcon label={formatMessage(messages.download)} />}
      onClick={onClick}
      theme={(current, themeProps) => ({
        buttonStyles: {
          ...current(themeProps).buttonStyles,
          minWidth: 'max-content',
          marginRight: '4px',
          '&:hover': {
            background: N40,
          },
        },
        spinnerStyles: current(themeProps).spinnerStyles,
      })}
    />
  );
};

export default injectIntl(MediaDownloadButton);
