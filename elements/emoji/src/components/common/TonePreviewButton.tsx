/** @jsx jsx */
import { forwardRef, memo } from 'react';
import { jsx } from '@emotion/react';
import type { EmojiDescription } from '../../types';
import { emojiButton, hidden } from './styles';
import Emoji from './Emoji';

export const tonePreviewTestId = 'tone-preview';

export interface Props {
	emoji: EmojiDescription;
	isVisible?: boolean;
	onSelected?: () => void;
	selectOnHover?: boolean;
	ariaLabelText?: string;
	ariaExpanded?: boolean;
}

export const TonePreviewButton = forwardRef<HTMLButtonElement, Props>((props: Props, ref) => {
	const { emoji, selectOnHover, ariaLabelText, ariaExpanded, onSelected, isVisible = true } = props;

	return (
		<button
			ref={ref}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={[emojiButton, !isVisible && hidden]}
			onClick={onSelected}
			aria-label={ariaLabelText}
			aria-expanded={ariaExpanded}
			aria-controls="emoji-picker-tone-selector"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{ overflow: 'hidden' }}
			data-testid={tonePreviewTestId}
			type="button"
		>
			<Emoji
				emoji={emoji}
				selectOnHover={selectOnHover}
				shouldBeInteractive={false}
				aria-hidden={true}
			/>
		</button>
	);
});

export default memo(TonePreviewButton);
