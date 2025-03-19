import type { ReactNode } from 'react';

import type { AIBorderPalette } from '../types';

/**
 * The bulk of this file is originally from
 * https://bitbucket.org/atlassian/barrel/src/master/ui/platform/ui-kit/ai
 * with modifications.
 */

export type AIGlowingBorderProps = {
	children: ReactNode;
	palette: AIBorderPalette;
	isMoving?: boolean;
	isGlowing?: boolean;
	testId?: string;
	/**
	 * For compiled css
	 */
	className?: string;
};

export type AnimatedSvgContainerProps = {
	palette: AIBorderPalette;
	isMoving?: boolean;
	isGlowing?: boolean;
	/**
	 * For compiled css
	 */
	className?: string;
};
