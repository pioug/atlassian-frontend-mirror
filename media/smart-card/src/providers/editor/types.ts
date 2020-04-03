import { CardAppearance } from '../../view/Card';
export interface CardProvider {
  resolve(url: string, appearance: CardAppearance): Promise<any>;
}
export type ORSCheckResponse = {
  isSupported: boolean;
};
