/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Component, type ComponentType, type FC } from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import {
	FormattedMessage,
	injectIntl,
	type WithIntlProps,
	type WrappedComponentProps,
} from 'react-intl';
import AkButton from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import { Box, Text } from '@atlaskit/primitives/compiled';
import FocusLock from 'react-focus-lock';
import type { EmojiDescription } from '../../types';
import FeatureGates from '@atlaskit/feature-gate-js-client';
import { messages } from '../i18n';
import CachingEmoji from './CachingEmoji';
import EmojiErrorMessage, { emojiErrorScreenreaderTestId } from './EmojiErrorMessage';
import RetryableButton from './RetryableButton';
import VisuallyHidden from '@atlaskit/visually-hidden';

const deleteFooter = css({
	display: 'flex',
	height: '40px',
	alignItems: 'center',
	justifyContent: 'space-between',
	font: token('font.body'),

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	img: {
		maxHeight: '32px',
		maxWidth: '72px',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.emoji-submit-delete': {
		width: '84px',
		fontWeight: token('font.weight.bold'),
		marginRight: token('space.050'),
	},
});

const deletePreview = css({
	height: '100px',
	paddingTop: token('space.100'),
	paddingRight: token('space.100'),
	paddingBottom: token('space.100'),
	paddingLeft: token('space.100'),
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'flex-end',
});

const deleteText = css({
	height: '64px',
});

const previewButtonGroup = css({
	display: 'flex',
});

const deletePreviewNew = css({
	display: 'flex',
	flexDirection: 'column',
	gap: token('space.150'),
	minHeight: '390px',
	paddingTop: token('space.150'),
	paddingRight: token('space.200'),
	paddingBottom: token('space.150'),
	paddingLeft: token('space.200'),
	boxSizing: 'border-box',
});

const deleteTextSection = css({
	display: 'flex',
	flexDirection: 'column',
	gap: token('space.050'),
	alignItems: 'flex-start',
	textAlign: 'left',
});

const emojiPreviewLargeBox = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flex: '1 1 auto',
	borderRadius: token('radius.xxlarge'),
	backgroundColor: token('color.background.danger'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	img: {
		width: '72px',
		height: '72px',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	span: {
		font: token('font.body.small'),
	},
});

const deleteButtonGroup = css({
	display: 'flex',
	gap: token('space.100'),
	alignItems: 'center',
	justifyContent: 'flex-end',
	marginTop: token('space.150'),
	paddingBottom: token('space.150'),
});

export interface OnDeleteEmoji {
	(emoji: EmojiDescription): Promise<boolean>;
}

export const emojiDeletePreviewTestId = 'emoji-delete-preview';
const deleteEmojiLabelId = 'fabric.emoji.delete.label.id';

export interface Props {
	emoji: EmojiDescription;
	errorMessage?: string;
	onCloseDelete: () => void;
	onDeleteEmoji: OnDeleteEmoji;
}

export interface State {
	error: boolean;
	loading: boolean;
}

class EmojiDeletePreview extends Component<Props & WrappedComponentProps, State> {
	constructor(props: Props & WrappedComponentProps) {
		super(props);
		this.state = {
			loading: false,
			error: false,
		};
	}

	componentDidUpdate(prevProps: Props) {
		if (prevProps.emoji.id !== this.props.emoji.id) {
			this.setState({ error: false });
		}
	}

	private onSubmit = () => {
		const { emoji, onDeleteEmoji, onCloseDelete } = this.props;
		if (!this.state.loading) {
			this.setState({ loading: true });
			onDeleteEmoji(emoji).then((success) => {
				if (success) {
					onCloseDelete();
					return;
				}
				this.setState({
					loading: false,
					error: true,
				});
			});
		}
	};

	private onCancel = () => {
		this.props.onCloseDelete();
	};

	render() {
		const { emoji, intl } = this.props;
		const { loading, error } = this.state;
		const { formatMessage } = intl;

		if (FeatureGates.getExperimentValue('platform_teamoji_26_refresh_emoji_picker', 'isEnabled', false)) {
			return (
				<FocusLock noFocusGuards>
					<div css={deletePreviewNew} data-testid={emojiDeletePreviewTestId}>
						<div css={deleteTextSection}>
							<Box paddingBlockEnd="space.100">
								<Heading size="small">
									<FormattedMessage {...messages.deleteEmojiTitle} />
								</Heading>
							</Box>
							<Text color="color.text.subtle" size="small">
								<FormattedMessage
									{...messages.deleteEmojiDescription}
									values={{ emojiShortName: emoji.shortName }}
								/>
							</Text>
						</div>
						<div css={emojiPreviewLargeBox}>
							<CachingEmoji emoji={emoji} />
						</div>
						<div css={deleteButtonGroup}>
							{error && !loading ? (
								<EmojiErrorMessage
									message={formatMessage(messages.deleteEmojiFailed)}
									errorStyle="delete"
									tooltip
								/>
							) : null}
							<VisuallyHidden id={deleteEmojiLabelId}>
								{formatMessage(messages.deleteEmojiLabel)}
							</VisuallyHidden>
							<AkButton appearance="subtle" onClick={this.onCancel}>
								<FormattedMessage {...messages.cancelLabel} />
							</AkButton>
							<RetryableButton
								label={formatMessage(messages.deleteEmojiLabel)}
								onSubmit={this.onSubmit}
								appearance="danger"
								loading={loading}
								error={error}
								ariaLabelledBy={`${emojiErrorScreenreaderTestId} ${deleteEmojiLabelId}`}
							/>
						</div>
					</div>
				</FocusLock>
			);
		}

		return (
			<FocusLock noFocusGuards>
				<div css={deletePreview} data-testid={emojiDeletePreviewTestId}>
					<div css={deleteText}>
						<Heading size="xxsmall">
							<FormattedMessage {...messages.deleteEmojiTitle} />
						</Heading>
						<Text color="color.text.subtle" size="small">
							<FormattedMessage
								{...messages.deleteEmojiDescription}
								values={{ emojiShortName: emoji.shortName }}
							/>
						</Text>
					</div>
					<div css={deleteFooter}>
						<CachingEmoji emoji={emoji} />
						<div css={previewButtonGroup}>
							{error ? (
								!loading ? (
									<EmojiErrorMessage
										message={formatMessage(messages.deleteEmojiFailed)}
										errorStyle="delete"
										tooltip
									/>
								) : null
							) : null}
							<VisuallyHidden id={deleteEmojiLabelId}>
								{formatMessage(messages.deleteEmojiLabel)}
							</VisuallyHidden>
							<RetryableButton
								label={formatMessage(messages.deleteEmojiLabel)}
								onSubmit={this.onSubmit}
								appearance="danger"
								loading={loading}
								error={error}
								ariaLabelledBy={`${emojiErrorScreenreaderTestId} ${deleteEmojiLabelId}`}
							/>
							<AkButton appearance="subtle" onClick={this.onCancel}>
								<FormattedMessage {...messages.cancelLabel} />
							</AkButton>
						</div>
					</div>
				</div>
			</FocusLock>
		);
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
const _default_1: FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: ComponentType<Props & WrappedComponentProps>;
} = injectIntl(EmojiDeletePreview);
export default _default_1;
