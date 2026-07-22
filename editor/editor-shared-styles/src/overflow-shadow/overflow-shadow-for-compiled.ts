import { token } from '@atlaskit/tokens';

/**
 * Compiled CSS-compatible variant of {@link overflowShadow}. Returns a plain
 * CSS string (stack of `linear-gradient` layers) suitable for assignment to a
 * `background-image` property in a `cssMap`/`css` declaration.
 *
 * @param options.leftCoverWidth - Width of the left cover layer. Defaults to `token('space.100')`.
 * @param options.rightCoverWidth - Width of the right cover layer. Defaults to `token('space.100')`.
 */
export const overflowShadowForCompiled = ({
	leftCoverWidth,
	rightCoverWidth,
}: {
	leftCoverWidth?: string;
	rightCoverWidth?: string;
}): string => {
	const width = token('space.100');
	const leftCoverWidthResolved = leftCoverWidth || width;
	const rightCoverWidthResolved = rightCoverWidth || width;

	return [
		/* shadow cover left */
		`linear-gradient(to right, ${token('color.background.neutral')} ${leftCoverWidthResolved}, transparent ${leftCoverWidthResolved})`,
		/* shadow cover background left */
		`linear-gradient(to right, ${token('elevation.surface.raised')} ${leftCoverWidthResolved}, transparent ${leftCoverWidthResolved})`,
		/* shadow cover right */
		`linear-gradient(to left, ${token('color.background.neutral')} ${rightCoverWidthResolved}, transparent ${rightCoverWidthResolved})`,
		/* shadow cover background right */
		`linear-gradient(to left, ${token('elevation.surface.raised')} ${rightCoverWidthResolved}, transparent ${rightCoverWidthResolved})`,
		/* overflow shadow right spread */
		`linear-gradient(to left, ${token('elevation.shadow.overflow.spread')} 0, ${token('utility.UNSAFE.transparent')} ${width})`,
		/* overflow shadow right perimeter */
		`linear-gradient(to left, ${token('elevation.shadow.overflow.perimeter')} 0, ${token('utility.UNSAFE.transparent')} ${width})`,
		/* overflow shadow left spread */
		`linear-gradient(to right, ${token('elevation.shadow.overflow.spread')} 0, ${token('utility.UNSAFE.transparent')} ${width})`,
		/* overflow shadow left perimeter */
		`linear-gradient(to right, ${token('elevation.shadow.overflow.perimeter')} 0, ${token('utility.UNSAFE.transparent')} ${width})`,
	].join(', ');
};
