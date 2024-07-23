/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { FormattedMessage } from 'react-intl-next';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import AkButton from '@atlaskit/button/new';
import Spinner from '@atlaskit/spinner';
import { Box } from '@atlaskit/primitives';
import { messages } from '../i18n';
import { buttonSpinner } from './styles';

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
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
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
				<Box paddingInlineEnd="space.050">
					<AkButton
						appearance="warning"
						onClick={onSubmit}
						testId={retryUploadButtonTestId}
						aria-describedby={ariaDescribedBy}
						aria-labelledby={ariaLabelledBy}
						autoFocus
					>
						{retryLabel}
					</AkButton>
				</Box>
			)}
		</FormattedMessage>
	);
};

const UploadButton = (props: Props) => {
	const { appearance, onSubmit, label, ariaLabelledBy, ariaDescribedBy } = props;

	return (
		<Box paddingInlineEnd="space.050">
			<AkButton
				appearance={appearance as any}
				onClick={onSubmit}
				testId={uploadEmojiButtonTestId}
				aria-describedby={ariaDescribedBy}
				aria-labelledby={ariaLabelledBy}
				autoFocus
			>
				{label}
			</AkButton>
		</Box>
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
