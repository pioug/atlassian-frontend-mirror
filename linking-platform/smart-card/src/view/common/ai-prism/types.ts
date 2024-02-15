import { AIGlowingBorderProps } from './ai-glowing-border/types';

export type AIPrismProps = Pick<
  AIGlowingBorderProps,
  'isMoving' | 'isGlowing' | 'testId'
> & {
  isVisible?: boolean;
};

export type AIBorderPalette = {
  blue: string;
  yellow: string;
  teal: string;
};

export type AIThemeBorderPalette = {
  dark: AIBorderPalette;
  light: AIBorderPalette;
};
