import tokenNames from '../../../src/artifacts/token-names';
import { baseTokens } from '../components/base-token-editor';

export type TokenName = keyof typeof tokenNames;
export type BaseTokens = typeof baseTokens;
export type ColorMode = 'light' | 'dark';
export type Theme = {
  name: TokenName;
  value: string;
}[];
