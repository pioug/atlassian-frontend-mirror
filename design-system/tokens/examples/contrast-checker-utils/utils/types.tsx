import { type ActiveTokens } from '@atlaskit/tokens';

import { type baseTokens } from '../components/base-token-editor';
export type TokenName = ActiveTokens;
export type BaseTokens = typeof baseTokens;
export type ColorMode = 'light' | 'dark';
export type Theme = {
	name: ActiveTokens;
	value: string;
}[];
