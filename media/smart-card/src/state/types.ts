import { CardType } from './store/types';
import { JsonLdCustom } from '../client/types';

export interface CardStore {
  [key: string]: CardState;
}
export interface CardState {
  status: CardType;
  details?: JsonLdCustom;
  lastUpdatedAt: number;
}
