export interface FigmaPaint {
  blendMode: 'NORMAL';
  color: { r: number; g: number; b: number };
  opacity: number;
  type: 'SOLID';
  visible: boolean;
}

export interface FigmaPaintStyle {
  name: string;
  paints: Array<FigmaPaint>;
  description: string;
  remove(): void;
}

export interface FigmaEffect {
  blendMode: 'NORMAL';
  color: { r: number; g: number; b: number; a: number };
  offset: { x: number; y: number };
  radius: number;
  spread?: number;
  type: 'DROP_SHADOW' | 'INNER_SHADOW';
  visible: boolean;
}

export interface FigmaEffectStyle {
  name: string;
  effects: Array<FigmaEffect>;
  description: string;
  remove(): void;
}
