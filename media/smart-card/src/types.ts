import { JsonLd } from 'json-ld-types';
import { RequestAccessMessageKey } from './messages';
export type { CardContext } from '@atlaskit/link-provider';
import { AccessContext } from './view/types';
import { ActionProps } from './view/BlockCard/components/Action';

export type ResolveResponse = JsonLd.Response;
export type { ProviderProps, CardType } from './state';
export type {
  CardProps,
  CardAppearance,
  CardPlatform,
} from './view/Card/types';
export interface RequestAccessContextProps extends AccessContext {
  action?: ActionProps;
  callToActionMessageKey?: RequestAccessMessageKey;
  descriptiveMessageKey?: RequestAccessMessageKey;
}

export type InlinePreloaderStyle =
  | 'on-left-with-skeleton'
  | 'on-right-without-skeleton';

export type LozengeColor =
  | 'default'
  | 'success'
  | 'removed'
  | 'inprogress'
  | 'new'
  | 'moved';
export interface LozengeProps {
  text: string;
  appearance?: LozengeColor; // defaults to 'default'
  isBold?: boolean; // defaults to false
}
