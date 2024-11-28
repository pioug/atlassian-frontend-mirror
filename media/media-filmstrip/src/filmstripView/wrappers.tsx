import React, { forwardRef } from 'react';
import { fg } from '@atlaskit/platform-feature-flags';
import {
	ArrowLeftWrapper as EmotionArrowLeftWrapper,
	ArrowRightWrapper as EmotionArrowRightWrapper,
	ShadowRight as EmotionShadowRight,
	LeftArrow as EmotionLeftArrow,
	RightArrow as EmotionRightArrow,
	FilmStripViewWrapper as EmotionFilmStripViewWrapper,
	FilmStripListWrapper as EmotionFilmStripListWrapper,
	FilmStripList as EmotionFilmStripList,
	FilmStripListItem as EmotionFilmStripListItem,
} from './wrappers-emotion';
import type { FilmStripListProps, FilmStripListWrapperProps } from './wrappers-emotion';
import {
	ArrowLeftWrapper as CompiledArrowLeftWrapper,
	ArrowRightWrapper as CompiledArrowRightWrapper,
	ShadowRight as CompiledShadowRight,
	LeftArrow as CompiledLeftArrow,
	RightArrow as CompiledRightArrow,
	FilmStripViewWrapper as CompiledFilmStripViewWrapper,
	FilmStripListWrapper as CompiledFilmStripListWrapper,
	FilmStripList as CompiledFilmStripList,
	FilmStripListItem as CompiledFilmStripListItem,
} from './wrappers-compiled';

export const ArrowLeftWrapper: typeof EmotionArrowLeftWrapper = (props) =>
	fg('platform_media_compiled') ? (
		<CompiledArrowLeftWrapper {...props} />
	) : (
		<EmotionArrowLeftWrapper {...props} />
	);

export const ShadowRight: typeof EmotionShadowRight = (props) =>
	fg('platform_media_compiled') ? (
		<CompiledShadowRight {...props} />
	) : (
		<EmotionShadowRight {...props} />
	);

export const ArrowRightWrapper: typeof EmotionArrowRightWrapper = (props) =>
	fg('platform_media_compiled') ? (
		<CompiledArrowRightWrapper {...props} />
	) : (
		<EmotionArrowRightWrapper {...props} />
	);

export const LeftArrow: typeof EmotionLeftArrow = (props) =>
	fg('platform_media_compiled') ? (
		<CompiledLeftArrow {...props} />
	) : (
		<EmotionLeftArrow {...props} />
	);

export const RightArrow: typeof EmotionRightArrow = (props) =>
	fg('platform_media_compiled') ? (
		<CompiledRightArrow {...props} />
	) : (
		<EmotionRightArrow {...props} />
	);

export const FilmStripViewWrapper: typeof EmotionFilmStripViewWrapper = (props) =>
	fg('platform_media_compiled') ? (
		<CompiledFilmStripViewWrapper {...props} />
	) : (
		<EmotionFilmStripViewWrapper {...props} />
	);

export const FilmStripListWrapper = forwardRef<HTMLDivElement, FilmStripListWrapperProps>(
	(props, ref) =>
		fg('platform_media_compiled') ? (
			<CompiledFilmStripListWrapper {...props} ref={ref} />
		) : (
			<EmotionFilmStripListWrapper {...props} ref={ref} />
		),
);

export const FilmStripList = forwardRef<HTMLUListElement, FilmStripListProps>((props, ref) =>
	fg('platform_media_compiled') ? (
		<CompiledFilmStripList {...props} ref={ref} />
	) : (
		<EmotionFilmStripList {...props} ref={ref} />
	),
);

export const FilmStripListItem: typeof EmotionFilmStripListItem = (props) =>
	fg('platform_media_compiled') ? (
		<CompiledFilmStripListItem {...props} />
	) : (
		<EmotionFilmStripListItem {...props} />
	);
