import React from 'react';
import { ReactNode } from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { ErrorMessageWrapper, ErrorImage } from './styled';
import { FileState } from '@atlaskit/media-client';
import { messages as i18nMessages } from '@atlaskit/media-ui';
import { cannotViewFile, errorLoadingFile } from './error-images';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { mediaPreviewFailedEvent } from './analytics/item-viewer';
import {
  GasPayload,
  GasScreenEventPayload,
} from '@atlaskit/analytics-gas-types';
import { channel } from '../newgen/analytics';

type MessagesType<Key extends string> = { [k in Key]: ReactNode };

export type ErrorName =
  | 'previewFailed'
  | 'metadataFailed'
  | 'unsupported'
  | 'idNotFound'
  | 'noPDFArtifactsFound'
  | 'failedProcessing';

export type Props = Readonly<{
  error: MediaViewerError;
  children?: ReactNode;
}>;
export type FormatMessageFn = (
  messageDescriptor: FormattedMessage.MessageDescriptor,
) => string;

const errorLoadingFileImage = (formatMessage: FormatMessageFn) => (
  <ErrorImage
    src={errorLoadingFile}
    alt={formatMessage(i18nMessages.error_loading_file)}
  />
);
const cannotViewFileImage = (formatMessage: FormatMessageFn) => (
  <ErrorImage
    src={cannotViewFile}
    alt={formatMessage(i18nMessages.error_generating_preview)}
  />
);

const getErrorMessage = (
  formatMessage: FormatMessageFn,
  errorName: ErrorName,
) => {
  const messages: MessagesType<ErrorName> = {
    metadataFailed: (
      <div>
        {errorLoadingFileImage(formatMessage)}
        <p>
          <FormattedMessage {...i18nMessages.something_went_wrong} />
        </p>
        <p>
          <FormattedMessage {...i18nMessages.might_be_a_hiccup} />
        </p>
      </div>
    ),

    previewFailed: (
      <div>
        {cannotViewFileImage(formatMessage)}
        <p>
          <FormattedMessage {...i18nMessages.couldnt_generate_preview} />
        </p>
      </div>
    ),

    unsupported: (
      <div>
        {cannotViewFileImage(formatMessage)}
        <p>
          <FormattedMessage {...i18nMessages.cant_preview_file_type} />
        </p>
      </div>
    ),

    idNotFound: (
      <div>
        {errorLoadingFileImage(formatMessage)}
        <p>
          <FormattedMessage {...i18nMessages.item_not_found_in_list} />
        </p>
      </div>
    ),

    noPDFArtifactsFound: (
      <div>
        {cannotViewFileImage(formatMessage)}
        <p>
          <FormattedMessage {...i18nMessages.no_pdf_artifacts} />
        </p>
      </div>
    ),

    failedProcessing: (
      <div>
        {errorLoadingFileImage(formatMessage)}
        <p>
          <FormattedMessage {...i18nMessages.something_went_wrong} />
        </p>
        <p>
          <FormattedMessage {...i18nMessages.might_be_a_hiccup} />
        </p>
      </div>
    ),
  };

  return messages[errorName];
};

export class MediaViewerError {
  constructor(
    readonly errorName: ErrorName,
    readonly fileState?: FileState,
    readonly innerError?: Error,
  ) {}
}

export const createError = (
  name: ErrorName,
  innerError?: Error,
  fileState?: FileState,
): MediaViewerError => {
  return new MediaViewerError(name, fileState, innerError);
};

export class ErrorMessage extends React.Component<
  Props & InjectedIntlProps & WithAnalyticsEventsProps,
  {}
> {
  private fireAnalytics = (payload: GasPayload | GasScreenEventPayload) => {
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      const ev = createAnalyticsEvent(payload);
      ev.fire(channel);
    }
  };

  componentDidMount() {
    const {
      error: { errorName: failReason, fileState },
    } = this.props;
    const event = mediaPreviewFailedEvent(failReason, fileState);
    this.fireAnalytics(event);
  }

  render() {
    const {
      intl: { formatMessage },
    } = this.props;
    const errorMessage = getErrorMessage(
      formatMessage,
      this.props.error.errorName,
    );

    return (
      <ErrorMessageWrapper data-testid="media-viewer-error">
        {errorMessage}
        {this.props.children}
      </ErrorMessageWrapper>
    );
  }
}

export default withAnalyticsEvents()(injectIntl(ErrorMessage));
