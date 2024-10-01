import { type EventHandler, type MouseEvent, type KeyboardEvent } from 'react';
import type { CardAppearance, OnResolveCallback, CardActionOptions } from '../Card/types';
import { type JsonLd } from 'json-ld-types';
import { type InlinePreloaderStyle } from '../types';

export interface CardWithDataContentProps {
	id?: string;
	appearance: CardAppearance;
	data: JsonLd.Data.BaseData;
	onClick?: EventHandler<MouseEvent | KeyboardEvent>;
	isSelected?: boolean;
	testId?: string;
	onResolve?: OnResolveCallback;
	actionOptions?: CardActionOptions;
	inlinePreloaderStyle?: InlinePreloaderStyle;
}
