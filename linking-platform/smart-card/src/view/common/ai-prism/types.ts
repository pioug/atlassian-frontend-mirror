import { type PropsWithChildren } from 'react';

import { type AIGlowingBorderProps } from './ai-glowing-border/types';

export type AIPrismProps = PropsWithChildren<
	Pick<AIGlowingBorderProps, 'isMoving' | 'isGlowing' | 'testId'> & {
		isVisible?: boolean;
	}
>;

export type AIBorderPalette = {
	blue: string;
	teal: string;
	yellow: string;
};

export type AIThemeBorderPalette = {
	dark: AIBorderPalette;
	light: AIBorderPalette;
};
