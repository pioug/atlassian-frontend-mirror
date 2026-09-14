/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import {
	memo,
	type ForwardRefExoticComponent,
	type MemoExoticComponent,
	type RefAttributes,
} from 'react';

import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';

import type { EmojiDescriptionWithVariations, OnToneSelected, ToneSelection } from '../../types';
import { ToneSelectorInternal } from './ToneSelectorInternal';

export interface Props {
	emoji: EmojiDescriptionWithVariations;
	isVisible: boolean;
	onToneClose?: () => void;
	onToneSelected: OnToneSelected;
	selectedTone?: ToneSelection;
}

export const toneSelectorTestId = 'tone-selector';

export const ToneSelector: any = withAnalyticsEvents()(ToneSelectorInternal);

const _default_1: MemoExoticComponent<
	ForwardRefExoticComponent<Omit<Props, keyof WithAnalyticsEventsProps> & RefAttributes<any>>
> = memo(ToneSelector);

export default _default_1;
