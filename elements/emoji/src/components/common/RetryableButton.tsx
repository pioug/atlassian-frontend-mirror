/** @jsx jsx */
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
  ariaDescribedBy?: string;
  ariaLabelledBy?: string;
}

export const retryUploadButtonTestId = 'retry-upload-button';
export const uploadEmojiButtonTestId = 'upload-emoji-button';

const LoadingSpinner = () => {
  return (
    <span css={buttonSpinner}>
      <Spinner />
    </span>
  );
};

const RetryButton = (props: Props) => {
  const { onSubmit, ariaLabelledBy, ariaDescribedBy } = props;

  return (
    <FormattedMessage {...messages.retryLabel}>
      {(retryLabel) => (
        <AkButton
          css={uploadRetryButton}
          appearance="warning"
          onClick={onSubmit}
          testId={retryUploadButtonTestId}
          aria-describedby={ariaDescribedBy}
          aria-labelledby={ariaLabelledBy}
          autoFocus
        >
          {retryLabel}
        </AkButton>
      )}
    </FormattedMessage>
  );
};

const UploadButton = (props: Props) => {
  const { appearance, onSubmit, label, ariaLabelledBy, ariaDescribedBy } =
    props;

  return (
    <AkButton
      css={uploadEmojiButton}
      appearance={appearance as any}
      onClick={onSubmit}
      testId={uploadEmojiButtonTestId}
      aria-describedby={ariaDescribedBy}
      aria-labelledby={ariaLabelledBy}
      autoFocus
    >
      {label}
    </AkButton>
  );
};

const RetryableButton = (props: Props) => {
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
