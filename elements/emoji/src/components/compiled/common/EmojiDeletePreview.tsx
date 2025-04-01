/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Component } from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N300 } from '@atlaskit/theme/colors';
import { FormattedMessage, injectIntl, type WrappedComponentProps } from 'react-intl-next';
import AkButton from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import FocusLock from 'react-focus-lock';
import type { EmojiDescription } from '../../../types';
import { messages } from '../../i18n';
import CachingEmoji from '../../common/CachingEmoji';
import EmojiErrorMessage, { emojiErrorScreenreaderTestId } from './EmojiErrorMessage';
import RetryableButton from './RetryableButton';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { fg } from '@atlaskit/platform-feature-flags';

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
		fontWeight: token('font.weight.bold', 'bold'),
		marginRight: token('space.050', '4px'),
	},
});

const deletePreview = css({
	height: '100px',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	padding: '10px',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'flex-end',
});

const deleteText = css({
	height: '64px',
	font: token('font.body.UNSAFE_small'),

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:first-of-type': {
		color: token('color.text.subtle', N300),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '16px',
	},
});

const previewButtonGroup = css({
	display: 'flex',
});

export interface OnDeleteEmoji {
	(emoji: EmojiDescription): Promise<boolean>;
}

export const emojiDeletePreviewTestId = 'emoji-delete-preview';
const deleteEmojiLabelId = 'fabric.emoji.delete.label.id';

export interface Props {
	emoji: EmojiDescription;
	onDeleteEmoji: OnDeleteEmoji;
	onCloseDelete: () => void;
	errorMessage?: string;
}

export interface State {
	loading: boolean;
	error: boolean;
}

class EmojiDeletePreview extends Component<Props & WrappedComponentProps, State> {
	constructor(props: Props & WrappedComponentProps) {
		super(props);
		this.state = {
			loading: false,
			error: false,
		};
	}

	UNSAFE_componentWillUpdate(nextProps: Props) {
		if (
			!fg('platform_editor_react18_elements_emoji') ||
			!fg('platform_editor_react18_elements_emoji_jira_bb')
		) {
			if (nextProps.emoji.id !== this.props.emoji.id) {
				this.setState({ error: false });
			}
		}
	}

	componentDidUpdate(prevProps: Props) {
		if (
			fg('platform_editor_react18_elements_emoji') ||
			fg('platform_editor_react18_elements_emoji_jira_bb')
		) {
			if (prevProps.emoji.id !== this.props.emoji.id) {
				this.setState({ error: false });
			}
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

		return (
			<FocusLock noFocusGuards>
				<div css={deletePreview} data-testid={emojiDeletePreviewTestId}>
					<div css={deleteText}>
						<Heading size="xxsmall">
							<FormattedMessage {...messages.deleteEmojiTitle} />
						</Heading>
						<FormattedMessage
							{...messages.deleteEmojiDescription}
							values={{ emojiShortName: emoji.shortName }}
						/>
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

export default injectIntl(EmojiDeletePreview);
