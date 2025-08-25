import type { ReactNode } from 'react';

import type { AIBorderPalette } from '../types';

/**
 * The bulk of this file is originally from
 * https://bitbucket.org/atlassian/barrel/src/master/ui/platform/ui-kit/ai
 * with modifications.
 */

export type AIGlowingBorderProps = {
	children: ReactNode;
	/**
	 * For compiled css
	 */
	className?: string;
	isGlowing?: boolean;
	isMoving?: boolean;
	palette: AIBorderPalette;
	testId?: string;
};

export type AnimatedSvgContainerProps = {
	/**
	 * For compiled css
	 */
	className?: string;
	isGlowing?: boolean;
	isMoving?: boolean;
	palette: AIBorderPalette;
};
