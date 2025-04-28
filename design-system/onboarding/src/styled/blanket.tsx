/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

// IE11 and Edge: z-index needed because fixed position calculates z-index relative
// to body instead of nearest stacking context (Portal in our case).
const blanketStyles = css({
	position: 'fixed',
	zIndex: 700,
	inset: 0,
	transition: 'opacity 220ms',
});

type BlanketProps = {
	isTinted?: boolean;
	style?: React.CSSProperties;
	onBlanketClicked?: () => void;
};

/**
 * __Blanket__
 *
 * A replacement for `@atlaskit/blanket`.
 *
 * We use this for spotlights instead of `@atlaskit/blanket`
 * because spotlights must sit on top of other layered elements,
 * such as modals, which have their own blankets.
 *
 * @internal
 */
const Blanket = ({ isTinted, onBlanketClicked, style }: BlanketProps) => {
	return (
		// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable
		<div
			role="presentation"
			css={blanketStyles}
			style={
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Pass-through style props are not allowed
					...style,
					backgroundColor: isTinted ? token('color.blanket') : 'transparent',
				} as React.CSSProperties
			}
			onClick={onBlanketClicked}
		/>
	);
};

export default Blanket;
