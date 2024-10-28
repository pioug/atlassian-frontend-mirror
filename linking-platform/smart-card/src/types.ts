import { type JsonLd } from 'json-ld-types';

export type { CardContext } from '@atlaskit/link-provider';
import { type LozengeProps as AtlaskitLozengeProps } from '@atlaskit/lozenge';

import { type RequestAccessMessageKey } from './messages';
import { type ActionProps } from './view/BlockCard/components/Action';
import { type AccessContext } from './view/types';

export type ResolveResponse = JsonLd.Response;
export type { ProviderProps, CardType } from './state';
export type { CardProps, CardAppearance, CardPlatform } from './view/Card/types';
export interface RequestAccessContextProps extends AccessContext {
	action?: ActionProps;
	callToActionMessageKey?: RequestAccessMessageKey;
	descriptiveMessageKey?: RequestAccessMessageKey;
}

export type InlinePreloaderStyle = 'on-left-with-skeleton' | 'on-right-without-skeleton';

export type LozengeColor = 'default' | 'success' | 'removed' | 'inprogress' | 'new' | 'moved';

export interface LozengeProps {
	text: string;
	appearance?: LozengeColor; // defaults to 'default'
	style?: AtlaskitLozengeProps['style'];
	isBold?: boolean; // defaults to false
}
