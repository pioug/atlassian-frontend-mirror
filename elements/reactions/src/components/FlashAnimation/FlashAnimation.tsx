/** @jsx jsx */
import { type PropsWithChildren } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { containerStyle, flashStyle } from './styles';

export type FlashAnimationProps = PropsWithChildren<{
	/**
	 * Optional wrapper div class anme
	 */
	className?: string;
	/**
	 * Show custom animation or render as standard without animation (defaults to false)
	 */
	flash?: boolean;
}>;

/**
 * Test id for wrapper FlashAnimation div
 */
export const RENDER_FLASHANIMATION_TESTID = 'flash-animation';

/**
 * Flash animation background component. See Reaction component for usage.
 */
export const FlashAnimation = (props: FlashAnimationProps) => (
	<div
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		css={[containerStyle, props.flash && flashStyle]}
		data-testid={RENDER_FLASHANIMATION_TESTID}
	>
		{props.children}
	</div>
);
