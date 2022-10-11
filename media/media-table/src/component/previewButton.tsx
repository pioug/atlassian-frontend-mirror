import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { injectIntl, WrappedComponentProps } from 'react-intl-next';
import { N40 } from '@atlaskit/theme/colors';
import EditorFilePreviewIcon from '@atlaskit/icon/glyph/editor/file-preview';
import Button from '@atlaskit/button/custom-theme-button';
import { messages } from '@atlaskit/media-ui';
// eslint-disable-next-line import/no-extraneous-dependencies
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ANALYTICS_MEDIA_CHANNEL } from '../util';

interface Props {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const MediaPreviewButton = (props: Props & WrappedComponentProps) => {
  const {
    onClick,
    intl: { formatMessage },
  } = props;

  return (
    <Button
      appearance="subtle"
      testId="preview-button"
      iconAfter={
        <EditorFilePreviewIcon label={formatMessage(messages.preview)} />
      }
      onKeyPress={(event) => event.stopPropagation()}
      onClick={(
        event: React.MouseEvent<HTMLElement>,
        analyticsEvent: UIAnalyticsEvent,
      ) => {
        analyticsEvent
          .update((payload) => ({
            ...payload,
            eventType: 'ui',
            actionSubjectId: 'mediaTablePreview',
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

export default injectIntl(MediaPreviewButton);
