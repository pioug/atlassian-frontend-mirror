export type CardAppearance = 'inline' | 'block';

export interface CardProvider {
  resolve(url: string, appearance: CardAppearance): Promise<any>;
}
