/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type PropsWithChildren, PureComponent } from 'react';
import { css, jsx } from '@compiled/react';
import VisuallyHidden from '@atlaskit/visually-hidden';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';
import { messages } from '../i18n';
import { RENDER_EMOJI_PICKER_LIST_TESTID } from './EmojiPickerList';

const emojiPickerList = css({
	display: 'flex',
	flexDirection: 'column',
	flex: '1 1 auto',
	// To force Firefox/IE/Edge to shrink the list, if necessary (e.g. when upload panel in place)
	height: '0',
});

/**
 * TODO: have to use class component here as unit test is relying on ref.root. Will refactor this whole file + EmojiPickerList to functional component in future
 * ticket: COLLAB-2317
 */
interface EmojiPickerTabPanelProps extends WrappedComponentProps {
	/**
	 * Indicate whether the panel shows search results or full emojis list
	 */
	showSearchResults: boolean;
	children?: React.ReactNode;
}
class EmojiPickerTabPanelInternal extends PureComponent<
	PropsWithChildren<EmojiPickerTabPanelProps>
> {
	render() {
		const {
			intl: { formatMessage },
			children,
			showSearchResults,
		} = this.props;
		return (
			<div
				ref="root"
				css={emojiPickerList}
				data-testid={RENDER_EMOJI_PICKER_LIST_TESTID}
				id={RENDER_EMOJI_PICKER_LIST_TESTID}
				role="tabpanel"
				aria-label={formatMessage(messages.emojiPickerListPanel)}
			>
				<VisuallyHidden id="emoji-picker-table-description">
					{formatMessage(messages.emojiPickerGrid, { showSearchResults })}
				</VisuallyHidden>
				{children}
			</div>
		);
	}
}

export default injectIntl(EmojiPickerTabPanelInternal);
