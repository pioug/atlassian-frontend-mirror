import { type EventHandler, type KeyboardEvent, type MouseEvent } from 'react';

import { type JsonLd } from 'json-ld-types';

import type { CardActionOptions, CardAppearance, OnResolveCallback } from '../Card/types';
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
