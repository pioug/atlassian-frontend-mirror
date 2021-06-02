import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { N40 } from '@atlaskit/theme/colors';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import Button from '@atlaskit/button/custom-theme-button';
import { messages } from '@atlaskit/media-ui';
// eslint-disable-next-line import/no-extraneous-dependencies
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ANALYTICS_MEDIA_CHANNEL } from '../util';

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
      testId="download-button"
      iconAfter={<DownloadIcon label={formatMessage(messages.download)} />}
      onKeyPress={(event) => event.stopPropagation()}
      onClick={(
        event: React.MouseEvent<HTMLElement>,
        analyticsEvent: UIAnalyticsEvent,
      ) => {
        analyticsEvent
          .update((payload) => ({
            ...payload,
            eventType: 'ui',
            actionSubjectId: 'mediaTableDownload',
          }))
          .fire(ANALYTICS_MEDIA_CHANNEL);

        onClick(event);
      }}
      theme={(current, themeProps) => ({
        buttonStyles: {
          ...current(themeProps).buttonStyles,
          minWidth: 'max-content',
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
