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
import { getPrimaryErrorReason, AvailableErrorReason } from './errors';
import { createLoadFailedEvent } from './analytics/events/operational/loadFailed';
import { createPreviewUnsupportedEvent } from './analytics/events/operational/previewUnsupported';

export type Props = Readonly<{
  error: Error;
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

export const errorReasonToMessageMap: Array<[
  AvailableErrorReason,
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

export const getErrorMessageFromErrorReason = (
  errorReason: AvailableErrorReason,
): FormattedMessage.MessageDescriptor | undefined => {
  const matchingRow = errorReasonToMessageMap.find(
    row => row[0] === errorReason,
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
    const failReason = getPrimaryErrorReason(error);
    const errorInfo = {
      icon: errorLoadingFileImage(formatMessage),
      messages: [
        i18nMessages.something_went_wrong,
        i18nMessages.couldnt_generate_preview,
      ],
    };
    const message = getErrorMessageFromErrorReason(failReason);
    if (message) {
      errorInfo.messages.push(message);
    }
    return errorInfo;
  }

  componentDidMount() {
    const { error, fileState, supressAnalytics, fileId } = this.props;
    if (supressAnalytics !== true) {
      if (fileState && getPrimaryErrorReason(error) === 'unsupported') {
        fireAnalytics(createPreviewUnsupportedEvent(fileState), this.props);
      } else {
        fireAnalytics(
          createLoadFailedEvent(fileId, error, fileState),
          this.props,
        );
      }
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
