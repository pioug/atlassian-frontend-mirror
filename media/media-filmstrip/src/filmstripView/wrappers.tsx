import React, { forwardRef } from 'react';
import type { FilmStripListProps, FilmStripListWrapperProps } from './wrappers-compiled';
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

export const ArrowLeftWrapper: typeof CompiledArrowLeftWrapper = (props) => (
  <CompiledArrowLeftWrapper {...props} />
);

export const ShadowRight: typeof CompiledShadowRight = (props) => (
  <CompiledShadowRight {...props} />
);

export const ArrowRightWrapper: typeof CompiledArrowRightWrapper = (props) => (
  <CompiledArrowRightWrapper {...props} />
);

export const LeftArrow: typeof CompiledLeftArrow = (props) => (
  <CompiledLeftArrow {...props} />
);

export const RightArrow: typeof CompiledRightArrow = (props) => (
  <CompiledRightArrow {...props} />
);

export const FilmStripViewWrapper: typeof CompiledFilmStripViewWrapper = (props) => (
  <CompiledFilmStripViewWrapper {...props} />
);

export const FilmStripListWrapper = forwardRef<HTMLDivElement, FilmStripListWrapperProps>((props, ref) => (
  <CompiledFilmStripListWrapper {...props} ref={ref} />
));

export const FilmStripList = forwardRef<HTMLUListElement, FilmStripListProps>((props, ref) => (
  <CompiledFilmStripList {...props} ref={ref} />
));

export const FilmStripListItem: typeof CompiledFilmStripListItem = (props) => (
  <CompiledFilmStripListItem {...props} />
);
