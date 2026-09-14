/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, {
	useEffect,
	useContext,
	type FocusEvent,
	type MouseEvent,
	forwardRef,
	type PropsWithChildren,
} from 'react';

import { css, jsx } from '@compiled/react';
import { IntlContext } from 'react-intl';

import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import {
	type EmojiDescription,
	type OnEmojiEvent,
	ProviderTypes,
	UfoEmojiTimings,
} from '../../types';
import { hasUfoMarked } from '../../util/analytics/hasUfoMarked';
import { sampledUfoRenderedEmoji } from '../../util/analytics/sampledUfoRenderedEmoji';
import { ufoExperiences } from '../../util/analytics/ufoExperiences';
import { useSampledUFOComponentExperience } from '../../util/analytics/useSampledUFOComponentExperience';
import {
	deleteEmojiLabel,
	EMOJI_KEYBOARD_KEYS_SUPPORTED,
	KeyboardKeys,
	SAMPLING_RATE_EMOJI_RENDERED_EXP,
} from '../../util/constants';
import { isSpriteRepresentation } from '../../util/is-sprite-representation';
import { isUnicodeRepresentation } from '../../util/is-unicode-representation';
import { leftClick } from '../../util/left-click';
import { toEmojiId } from '../../util/to-emoji-id';
import { messages } from '../i18n';
import { handleDelete } from './handleDelete';
import { ImageEmoji } from './ImageEmoji';
import { SpriteEmoji } from './SpriteEmoji';
import { UnicodeEmoji } from './UnicodeEmoji';
import { fg } from '@atlaskit/platform-feature-flags/fg';

const emojiSpriteContainer = css({
	display: 'inline-block',
	// Ensure along with vertical align middle, we don't increase the line height for h1..h6, and p
	margin: '-1px 0',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.emoji-common-selected,&.emoji-common-select-on-hover:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered'),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.emoji-common-emoji-sprite': {
		background: 'transparent no-repeat',
		display: 'inline-block',
		minHeight: '20px', // defaultEmojiHeight
		minWidth: '20px', // defaultEmojiHeight
		verticalAlign: 'middle',
	},

	'&:focus': {
		boxShadow: `0 0 0 2px ${token('color.border.focused')}`,
		transitionDuration: '0s, 0.2s',
		outline: 'none',
	},
});

const emojiImageContainer = css({
	borderRadius: token('radius.small', '3px'),
	backgroundColor: 'transparent',
	display: 'inline-block',
	verticalAlign: 'middle',
	// Ensure along with vertical align middle, we don't increase the line height for p and some
	// headings. Smaller headings get a slight increase in height, cannot add more negative margin
	// as a "selected" emoji (e.g. in the editor) will not look good.
	margin: '-1px 0',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	img: {
		display: 'block',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.emoji-common-selected,&.emoji-common-select-on-hover:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered'),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.emoji-common-selected,&.emoji-common-select-on-hover:hover .emoji-common-deleteButton': {
		// show delete button on hover
		visibility: 'visible',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.emoji-common-deletable': {
		position: 'relative',
	},

	// show delete button on focus
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.emoji-common-deletable:focus-within .emoji-common-deleteButton': {
		visibility: 'visible',
	},

	'&:focus': {
		boxShadow: `0 0 0 2px ${token('color.border.focused')}`,
		transitionDuration: '0s, 0.2s',
		outline: 'none',
	},
});

// Unicode emojis render as text inside a <span>, not an <img>, so they do not need
// borderRadius (which would clip a background on hover) or the img { display: block } rule.
const emojiUnicodeContainer = css({
	backgroundColor: 'transparent',
	display: 'inline-block',
	verticalAlign: 'middle',
	// Ensure along with vertical align middle, we don't increase the line height for p and some
	// headings. Smaller headings get a slight increase in height, cannot add more negative margin
	// as a "selected" emoji (e.g. in the editor) will not look good.
	margin: '-1px 0',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.emoji-common-selected,&.emoji-common-select-on-hover:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered'),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.emoji-common-selected,&.emoji-common-select-on-hover:hover .emoji-common-deleteButton': {
		// show delete button on hover
		visibility: 'visible',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.emoji-common-deletable': {
		position: 'relative',
	},

	// show delete button on focus
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.emoji-common-deletable:focus-within .emoji-common-deleteButton': {
		visibility: 'visible',
	},

	'&:focus': {
		boxShadow: `0 0 0 2px ${token('color.border.focused')}`,
		transitionDuration: '0s, 0.2s',
		outline: 'none',
	},
});

export interface Props extends Omit<
	React.HTMLAttributes<HTMLSpanElement>,
	'onMouseMove' | 'onFocus'
> {
	/**
	 * Auto Width takes the constraint of height and enables native scaling based on the emojis image.
	 * This is primarily used when rendering emojis for SSR as the component does not know the width and height
	 * at the time of the render. It overrides the emoji representations width with 'auto' on the images width attribute
	 *
	 * Used only for image based emojis
	 */
	autoWidth?: boolean;

	/**
	 * Additional css classes, if required.
	 */
	className?: string;

	/**
	 * Disables lazy load on images
	 */
	disableLazyLoad?: boolean;

	/**
	 * This should only be set when the emoji is being used in the Editor.
	 * Currently when set -- this prevents any aria labels being added.
	 * This is acceptable in Editor -- as it uses another technique to announce the emoji nodes.
	 */
	editorEmoji?: true;

	/**
	 * The emoji to render
	 */
	emoji: EmojiDescription;

	/**
	 * Fits emoji to height in pixels, keeping aspect ratio
	 */
	fitToHeight?: number;

	/**
	 * When true, the emoji is treated as decorative (purely visual).
	 * This removes the aria-label so screen readers will skip the emoji.
	 */
	isDecorative?: boolean;

	/**
	 * Called when an emoji is deleted
	 */
	onDelete?: OnEmojiEvent;

	/**
	 * Called when the mouse moves over the emoji.
	 */
	onFocus?: OnEmojiEvent;

	/**
	 * Callback for if an emoji image fails to load.
	 */
	onLoadError?: OnEmojiEvent<HTMLImageElement>;

	/**
	 * Callback for if an emoji image succesfully loads.
	 */
	onLoadSuccess?: (emoji: EmojiDescription) => void;

	/**
	 * Called when the mouse moves over the emoji.
	 */
	onMouseMove?: OnEmojiEvent;

	/**
	 * Called when an emoji is selected
	 */
	onSelected?: OnEmojiEvent;

	/**
	 * Prevent mouse selection from moving browser focus to the emoji.
	 * Keyboard selection still keeps focus on the emoji for grid navigation.
	 */
	preventFocusOnMouseDown?: boolean;

	/**
	 * Renders unicode emoji through an image representation when a fixed height is supplied.
	 * Defaults to `true`.
	 */
	renderUnicodeEmojiAsImage?: boolean;

	/**
	 * Show the emoji as selected
	 */
	selected?: boolean;

	/**
	 * Automatically show the emoji as selected based on mouse hover.
	 * CSS, fast, does not require a re-render, but selected state not
	 * externally controlled via props.
	 */
	selectOnHover?: boolean;

	/**
	 * Indicates whether emoji is an interactive element (tab index and role) or just a view
	 */
	shouldBeInteractive?: boolean;

	/**
	 * Show a delete button on mouse hover
	 * Used only for custom emoji
	 */
	showDelete?: boolean;

	/**
	 * Show a tooltip on mouse hover.
	 */
	showTooltip?: boolean;
}

export const unicodeEmojiCanvasSize: any = 128;

const handleMouseDown = (props: Props, event: MouseEvent<any>) => {
	// Clicked emoji delete button
	if (
		event.target instanceof Element &&
		event.target.getAttribute('aria-label') === deleteEmojiLabel
	) {
		return;
	}
	const { emoji, onSelected } = props;
	if (onSelected && leftClick(event)) {
		if (props.preventFocusOnMouseDown) {
			event.preventDefault();
		}
		onSelected(toEmojiId(emoji), emoji, event);
	}
};

const handleKeyDown = (props: Props, event: React.KeyboardEvent<HTMLElement>) => {
	if (!EMOJI_KEYBOARD_KEYS_SUPPORTED.includes(event.key)) {
		return;
	}
	event.preventDefault();
	event.stopPropagation();
	const { emoji, onSelected, showDelete } = props;
	if (onSelected && (event.key === KeyboardKeys.Enter || event.key === KeyboardKeys.Space)) {
		onSelected(toEmojiId(emoji), emoji, event);
	}
	if (showDelete && event.key === KeyboardKeys.Backspace) {
		handleDelete(props, event);
	}
};

const handleMouseMove = (props: Props, event: MouseEvent<any>) => {
	const { emoji, onMouseMove } = props;
	if (onMouseMove) {
		onMouseMove(toEmojiId(emoji), emoji, event);
	}
};

const handleFocus = (props: Props, event: FocusEvent<any>) => {
	const { emoji, onFocus } = props;
	if (onFocus) {
		onFocus(toEmojiId(emoji), emoji, event);
	}
};

interface EmojiNodeWrapperProps extends Props {
	type: 'sprite' | 'image' | 'unicode';
}

export const EmojiNodeWrapper: React.ForwardRefExoticComponent<
	EmojiNodeWrapperProps & {
		children?: React.ReactNode | undefined;
	} & React.RefAttributes<HTMLSpanElement>
> = forwardRef<HTMLSpanElement, PropsWithChildren<EmojiNodeWrapperProps>>((props, ref) => {
	const {
		emoji,
		fitToHeight,
		selected,
		selectOnHover,
		className,
		showTooltip,
		showDelete,
		shouldBeInteractive = false,
		tabIndex,
		onSelected,
		onMouseMove,
		onFocus,
		onDelete,
		onLoadError,
		onLoadSuccess,
		disableLazyLoad,
		autoWidth,
		children,
		type,
		editorEmoji,
		renderUnicodeEmojiAsImage,
		isDecorative,
		...other
	} = props;

	const intl = useContext(IntlContext);

	const isAriaLabelEmpty = editorEmoji || (isDecorative && fg('emoji_decorative_label'));
	let ariaLabel: string | undefined;
	if (isAriaLabelEmpty) {
		ariaLabel = undefined;
	} else if (intl) {
		ariaLabel = intl.formatMessage(messages.changeEmojiShortnameButtonLabel, {
			shortName: emoji.name ?? emoji.shortName,
		});
	} else {
		ariaLabel = emoji.shortName;
	}

	const tooltipContent =
		showTooltip && expValEquals('platform_editor_emoji_hover_show_tooltip', 'isEnabled', true)
			? emoji.shortName || emoji.name || undefined
			: undefined;

	const emojiSpan = (
		<span
			role={
				editorEmoji
					? undefined
					: shouldBeInteractive
						? 'button'
						: ariaLabel
							? 'img'
							: 'presentation'
			}
			aria-label={ariaLabel}
			ref={ref}
			data-testid={`${type}-emoji-${emoji.shortName}`}
			data-emoji-type={type}
			tabIndex={shouldBeInteractive ? tabIndex || 0 : undefined}
			css={[
				type === 'sprite'
					? emojiSpriteContainer
					: type === 'unicode'
						? emojiUnicodeContainer
						: emojiImageContainer,
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
			onKeyDown={(event) => handleKeyDown(props, event)}
			onMouseDown={(event) => {
				handleMouseDown(props, event);
			}}
			onMouseEnter={(event) => {
				handleMouseMove(props, event);
			}}
			onFocus={(event) => {
				handleFocus(props, event);
			}}
			title={
				showTooltip && !expValEquals('platform_editor_emoji_hover_show_tooltip', 'isEnabled', true)
					? emoji.shortName
					: undefined
			}
			{...other}
		>
			{children}
		</span>
	);

	if (tooltipContent) {
		return (
			<Tooltip
				content={tooltipContent}
				isScreenReaderAnnouncementDisabled
				position="top"
				tag="span"
			>
				{emojiSpan}
			</Tooltip>
		);
	}

	return emojiSpan;
});

export const Emoji = (props: Props): JSX.Element => {
	const { emoji } = props;
	// start emoji rendered experience, it may have already started earlier in ResourcedEmoji or CachingEmoji
	useSampledUFOComponentExperience(
		ufoExperiences['emoji-rendered'].getInstance(emoji.id || emoji.shortName),
		SAMPLING_RATE_EMOJI_RENDERED_EXP,
		{
			source: 'Emoji',
			emojiId: emoji.id,
		},
	);

	useEffect(() => {
		const ufoExp = sampledUfoRenderedEmoji(emoji);
		if (!hasUfoMarked(ufoExp, 'fmp')) {
			ufoExp.markFMP();
		}
		if (!hasUfoMarked(ufoExp, UfoEmojiTimings.MOUNTED_END)) {
			ufoExp.mark(UfoEmojiTimings.MOUNTED_END);
		}
		if (emoji.type === ProviderTypes.STANDARD || isUnicodeRepresentation(emoji.representation)) {
			expValEquals('platform_use_unicode_emojis', 'isEnabled', true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (isUnicodeRepresentation(emoji.representation)) {
		return <UnicodeEmoji {...props} />;
	}
	// TODO: We always prefer render as image as having accessibility issues with sprite representation
	if (isSpriteRepresentation(emoji.representation)) {
		return <SpriteEmoji {...props} />;
	}
	return <ImageEmoji {...props} />;
};

export default Emoji;
