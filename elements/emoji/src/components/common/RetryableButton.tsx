/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { FormattedMessage } from 'react-intl-next';
import { css, jsx } from '@compiled/react';
import AkButton from '@atlaskit/button/new';
import Spinner from '@atlaskit/spinner';
import { Box } from '@atlaskit/primitives/compiled';
import { messages } from '../i18n';

const buttonSpinner = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginRight: '10px',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginLeft: '10px',
});

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
