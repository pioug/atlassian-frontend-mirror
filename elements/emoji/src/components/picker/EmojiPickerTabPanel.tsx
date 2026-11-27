/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type PropsWithChildren, PureComponent } from 'react';

import { css, jsx } from '@compiled/react';
import { injectIntl, type WithIntlProps, type WrappedComponentProps } from 'react-intl';

import VisuallyHidden from '@atlaskit/visually-hidden/visually-hidden';

import { messages } from '../i18n';
import { RENDER_EMOJI_PICKER_LIST_TESTID } from './EmojiPickerList';

const emojiPickerList = css({
	display: 'flex',
	flexDirection: 'column',
	flex: '1 1 auto',
	// To force Firefox/IE/Edge to shrink the list, if necessary (e.g. when upload panel in place)
	height: '0',
});

// Keeps the list mounted (preserving scroll position and focus restore) while the upload or
// delete panel is open.
const hiddenEmojiPickerList = css({
	flexGrow: 0,
	overflow: 'hidden',
	visibility: 'hidden',
});

/**
 * TODO: have to use class component here as unit test is relying on ref.root. Will refactor this whole file + EmojiPickerList to functional component in future
 * ticket: COLLAB-2317
 */
interface EmojiPickerTabPanelProps extends WrappedComponentProps {
	children?: React.ReactNode;
	/**
	 * Hide the panel while keeping its content mounted
	 */
	isHidden?: boolean;
	/**
	 * Indicate whether the panel shows search results or full emojis list
	 */
	showSearchResults: boolean;
}
class EmojiPickerTabPanelInternal extends PureComponent<
	PropsWithChildren<EmojiPickerTabPanelProps>
> {
	private rootRef = React.createRef<HTMLDivElement>();
	render() {
		const {
			intl: { formatMessage },
			children,
			isHidden,
			showSearchResults,
		} = this.props;
		return (
			<div
				ref={this.rootRef}
				css={[emojiPickerList, isHidden && hiddenEmojiPickerList]}
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

// eslint-disable-next-line @typescript-eslint/no-restricted-types
const _default_1: React.FC<WithIntlProps<React.PropsWithChildren<EmojiPickerTabPanelProps>>> & {
	WrappedComponent: React.ComponentType<React.PropsWithChildren<EmojiPickerTabPanelProps>>;
} = injectIntl(EmojiPickerTabPanelInternal);
export default _default_1;
