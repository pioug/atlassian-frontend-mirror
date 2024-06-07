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
	/**
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-6348 Internal documentation for deprecation (no external access)}
	 *
	 * Prefer 'actionOptions' prop. Determines whether to show available server actions.
	 */
	showActions?: boolean;
	actionOptions?: CardActionOptions;
	inlinePreloaderStyle?: InlinePreloaderStyle;
}
