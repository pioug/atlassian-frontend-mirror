/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	forwardRef,
	memo,
	type ForwardRefExoticComponent,
	type KeyboardEventHandler,
	type MemoExoticComponent,
	type MouseEventHandler,
	type RefAttributes,
} from 'react';
import { css, jsx } from '@compiled/react';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import type { EmojiDescription } from '../../types';
import FeatureGates from '@atlaskit/feature-gate-js-client';
import Emoji from './Emoji';

export const tonePreviewTestId = 'tone-preview';

const emojiButton = css({
	backgroundColor: 'transparent',
	border: '0',
	// Remove this on cleanup of platform_teamoji_26_refresh_emoji_picker
	borderRadius: token('radius.small', '3px'),
	cursor: 'pointer',
	padding: 0,
	position: 'relative',
	display: 'inline-block',

	/* Firefox */
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&::-moz-focus-inner': {
		borderWidth: 0,
		borderStyle: 'none',
		padding: 0,
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&>span': {
		paddingTop: token('space.075'),
		paddingBottom: token('space.075'),
		paddingLeft: token('space.075'),
		paddingRight: token('space.075'),

		// Scale sprite to fit regardless of default emoji size
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&>.emoji-common-emoji-sprite': {
			height: '24px',
			width: '24px',
		},
		// Scale image to fit regardless of default emoji size
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&>img': {
			height: '24px',
			width: '24px',
		},
	},

	'&:focus': {
		boxShadow: `0 0 0 2px ${token('color.border.focused')}`,
		transitionDuration: '0s, 0.2s',
		outline: 'none',
	},
});

const hidden = css({
	opacity: 0,
	visibility: 'hidden',
	display: 'none',
});

const emojiButtonOutline = css({
	border: `${token('border.width')} solid ${token('color.border')}`,
});

const emojiButtonBorderRadius = css({
	borderRadius: token('radius.medium', '6px'),
})

export interface Props {
	ariaControls?: string;
	ariaExpanded?: boolean;
	ariaLabelText?: string;
	emoji: EmojiDescription;
	isVisible?: boolean;
	onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
	onSelected?: MouseEventHandler<HTMLButtonElement>;
	selectOnHover?: boolean;
}

export const TonePreviewButton: ForwardRefExoticComponent<
	Props & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, Props>((props: Props, ref) => {
	const {
		emoji,
		selectOnHover,
		ariaControls = 'emoji-picker-tone-selector',
		ariaLabelText,
		ariaExpanded,
		onKeyDown,
		onSelected,
		isVisible = true,
	} = props;
	const fitToHeight = fg('platform_twemoji_removal_unicode_emojis') ? 24 : undefined;

	return FeatureGates.getExperimentValue(
		'platform_teamoji_26_refresh_emoji_picker',
		'isEnabled',
		false,
	) ? (
		<button
			ref={ref}
			css={[emojiButton, !isVisible && hidden, emojiButtonOutline, emojiButtonBorderRadius]}
			onClick={onSelected}
			onKeyDown={onKeyDown}
			aria-label={ariaLabelText}
			aria-expanded={ariaExpanded}
			aria-controls={ariaControls}
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
				fitToHeight={fitToHeight}
			/>
		</button>
	) : (
		<button
			ref={ref}
			css={[emojiButton, !isVisible && hidden]}
			onClick={onSelected}
			onKeyDown={onKeyDown}
			aria-label={ariaLabelText}
			aria-expanded={ariaExpanded}
			aria-controls={ariaControls}
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
				fitToHeight={fitToHeight}
			/>
		</button>
	);
});

const _default_1: MemoExoticComponent<
	ForwardRefExoticComponent<Props & RefAttributes<HTMLButtonElement>>
> = memo(TonePreviewButton);
export default _default_1;
