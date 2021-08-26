import React from 'react';
import { ReactNode } from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { messages as i18nMessages } from '@atlaskit/media-ui';
import { FileState } from '@atlaskit/media-client';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { ErrorMessageWrapper, ErrorImage } from './styled';
import { errorLoadingFile } from './error-images';
import { fireAnalytics } from './analytics';
import {
  PrimaryErrorReason,
  SecondaryErrorReason,
  MediaViewerError,
  getPrimaryErrorReason,
  getSecondaryErrorReason,
} from './errors';
import { createLoadFailedEvent } from './analytics/events/operational/loadFailed';
import { createPreviewUnsupportedEvent } from './analytics/events/operational/previewUnsupported';

export type Props = Readonly<{
  error: MediaViewerError;
  supressAnalytics?: boolean;
  fileId: string;
  fileState?: FileState;
  children?: ReactNode;
}>;

export type FormatMessageFn = (
  messageDescriptor: FormattedMessage.MessageDescriptor,
) => string;

type ErrorMessageInfo = {
  icon: JSX.Element;
  messages: Array<FormattedMessage.MessageDescriptor>;
};

const errorLoadingFileImage = (formatMessage: FormatMessageFn) => (
  <ErrorImage
    src={errorLoadingFile}
    alt={formatMessage(i18nMessages.error_loading_file)}
  />
);

export const errorReasonToMessages: Array<[
  PrimaryErrorReason | SecondaryErrorReason,
  FormattedMessage.MessageDescriptor,
]> = [
  ['serverRateLimited', i18nMessages.might_be_a_hiccup],
  ['invalidFileId', i18nMessages.item_not_found_in_list],
  [
    'itemviewer-file-failed-processing-status',
    i18nMessages.image_format_invalid_error,
  ],
  ['archiveviewer-read-binary', i18nMessages.zip_entry_load_fail],
  ['archiveviewer-create-url', i18nMessages.zip_entry_load_fail],
  ['archiveviewer-missing-name-src', i18nMessages.zip_entry_load_fail],
  [
    'archiveviewer-encrypted-entry',
    i18nMessages.couldnt_generate_encrypted_entry_preview,
  ],
];

export const getErrorMessageFromError = (
  error: MediaViewerError,
): FormattedMessage.MessageDescriptor | undefined => {
  const matchingRow = errorReasonToMessages.find(
    (row) =>
      row[0] === getPrimaryErrorReason(error) ||
      row[0] === getSecondaryErrorReason(error),
  );
  return matchingRow ? matchingRow[1] : undefined;
};

export class ErrorMessage extends React.Component<
  Props & InjectedIntlProps & WithAnalyticsEventsProps,
  {}
> {
  private getErrorInfo(): ErrorMessageInfo {
    const {
      intl: { formatMessage },
      error,
    } = this.props;
    const errorInfo = {
      icon: errorLoadingFileImage(formatMessage),
      messages: [
        i18nMessages.something_went_wrong,
        i18nMessages.couldnt_generate_preview,
      ],
    };
    const message = getErrorMessageFromError(error);
    if (message) {
      errorInfo.messages.push(message);
    }
    return errorInfo;
  }

  componentDidMount() {
    const { props } = this;
    const { supressAnalytics, error, fileState, fileId } = props;
    if (supressAnalytics !== true) {
      const payload = ErrorMessage.getEventPayload(error, fileId, fileState);
      fireAnalytics(payload, props);
    }
  }

  static getEventPayload(
    error: MediaViewerError,
    fileId: string,
    fileState?: FileState,
  ) {
    if (fileState && getPrimaryErrorReason(error) === 'unsupported') {
      // this is not an SLI, its just a useful metric for unsupported
      return createPreviewUnsupportedEvent(fileState);
    } else {
      return createLoadFailedEvent(fileId, error, fileState);
    }
  }

  render() {
    const errorInfo = this.getErrorInfo();

    return (
      <ErrorMessageWrapper data-testid="media-viewer-error">
        <div>
          {errorInfo.icon}
          {errorInfo.messages.map((formatMessage, i) => (
            <p key={`p${i}`}>
              <FormattedMessage {...formatMessage} />
            </p>
          ))}
        </div>
        {/** todo: resolve error tip UX BMPT-1214 */}
        {this.props.children}
      </ErrorMessageWrapper>
    );
  }
}

const ErroMsg = withAnalyticsEvents()(injectIntl(ErrorMessage));
export default ErroMsg;
