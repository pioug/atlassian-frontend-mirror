import { JsonLd } from 'json-ld-types';

export type ResolveResponse = JsonLd.Response;
export type { ProviderProps, CardType } from './state';
export type {
  CardProps,
  CardAppearance,
  CardPlatform,
} from './view/Card/types';
export type { CardContext } from './state/context/types';
