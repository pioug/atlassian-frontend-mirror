/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React from 'react';
import { token } from '@atlaskit/tokens';

import AnimatedSvgContainer from './animated-svg-container';
import type { AIGlowingBorderProps } from './types';
import { INNER_BORDER_RADIUS } from '../constants';

const borderContainerStyles = css({
	display: 'flex',
	position: 'relative',
	padding: token('space.025', '2px'),
	width: 'fit-content',
});

export const borderContentStyles = css({
	borderRadius: INNER_BORDER_RADIUS,
	flexGrow: 1,
	zIndex: 1, // needs to be more than the svg container at least
});

/**
 * The bulk of this file is originally from
 * https://bitbucket.org/atlassian/barrel/src/master/ui/platform/ui-kit/ai
 * with modifications.
 */
const AIGlowingBorder: React.FC<AIGlowingBorderProps> = ({
	children,
	palette,
	isMoving = true,
	isGlowing,
	testId,
	additionalCss,
}) => (
	<div css={[borderContainerStyles, additionalCss?.container]} data-testid={testId}>
		<AnimatedSvgContainer
			palette={palette}
			isMoving={isMoving}
			additionalCss={additionalCss?.animatedSvgContainer}
		/>
		{isGlowing && (
			<AnimatedSvgContainer
				palette={palette}
				isMoving={isMoving}
				isGlowing
				additionalCss={additionalCss?.animatedSvgContainer}
			/>
		)}
		<div css={borderContentStyles}>{children} </div>
	</div>
);

export default AIGlowingBorder;
