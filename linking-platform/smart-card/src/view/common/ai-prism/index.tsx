/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token, useThemeObserver } from '@atlaskit/tokens';

import AIGlowingBorder from './ai-glowing-border';
import AIPrismOld from './AIPrismOld';
import { AI_BORDER_PALETTE } from './constants';
import type { AIPrismProps } from './types';

const contentStyles = css({
	transition: 'box-shadow 0.5s ease',
});

const contentStylesPrismVisible = css({
	// intentionally set opacity to 0 to remove the shadow with fade out animation
	boxShadow:
		// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
		'0px 8px 12px rgba(9, 30, 66, 0),0px 0px 1px rgba(9, 30, 66, 0)',
});

const animatedSvgContainerStyles = cssMap({
	true: {
		transition: 'opacity 0.5s ease',
		opacity: 1,
	},
	false: {
		transition: 'opacity 0.5s ease',
		opacity: 0,
	},
});

const popupContainerStyles = css({
	borderRadius: token('border.radius.200', '8px'),
	backgroundColor: token('elevation.surface.overlay', 'white'),
	boxShadow: token(
		'elevation.shadow.overlay',
		'0px 8px 12px rgba(9, 30, 66, 0.15),0px 0px 1px rgba(9, 30, 66, 0.31)',
	),
});

const AIPrismNew = ({
	children,
	isGlowing = true,
	isMoving = true,
	isVisible,
	testId,
}: AIPrismProps) => {
	const { colorMode = 'light' } = useThemeObserver();

	return (
		<AIGlowingBorder
			css={[animatedSvgContainerStyles[isVisible ? 'true' : 'false']]}
			palette={AI_BORDER_PALETTE[colorMode] ?? AI_BORDER_PALETTE.light}
			isGlowing={isGlowing}
			isMoving={isMoving}
			testId={testId}
		>
			<div
				css={[
					popupContainerStyles,
					contentStyles,
					isVisible ? contentStylesPrismVisible : undefined,
				]}
			>
				{children}
			</div>
		</AIGlowingBorder>
	);
};

const AIPrism = (props: AIPrismProps) => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <AIPrismNew {...props} />;
	}
	return <AIPrismOld {...props} />;
};

export default AIPrism;
