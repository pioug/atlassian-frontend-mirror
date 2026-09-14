/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { useEffect, useState } from 'react';

import { jsx } from '@compiled/react';

import { type UnicodeRepresentation } from '../../types';
import { defaultEmojiHeight } from '../../util/constants';
import { isSSR } from '../../util/is-ssr';
import { renderUnicodeEmojiToImagePath } from '../../util/renderUnicodeEmojiToImagePath';
import { EmojiNodeWrapper, unicodeEmojiCanvasSize } from './Emoji';
import type { Props } from './Emoji';
import EmojiPlaceholder from './EmojiPlaceholder';
import { ImageEmoji } from './ImageEmoji';
import { emojiNodeStyles, commonSelectedStyles, selectOnHoverStyles } from './styles';

type UnicodeEmojiImageState =
	| { status: 'loading'; unicodeEmoji?: string }
	| { imagePath: string; status: 'ready'; unicodeEmoji: string }
	| { status: 'failed'; unicodeEmoji: string };

const useUnicodeEmojiImage = (unicodeEmoji: string): UnicodeEmojiImageState => {
	const [state, setState] = useState<UnicodeEmojiImageState>({ status: 'loading' });

	useEffect(() => {
		let cancelled = false;
		let imagePathToRevoke: string | undefined;
		setState({ status: 'loading', unicodeEmoji });

		void renderUnicodeEmojiToImagePath(unicodeEmoji)
			.then((imagePath) => {
				if (cancelled) {
					if (imagePath) {
						URL.revokeObjectURL(imagePath);
					}
					return;
				}

				imagePathToRevoke = imagePath;
				setState(
					imagePath
						? { status: 'ready', unicodeEmoji, imagePath }
						: { status: 'failed', unicodeEmoji },
				);
			})
			.catch(() => {
				if (!cancelled) {
					setState({ status: 'failed', unicodeEmoji });
				}
			});

		return () => {
			cancelled = true;
			if (imagePathToRevoke) {
				URL.revokeObjectURL(imagePathToRevoke);
			}
		};
	}, [unicodeEmoji]);

	return state;
};

const UnicodeEmojiImage = (props: Props): JSX.Element => {
	const { emoji, fitToHeight, showTooltip } = props;
	const emojiText = (emoji.representation as UnicodeRepresentation).unicodeEmoji;
	const unicodeEmojiImage = useUnicodeEmojiImage(emojiText);

	const hasCurrentEmojiImage = unicodeEmojiImage.unicodeEmoji === emojiText;

	if (isSSR() || !hasCurrentEmojiImage || unicodeEmojiImage.status === 'loading') {
		return (
			<EmojiPlaceholder
				shortName={emoji.shortName}
				showTooltip={showTooltip}
				size={fitToHeight}
				loading
			/>
		);
	}

	if (unicodeEmojiImage.status === 'ready') {
		return (
			<ImageEmoji
				{...props}
				emoji={{
					...emoji,
					altRepresentation: undefined,
					representation: {
						imagePath: unicodeEmojiImage.imagePath,
						width: unicodeEmojiCanvasSize,
						height: unicodeEmojiCanvasSize,
					},
				}}
			/>
		);
	}

	return (
		<EmojiPlaceholder shortName={emoji.shortName} showTooltip={showTooltip} size={fitToHeight} />
	);
};

export const UnicodeEmoji = (props: Props): JSX.Element => {
	const {
		emoji,
		selected,
		selectOnHover,
		className,
		fitToHeight,
		renderUnicodeEmojiAsImage = true,
	} = props;

	if (renderUnicodeEmojiAsImage) {
		return <UnicodeEmojiImage {...props} />;
	}

	const classes = `${emojiNodeStyles} ${selected ? commonSelectedStyles : ''} ${
		selectOnHover ? selectOnHoverStyles : ''
	} ${className ? className : ''}`;

	const emojiText = (emoji.representation as UnicodeRepresentation).unicodeEmoji;
	const defaultSize = `${fitToHeight ?? defaultEmojiHeight}px`;
	const emojiSize = `var(--emoji-common-unicode-size, ${defaultSize})`;

	const style: React.CSSProperties = {
		display: 'inline-flex',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: emojiSize,
		alignItems: 'center',
		aspectRatio: '1/1',
	};

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		<EmojiNodeWrapper {...props} type="unicode" className={classes}>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop */}
			<span style={style}>{emojiText}</span>
		</EmojiNodeWrapper>
	);
};
