/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { PureComponent } from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import AkButton from '@atlaskit/button/standard-button';
import Heading from '@atlaskit/heading';
import { Stack } from '@atlaskit/primitives/compiled';
import { FormattedMessage, injectIntl, type WrappedComponentProps } from 'react-intl-next';
import { customCategory } from '../../util/constants';
import type { EmojiDescription, Message } from '../../types';
import { messages } from '../i18n';
import Emoji from './Emoji';
import EmojiErrorMessage from './EmojiErrorMessage';
import { UploadStatus } from './internal-types';
import RetryableButton from './RetryableButton';

const bigEmojiPreview = css({
	paddingLeft: token('space.050', '4px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	img: {
		maxHeight: '40px',
		maxWidth: '100px',
	},
});

const uploadAddRow = css({
	display: 'flex',
	justifyContent: 'flex-end',
	alignItems: 'center',
	paddingTop: token('space.100'),
});

const uploadPreview = css({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	backgroundColor: token('color.background.neutral'),
	borderRadius: token('radius.small', '3px'),
	paddingTop: token('space.150'),
	paddingRight: token('space.150'),
	paddingBottom: token('space.150'),
	paddingLeft: token('space.150'),
});

const uploadPreviewFooter = css({
	display: 'flex',
	flexDirection: 'column',
	paddingTop: token('space.100'),
	paddingRight: token('space.100'),
	paddingBottom: token('space.100'),
	paddingLeft: token('space.100'),
});

const uploadPreviewText = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	img: {
		maxHeight: '20px',
		maxWidth: '50px',
	},
});

export interface EmojiUploadPreviewProps {
	errorMessage?: Message;
	name: string;
	onAddEmoji: () => void;
	onUploadCancelled: () => void;
	previewImage: string;
	uploadStatus?: UploadStatus;
}

export const uploadPreviewTestId = 'upload-preview';
export const cancelUploadButtonTestId = 'cancel-upload-button';
const addEmojiPreviewDescriptionId = 'fabric.emoji.preview.description.id';

class EmojiUploadPreview extends PureComponent<
	EmojiUploadPreviewProps & WrappedComponentProps,
	{}
> {
	render() {
		const { name, previewImage, uploadStatus, errorMessage, onAddEmoji, onUploadCancelled, intl } =
			this.props;
		const { formatMessage } = intl;

		let emojiComponent;

		if (previewImage) {
			const emoji: EmojiDescription = {
				shortName: `:${name}:`,
				type: customCategory,
				category: customCategory,
				representation: {
					imagePath: previewImage,
					width: 24,
					height: 24,
				},
				searchable: true,
			};

			emojiComponent = <Emoji emoji={emoji} />;
		}

		const uploading = uploadStatus === UploadStatus.Uploading;
		const retryableButtonLabel = errorMessage
			? formatMessage(messages.retryLabel)
			: formatMessage(messages.addEmojiLabel);

		return (
			<div css={uploadPreviewFooter}>
				<div css={uploadPreview} data-testid={uploadPreviewTestId}>
					<Stack space="space.050">
						<Heading size="xsmall">
							<FormattedMessage {...messages.emojiPreviewTitle} />
						</Heading>
						<div id={addEmojiPreviewDescriptionId} css={uploadPreviewText}>
							<FormattedMessage {...messages.emojiPreview} values={{ emoji: emojiComponent }} />
						</div>
					</Stack>
					<div css={bigEmojiPreview}>{emojiComponent}</div>
				</div>
				<div css={uploadAddRow}>
					{!uploading && errorMessage ? (
						<EmojiErrorMessage errorStyle="preview" message={errorMessage} tooltip />
					) : null}
					<RetryableButton
						label={retryableButtonLabel}
						onSubmit={onAddEmoji}
						appearance="primary"
						loading={uploading}
						error={!!errorMessage}
						ariaDescribedBy={addEmojiPreviewDescriptionId}
					/>
					<AkButton
						onClick={onUploadCancelled}
						appearance="subtle"
						isDisabled={uploading}
						testId={cancelUploadButtonTestId}
					>
						<FormattedMessage {...messages.cancelLabel} />
					</AkButton>
				</div>
			</div>
		);
	}
}

export default injectIntl(EmojiUploadPreview);
