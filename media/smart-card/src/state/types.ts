import { CardType } from './store/types';
import { JsonLd } from '../client/types';

export interface CardStore {
  [key: string]: CardState;
}
export interface CardState {
  status: CardType;
  details?: JsonLd;
  lastUpdatedAt: number;
}
