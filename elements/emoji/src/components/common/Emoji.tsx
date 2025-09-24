/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	useEffect,
	useCallback,
	useMemo,
	type FocusEvent,
	type MouseEvent,
	type SyntheticEvent,
	forwardRef,
	type PropsWithChildren,
} from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { B100, N30 } from '@atlaskit/theme/colors';
import Tooltip from '@atlaskit/tooltip';
import { shouldUseAltRepresentation } from '../../api/EmojiUtils';
import {
	deleteEmojiLabel,
	EMOJI_KEYBOARD_KEYS_SUPPORTED,
	KeyboardKeys,
	SAMPLING_RATE_EMOJI_RENDERED_EXP,
} from '../../util/constants';
import {
	isImageRepresentation,
	isMediaRepresentation,
	isSpriteRepresentation,
	toEmojiId,
} from '../../util/type-helpers';
import {
	type EmojiDescription,
	type OnEmojiEvent,
	type SpriteRepresentation,
	UfoEmojiTimings,
} from '../../types';
import { leftClick } from '../../util/mouse';
import DeleteButton from './DeleteButton';
import {
	emojiNodeStyles,
	commonSelectedStyles,
	selectOnHoverStyles,
	emojiSprite,
	emojiMainStyle,
	emojiImage,
	deletableEmoji,
} from './styles';
import {
	sampledUfoRenderedEmoji,
	ufoExperiences,
	useSampledUFOComponentExperience,
} from '../../util/analytics';
import browserSupport from '../../util/browser-support';
import { useInView } from '../../hooks/useInView';
import { hasUfoMarked } from '../../util/analytics/ufoExperiences';
import {
	DeletableEmojiTooltipContent,
	DeletableEmojiTooltipContentForScreenReader,
} from './DeletableEmojiTooltipContent';
import { isSSR } from '../../util/is-ssr';

import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

const emojiSpriteContainer = css({
	display: 'inline-block',
	// Ensure along with vertical align middle, we don't increase the line height for h1..h6, and p
	margin: '-1px 0',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.emoji-common-selected,&.emoji-common-select-on-hover:hover': {
		backgroundColor: token('color.background.neutral.subtle.hovered', N30),
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
		boxShadow: `0 0 0 2px ${token('color.border.focused', B100)}`,
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
		backgroundColor: token('color.background.neutral.subtle.hovered', N30),
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
		boxShadow: `0 0 0 2px ${token('color.border.focused', B100)}`,
		transitionDuration: '0s, 0.2s',
		outline: 'none',
	},
});

export interface Props
	extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onMouseMove' | 'onFocus'> {
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

const handleDelete = (props: Props, event: SyntheticEvent) => {
	const { emoji, onDelete } = props;
	if (onDelete) {
		onDelete(toEmojiId(emoji), emoji, event);
	}
};

const handleImageError = (props: Pick<Props, 'emoji' | 'onLoadError'>, event: SyntheticEvent<HTMLImageElement>) => {
	const { emoji, onLoadError } = props;

	// Hide error state (but keep space for it)
	if (event.target) {
		const target = event.target as HTMLElement;
		target.style.visibility = 'hidden';
	}
	if (onLoadError) {
		onLoadError(toEmojiId(emoji), emoji, event);
	}
};

// Pure functional components are used in favour of class based components, due to the performance!
// When rendering 1500+ emoji using class based components had a significant impact.
// TODO: add UFO tracking for sprite emoji
export const SpriteEmoji = (props: Props) => {
	const { emoji, fitToHeight, selected, selectOnHover, className } = props;

	const representation = emoji.representation as SpriteRepresentation;
	const sprite = representation.sprite;

	const classes = `${emojiNodeStyles} ${selected ? commonSelectedStyles : ''} ${
		selectOnHover ? selectOnHoverStyles : ''
	} ${className ? className : ''}`;

	let sizing = {};
	if (fitToHeight) {
		sizing = {
			width: `${fitToHeight}px`,
			height: `${fitToHeight}px`,
			minHeight: `${fitToHeight}px`,
			minWidth: `${fitToHeight}px`,
		};
	}

	const xPositionInPercent = (100 / (sprite.column - 1)) * (representation.xIndex - 0);
	const yPositionInPercent = (100 / (sprite.row - 1)) * (representation.yIndex - 0);
	const style = {
		backgroundImage: `url(${sprite.url})`,
		backgroundPosition: `${xPositionInPercent}% ${yPositionInPercent}%`,
		backgroundSize: `${sprite.column * 100}% ${sprite.row * 100}%`,
		...sizing,
	};

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		<EmojiNodeWrapper {...props} type="sprite" className={classes}>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766  */}
			<span className={emojiSprite} style={style} />
		</EmojiNodeWrapper>
	);
};

// Keep as pure functional component, see renderAsSprite.
export const ImageEmoji = ((props: Props) => {
	const {
		emoji,
		fitToHeight,
		selected,
		selectOnHover,
		className,
		showDelete,
		onLoadSuccess,
		disableLazyLoad,
		autoWidth,
	} = props;

	const [ref, inView] = useInView({
		triggerOnce: true,
	});

	const ufoExp = useMemo(() => sampledUfoRenderedEmoji(emoji), [emoji]);

	const classes = `${emojiMainStyle} ${emojiNodeStyles} ${
		selected ? commonSelectedStyles : ''
	} ${selectOnHover ? selectOnHoverStyles : ''} ${emojiImage} ${
		className ? className : ''
	} ${showDelete ? deletableEmoji : ''}`;

	let width;
	let height;
	let src;

	const representation = shouldUseAltRepresentation(emoji, fitToHeight)
		? emoji.altRepresentation
		: emoji.representation;
	if (isImageRepresentation(representation)) {
		src = representation.imagePath;
		width = representation.width;
		height = representation.height;
	} else if (isMediaRepresentation(representation)) {
		src = representation.mediaPath;
		width = representation.width;
		height = representation.height;
	}

	let sizing = {};
	if (fitToHeight && width && height) {
		// Presize image, to prevent reflow due to size changes after loading
		sizing = {
			// Size of <img> needs to be deterministic when rendered on server-side. Auto will cause width to be 0 before image is loaded.
			width: autoWidth && !isSSR() ? 'auto' : (fitToHeight / height) * width,
			height: fitToHeight,
		};
	}

	const onErrorV1 = useCallback(
		(event: SyntheticEvent<HTMLImageElement>) => {
			handleImageError(props, event);
		},
		[props],
	);
	const onErrorV2 = useCallback(
		(event: SyntheticEvent<HTMLImageElement>) => {
			handleImageError({ emoji: props.emoji, onLoadError: props.onLoadError }, event);
		},
		[props.emoji, props.onLoadError],
	);
	const onError = expValEquals(
				'cc_complexit_fe_emoji_stability',
				'isEnabled',
				true,
		) ? onErrorV2 : onErrorV1;

	const onLoad = useCallback(() => {
		const mountedMark = ufoExp.metrics.marks.find(
			(mark) => mark.name === UfoEmojiTimings.MOUNTED_END,
		);
		// onload could trigger before onBeforeLoad when emojis in viewport at start, so we need to mark onload start manually.
		if (!hasUfoMarked(ufoExp, UfoEmojiTimings.ONLOAD_START)) {
			ufoExp.mark(UfoEmojiTimings.ONLOAD_START, mountedMark?.time);
		}
		const loadedStartMark = ufoExp.metrics.marks.find(
			(mark) => mark.name === UfoEmojiTimings.ONLOAD_START,
		);
		if (mountedMark && loadedStartMark) {
			ufoExp.addMetadata({
				lazyLoad: loadedStartMark.time > mountedMark.time,
			});
		}
		// onload_start
		if (!hasUfoMarked(ufoExp, UfoEmojiTimings.ONLOAD_END)) {
			ufoExp.mark(UfoEmojiTimings.ONLOAD_END);
		}
		ufoExp.success({
			metadata: {
				IBSupported: browserSupport.supportsIntersectionObserver,
			},
		});

		if (onLoadSuccess) {
			onLoadSuccess(emoji);
		}
	}, [emoji, onLoadSuccess, ufoExp]);

	const onBeforeLoad = useCallback(() => {
		if (!hasUfoMarked(ufoExp, UfoEmojiTimings.ONLOAD_START)) {
			ufoExp.mark(UfoEmojiTimings.ONLOAD_START);
		}
	}, [ufoExp]);

	const onMouseOver = useCallback((e: React.MouseEvent<HTMLElement>) => {
		// only disable tooltip when not on focus
		if (!document.activeElement?.contains(e.target as Node)) {
			e.stopPropagation();
		}
	}, []);

	// because of the lack of browser support of on before load natively, used IntersectionObserver helper hook to mimic the before load time mark for UFO.
	useEffect(() => {
		if (inView) {
			onBeforeLoad();
		}
	}, [inView, onBeforeLoad]);

	const emojiNode = (
		<img
			//@ts-ignore
			loading={disableLazyLoad ? 'eager' : 'lazy'}
			src={src}
			key={src}
			alt={emoji.name || emoji.shortName}
			data-emoji-short-name={emoji.shortName}
			data-emoji-id={emoji.id}
			data-emoji-text={emoji.fallback || emoji.shortName}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="emoji"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{ visibility: 'visible' }}
			onError={onError}
			onLoad={onLoad}
			{...sizing}
			data-vc="emoji"
		/>
	);

	// show a tooltip for deletable emoji only on focus
	if (showDelete) {
		return (
			<Tooltip content={<DeletableEmojiTooltipContent />} position="right-start" tag="span">
				<EmojiNodeWrapper
					{...props}
					aria-labelledby={`screenreader-emoji-${emoji.id}`}
					type="image"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={classes}
					ref={ref}
					showTooltip={false} // avoid showing both tooltip and title
					onMouseOver={onMouseOver}
				>
					{emojiNode}
					<DeleteButton onClick={(event: SyntheticEvent) => handleDelete(props, event)} />
					<DeletableEmojiTooltipContentForScreenReader emoji={emoji} />
				</EmojiNodeWrapper>
			</Tooltip>
		);
	}

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		<EmojiNodeWrapper {...props} type="image" className={classes} ref={ref}>
			{emojiNode}
		</EmojiNodeWrapper>
	);
});

interface EmojiNodeWrapperProps extends Props {
	type: 'sprite' | 'image';
}

export const EmojiNodeWrapper = forwardRef<
	HTMLSpanElement,
	PropsWithChildren<EmojiNodeWrapperProps>
>((props, ref) => {
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
		...other
	} = props;

	let accessibilityProps;

	if (editorEmoji) {
		accessibilityProps = { role: undefined };
	} else if (shouldBeInteractive) {
		accessibilityProps = { role: 'button', 'aria-label': emoji.shortName };
	} else {
		accessibilityProps = { role: 'img', 'aria-label': emoji.shortName };
	}

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<span
			{...accessibilityProps}
			ref={ref}
			data-testid={`${type}-emoji-${emoji.shortName}`}
			data-emoji-type={type}
			tabIndex={shouldBeInteractive ? tabIndex || 0 : undefined}
			css={[type === 'sprite' ? emojiSpriteContainer : emojiImageContainer]}
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
			title={showTooltip ? emoji.shortName : undefined} // TODO: COLLAB-2351 - use @atlaskit/Tooltip in future for non-deletable emoji if enabled showTooltip
			{...other}
		>
			{children}
		</span>
	);
});

export const Emoji = (props: Props) => {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	// TODO: We always prefer render as image as having accessibility issues with sprite representation
	if (isSpriteRepresentation(emoji.representation)) {
		return <SpriteEmoji {...props} />;
	}
	return <ImageEmoji {...props} />;
};

export default Emoji;
