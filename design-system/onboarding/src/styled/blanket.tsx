/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef } from 'react';

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
	className?: string;
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
const Blanket = forwardRef(
	(
		{ isTinted, onBlanketClicked, style, className }: BlanketProps,
		ref: React.ForwardedRef<HTMLDivElement>,
	) => {
		return (
			// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable
			<div
				ref={ref}
				role="presentation"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={className}
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
	},
);

export default Blanket;
