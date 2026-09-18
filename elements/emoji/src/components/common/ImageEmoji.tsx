/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useEffect, useCallback, useMemo, type SyntheticEvent } from 'react';

import { jsx } from '@compiled/react';

import { getDocument } from '@atlaskit/browser-apis';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { shouldUseAltRepresentation } from '../../api/shouldUseAltRepresentation';
import { useInView } from '../../hooks/useInView';
import { UfoEmojiTimings } from '../../types';
import { hasUfoMarked } from '../../util/analytics/hasUfoMarked';
import { sampledUfoRenderedEmoji } from '../../util/analytics/sampledUfoRenderedEmoji';
import browserSupport from '../../util/browser-support';
import { isImageRepresentation } from '../../util/is-image-representation';
import { isMediaRepresentation } from '../../util/is-media-representation';
import { toEmojiId } from '../../util/to-emoji-id';
import { DeletableEmojiTooltipContent } from './DeletableEmojiTooltipContent';
import { DeletableEmojiTooltipContentForScreenReader } from './DeletableEmojiTooltipContentForScreenReader';
import DeleteButton from './DeleteButton';
import { EmojiNodeWrapper } from './Emoji';
import type { Props } from './Emoji';
import { handleDelete } from './handleDelete';
import {
	emojiNodeStyles,
	commonSelectedStyles,
	selectOnHoverStyles,
	emojiMainStyle,
	emojiImage,
	deletableEmoji,
} from './styles';

const handleImageError = (
	props: Pick<Props, 'emoji' | 'onLoadError'>,
	event: SyntheticEvent<HTMLImageElement>,
) => {
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

// Keep as pure functional component, see renderAsSprite.
export const ImageEmoji = (props: Props): JSX.Element => {
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
		isDecorative,
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
		const sizingWidth = autoWidth ? 'auto' : (fitToHeight / height) * width;
		// Presize image, to prevent reflow due to size changes after loading
		sizing = {
			width: sizingWidth,
			height: fitToHeight,
		};
	}

	const onError = useCallback(
		(event: SyntheticEvent<HTMLImageElement>) => {
			handleImageError({ emoji: props.emoji, onLoadError: props.onLoadError }, event);
		},
		[props.emoji, props.onLoadError],
	);

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
		if (!getDocument()?.activeElement?.contains(e.target as Node)) {
			e.stopPropagation();
		}
	}, []);

	// because of the lack of browser support of on before load natively, used IntersectionObserver helper hook to mimic the before load time mark for UFO.
	useEffect(() => {
		if (inView) {
			onBeforeLoad();
		}
	}, [inView, onBeforeLoad]);

	const imgAlt =
		isDecorative && fg('emoji_decorative_label') ? '' : emoji.name || emoji.shortName || '';

	const emojiNode = (
		<img
			loading={disableLazyLoad ? 'eager' : 'lazy'}
			src={src}
			key={src}
			alt={imgAlt}
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
};
