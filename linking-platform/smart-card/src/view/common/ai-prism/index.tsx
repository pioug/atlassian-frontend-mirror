/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { useThemeObserver } from '@atlaskit/tokens';

import { popupContainerStyles } from '../../HoverCard/styled';

import AIGlowingBorder from './ai-glowing-border';
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

const AIPrism = ({
	children,
	isGlowing = true,
	isMoving = true,
	isVisible,
	testId,
}: AIPrismProps) => {
	const { colorMode = 'light' } = useThemeObserver();

	return (
		<AIGlowingBorder
			additionalCss={{
				animatedSvgContainer: css({
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					opacity: isVisible ? 1 : 0,
					transition: 'opacity 0.5s ease',
				}),
			}}
			palette={AI_BORDER_PALETTE[colorMode] ?? AI_BORDER_PALETTE.light}
			isGlowing={isGlowing}
			isMoving={isMoving}
			testId={testId}
		>
			<div
				css={[
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
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

export default AIPrism;
