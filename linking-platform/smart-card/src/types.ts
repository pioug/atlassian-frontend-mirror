import { type JsonLd } from 'json-ld-types';

export { type CardContext } from '@atlaskit/link-provider';
import { type LozengeProps as AtlaskitLozengeProps } from '@atlaskit/lozenge';

/** @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-15961 Internal documentation for deprecation (no external access)} */
export type ResolveResponse = JsonLd.Response;
export { type ProviderProps, type CardType } from './state';
export { type CardProps, type CardAppearance, type CardPlatform } from './view/Card/types';

export type InlinePreloaderStyle = 'on-left-with-skeleton' | 'on-right-without-skeleton';

export type LozengeColor = 'default' | 'success' | 'removed' | 'inprogress' | 'new' | 'moved';

export interface LozengeProps {
	text: string;
	appearance?: LozengeColor; // defaults to 'default'
	style?: AtlaskitLozengeProps['style'];
	isBold?: boolean; // defaults to false
}
