export type CardAppearance = 'inline' | 'block' | 'embed';

export interface CardProvider {
  resolve(url: string, appearance: CardAppearance): Promise<any>;
  findPattern(url: string): Promise<boolean>;
}
