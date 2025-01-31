import type { ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import type { SerializedStyles } from '@emotion/react';

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
	 * @deprecated remove on FF clean up of bandicoots-compiled-migration-smartcard
	 * use css instead for compiledcss
	 */
	additionalCss?: {
		// Note, container is never used
		container?: SerializedStyles;
		animatedSvgContainer?: SerializedStyles;
	};
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
	 * @deprecated remove on FF clean up of bandicoots-compiled-migration-smartcard
	 * use css instead for compiledcss
	 */
	additionalCss?: SerializedStyles;
	/**
	 * For compiled css
	 */
	className?: string;
};
