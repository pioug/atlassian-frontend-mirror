/** @jsx jsx */
import { FC } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { jsx } from '@emotion/react';
import AkButton from '@atlaskit/button/custom-theme-button';
import Spinner from '@atlaskit/spinner';
import { messages } from '../i18n';
import { buttonSpinner, uploadEmojiButton, uploadRetryButton } from './styles';

export interface Props {
  label: string;
  appearance: string;
  error: boolean;
  onSubmit: () => void;
  loading: boolean;
}

export const retryUploadButtonTestId = 'retry-upload-button';
export const uploadEmojiButtonTestId = 'upload-emoji-button';

const LoadingSpinner: FC = () => {
  return (
    <span css={buttonSpinner}>
      <Spinner />
    </span>
  );
};

const RetryButton: FC<Props> = (props) => {
  const { onSubmit } = props;

  return (
    <FormattedMessage {...messages.retryLabel}>
      {(retryLabel) => (
        <AkButton
          css={uploadRetryButton}
          appearance="warning"
          onClick={onSubmit}
          testId={retryUploadButtonTestId}
        >
          {retryLabel}
        </AkButton>
      )}
    </FormattedMessage>
  );
};

const UploadButton: FC<Props> = (props) => {
  const { appearance, onSubmit, label } = props;
  return (
    <AkButton
      css={uploadEmojiButton}
      appearance={appearance as any}
      onClick={onSubmit}
      testId={uploadEmojiButtonTestId}
    >
      {label}
    </AkButton>
  );
};

const RetryableButton: FC<Props> = (props) => {
  const { loading, error } = props;

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <RetryButton {...props} />;
  }

  return <UploadButton {...props} />;
};

export default RetryableButton;
