/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { PureComponent } from 'react';
import { toEmojiId } from '../../util/type-helpers';
import type { EmojiDescription, EmojiProvider, OnEmojiEvent } from '../../types';
import { leftClick } from '../../util/mouse';
import { EmojiPreviewComponent } from '../common/EmojiPreviewComponent';
import { EmojiCommonProvider } from '../../context/EmojiCommonProvider';
import {
	typeAheadItem,
	selected as selectedStyles,
	typeAheadItemRow,
	typeaheadSelected,
} from './styles';

export interface Props {
	onMouseMove: OnEmojiEvent;
	onSelection: OnEmojiEvent;
	selected: boolean;
	emoji: EmojiDescription;
	emojiProvider?: EmojiProvider;
	forwardedRef?: React.Ref<HTMLDivElement>;
}

class EmojiTypeAheadItemInternal extends PureComponent<Props, {}> {
	// internal, used for callbacks
	onEmojiSelected: React.MouseEventHandler<HTMLDivElement> = (event) => {
		const { emoji, onSelection } = this.props;
		if (leftClick(event) && onSelection) {
			event.preventDefault();
			onSelection(toEmojiId(emoji), emoji, event);
		}
	};

	onEmojiMenuItemMouseMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
		const { emoji, onMouseMove } = this.props;
		if (onMouseMove) {
			onMouseMove(toEmojiId(emoji), emoji, event);
		}
	};

	render() {
		const { selected, emoji, emojiProvider } = this.props;
		const classes = [typeAheadItem, selected && selectedStyles];

		return (
			<EmojiCommonProvider emojiProvider={emojiProvider}>
				{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
				<div
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={`ak-emoji-typeahead-item ${selected ? typeaheadSelected : ''}`}
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					css={classes}
					onMouseDown={this.onEmojiSelected}
					onMouseMove={this.onEmojiMenuItemMouseMove}
					data-emoji-id={emoji.shortName}
					ref={this.props.forwardedRef}
				>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
					<div css={typeAheadItemRow}>{emoji && <EmojiPreviewComponent emoji={emoji} />}</div>
				</div>
			</EmojiCommonProvider>
		);
	}
}

const EmojiTypeAheadItem = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
	return <EmojiTypeAheadItemInternal {...props} forwardedRef={ref} />;
});

export default EmojiTypeAheadItem;
