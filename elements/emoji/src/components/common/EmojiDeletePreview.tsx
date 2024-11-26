/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Component } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FormattedMessage, injectIntl, type WrappedComponentProps } from 'react-intl-next';
import AkButton from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import FocusLock from 'react-focus-lock';
import type { EmojiDescription } from '../../types';
import { messages } from '../i18n';
import CachingEmoji from './CachingEmoji';
import EmojiErrorMessage, { emojiErrorScreenreaderTestId } from './EmojiErrorMessage';
import RetryableButton from './RetryableButton';
import {
	deleteFooter,
	deletePreview,
	deleteText,
	emojiDeleteErrorMessage,
	previewButtonGroup,
} from './styles';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { fg } from '@atlaskit/platform-feature-flags';

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
		if (!fg('platform_editor_react18_elements_emoji')) {
			if (nextProps.emoji.id !== this.props.emoji.id) {
				this.setState({ error: false });
			}
		}
	}

	componentDidUpdate(prevProps: Props) {
		if (fg('platform_editor_react18_elements_emoji')) {
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
				{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
				<div css={deletePreview} data-testid={emojiDeletePreviewTestId}>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
					<div css={deleteText}>
						{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
						<Heading size="xxsmall">
							<FormattedMessage {...messages.deleteEmojiTitle} />
						</Heading>
						<FormattedMessage
							{...messages.deleteEmojiDescription}
							values={{ emojiShortName: emoji.shortName }}
						/>
					</div>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
					<div css={deleteFooter}>
						<CachingEmoji emoji={emoji} />
						{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
						<div css={previewButtonGroup}>
							{error ? (
								!loading ? (
									<EmojiErrorMessage
										message={formatMessage(messages.deleteEmojiFailed)}
										messageStyles={emojiDeleteErrorMessage}
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
