/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import AIGlowingBorderOld from './AIGlowingBorderOld';
import AnimatedSvgContainer from './animated-svg-container';
import type { AIGlowingBorderProps } from './types';

const borderContainerStyles = css({
	display: 'flex',
	position: 'relative',
	paddingTop: token('space.025', '2px'),
	paddingRight: token('space.025', '2px'),
	paddingBottom: token('space.025', '2px'),
	paddingLeft: token('space.025', '2px'),
	width: 'fit-content',
});

const borderContentStyles = css({
	borderRadius: 8,
	flexGrow: 1,
	zIndex: 1, // needs to be more than the svg container at least
});

/**
 * The bulk of this file is originally from
 * https://bitbucket.org/atlassian/barrel/src/master/ui/platform/ui-kit/ai
 * with modifications.
 */
const AIGlowingBorderNew = ({
	children,
	palette,
	isMoving = true,
	isGlowing,
	testId,
	className,
}: AIGlowingBorderProps) => (
	<div css={[borderContainerStyles]} data-testid={testId}>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop */}
		<AnimatedSvgContainer palette={palette} isMoving={isMoving} className={className} />
		{isGlowing && (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
			<AnimatedSvgContainer palette={palette} isMoving={isMoving} isGlowing className={className} />
		)}
		<div css={borderContentStyles}>{children} </div>
	</div>
);

const AIGlowingBorder = (props: AIGlowingBorderProps) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <AIGlowingBorderNew {...props} />;
	}
	return <AIGlowingBorderOld {...props} />;
};

export default AIGlowingBorder;
