/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */
import { type CSSProperties, forwardRef, type ReactNode } from 'react';

import { cssMap as unboundCssMap } from '@compiled/react';

import { cssMap, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { useAvatarContent, useEnsureIsInsideAvatar } from './context';

const boxShadowCssVar = '--avatar-box-shadow';
const bgColorCssVar = '--avatar-bg-color';

const styles = cssMap({
	root: {
		display: 'flex',
		position: 'static',
		alignItems: 'stretch',
		justifyContent: 'center',
		flexDirection: 'column',
		border: 'none',
		cursor: 'inherit',
		marginBlockEnd: token('space.025'),
		marginBlockStart: token('space.025'),
		marginInlineEnd: token('space.025'),
		marginInlineStart: token('space.025'),
		outline: 'none',
		overflow: 'hidden',
		paddingBlockEnd: token('space.0'),
		paddingBlockStart: token('space.0'),
		paddingInlineEnd: token('space.0'),
		paddingInlineStart: token('space.0'),
		transform: 'translateZ(0)',
		transition: 'transform 200ms, opacity 200ms',
		'&::after': {
			width: '100%',
			position: 'absolute',
			inset: token('space.0'),
			backgroundColor: 'transparent',
			content: "' '",
			opacity: 0,
			pointerEvents: 'none',
			transition: 'opacity 200ms',
		},
		'&:focus-visible': {
			boxShadow: 'initial',
			outlineColor: token('color.border.focused', '#2684FF'),
			outlineOffset: token('space.025', '2px'),
			outlineStyle: 'solid',
			outlineWidth: token('border.width.focused', '2px'),
		},
		'@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)': {
			'&:focus-visible': {
				outlineWidth: token('border.width', '1px'),
			},
		},
	},
	circle: {
		borderRadius: token('radius.full', '50%'),
		'&::after': {
			borderRadius: token('radius.full', '50%'),
		},
	},
	square: {
		borderRadius: token('radius.tile'),
	},
	positionRelative: {
		position: 'relative',
	},
	disabled: {
		cursor: 'not-allowed',
		'&::after': {
			backgroundColor: token('elevation.surface', '#FFFFFF'),
			opacity: token('opacity.disabled', '0.7'),
		},
	},
});

const unboundStyles = unboundCssMap({
	root: {
		boxSizing: 'content-box',
		backgroundColor: `var(${bgColorCssVar})`,
		boxShadow: `var(${boxShadowCssVar})`,
	},
	hexagonFocusContainer: {
		backgroundColor: 'transparent',
		// NOTE: The left/right sides of this are intentionally inset by 10% on each side to be more visually appealing and work with circular images.
		clipPath: `polygon(45% 1.33975%, 46.5798% 0.60307%, 48.26352% 0.15192%, 50% 0%, 51.73648% 0.15192%, 53.4202% 0.60307%, 55% 1.33975%, 89.64102% 21.33975%, 91.06889% 22.33956%, 92.30146% 23.57212%, 93.30127% 25%, 94.03794% 26.5798%, 94.48909% 28.26352%, 94.64102% 30%, 94.64102% 70%, 94.48909% 71.73648%, 94.03794% 73.4202%, 93.30127% 75%, 92.30146% 76.42788%, 91.06889% 77.66044%, 89.64102% 78.66025%, 55% 98.66025%, 53.4202% 99.39693%, 51.73648% 99.84808%, 50% 100%, 48.26352% 99.84808%, 46.5798% 99.39693%, 45% 98.66025%, 10.35898% 78.66025%, 8.93111% 77.66044%, 7.69854% 76.42788%, 6.69873% 75%, 5.96206% 73.4202%, 5.51091% 71.73648%, 5.35898% 70%, 5.35898% 30%, 5.51091% 28.26352%, 5.96206% 26.5798%, 6.69873% 25%, 7.69854% 23.57212%, 8.93111% 22.33956%, 10.35898% 21.33975%)`,

		// NOTE: The `clip-path` changes padding in an unexpected way, so `1.25` is a magic number
		// to increase the padding on this outer layer, but keep `padding-inline` unchanged.
		// The goal here is emulating a 2px "outline"
		paddingBlock: `calc(${token('border.width.selected')} * 1.25)`,
		paddingInline: token('border.width.selected'),
		// NOTE: `marginInline` is set in `marginInlineMap[size]`
		marginBlock: `calc(${token('border.width.selected')} * 1.25 * -1)`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- We have to hack the focus together with this hexagon `clip-path`
		'&:has(:focus-visible)': {
			backgroundColor: token('color.border.focused'),
		},
	},
	hexagonBorderContainer: {
		backgroundColor: `var(${bgColorCssVar})`,
		clipPath: 'inherit',
		// NOTE: The `clip-path` and `background` overflows padding in an unexpected way, so
		// `0.5` and `0.4` are relatively magic numbers, but the ratio between block and inline is consistent.
		// The goal here is emulating a 2px "border"
		paddingBlock: `calc(${token('border.width.selected')} * 0.5)`,
		paddingInline: `calc(${token('border.width.selected')} * 0.4)`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- We have to hack the focus together with this hexagon `clip-path`
		'&:has(:focus-visible)': {
			// NOTE: For `circle` and `square` this is different. This would be border:none` and
			// `outline:2px white` so `borer:none` or `box-shadow:none` would fall through to the background.
			// But we can't do that here and `background:transparent` would show the `hexagonFocusContainer` color instead
			// The goal here is emulating a `border:none` and showing `outline:2px white` with `outline-offset:2px`
			// as seen in `circle` and `square` appearances.
			backgroundColor: token('elevation.surface'),
		},
	},
	hexagon: {
		clipPath: 'inherit',
		// Drop some styles that don't work with `clip-path`…
		// Eg. we have to set outline and box shadows via wrappers due to `clip-path` complexities…
		boxShadow: 'unset',
		borderRadius: 0,
		'&::after': { borderRadius: 0 },
		'&:focus-visible': {
			boxShadow: 'unset',
			outlineWidth: 0,
		},
		'@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)': {
			'&:focus-visible': {
				outlineWidth: 0,
			},
		},
	},
	interactive: {
		cursor: 'pointer',
		'&:hover::after': {
			backgroundColor: token('color.interaction.hovered', 'rgba(9, 30, 66, 0.36)'),
			opacity: '1',
		},
		'&:active::after': {
			backgroundColor: token('color.interaction.pressed', 'rgba(9, 30, 66, 0.36)'),
			opacity: '1',
		},
		'@media screen and (forced-colors: active)': {
			'&:focus-visible': {
				outlineWidth: 1,
			},
		},
	},
});

const widthHeightMap = cssMap({
	xsmall: { width: '16px', height: '16px' },
	small: { width: '24px', height: '24px' },
	medium: { width: '32px', height: '32px' },
	large: { width: '40px', height: '40px' },
	xlarge: { width: '96px', height: '96px' },
	xxlarge: { width: '128px', height: '128px' },
});

const marginAdjustmentMap = unboundCssMap({
	// NOTE: These are relatively magical, manual adjustments to adjust for the imperfection of this hexagon.
	// The hexagon is a 9:10 ratio so we use negative margin to align it in AvatarGroup and other places.
	xsmall: { marginInline: `calc(${token('border.width.selected')} * -1 - 1px)` },
	small: { marginInline: `calc(${token('border.width.selected')} * -1 - 1px)` },
	medium: { marginInline: `calc(${token('border.width.selected')} * -1 - 2px)` },
	large: { marginInline: `calc(${token('border.width.selected')} * -1 - 2px)` },
	xlarge: { marginInline: `calc(${token('border.width.selected')} * -1 - 4px)` },
	xxlarge: { marginInline: `calc(${token('border.width.selected')} * -1 - 8px)` },
});

const borderRadiusMap = unboundCssMap({
	xsmall: {
		borderRadius: token('radius.xsmall'),
		'&::after': { borderRadius: token('radius.xsmall') },
	},
	small: {
		borderRadius: token('radius.xsmall'),
		'&::after': { borderRadius: token('radius.xsmall') },
	},
	medium: {
		borderRadius: token('radius.small'),
		'&::after': { borderRadius: token('radius.small') },
	},
	large: {
		borderRadius: token('radius.small'),
		'&::after': { borderRadius: token('radius.small') },
	},
	xlarge: {
		borderRadius: token('radius.medium'),
		'&::after': { borderRadius: token('radius.medium') },
	},
	xxlarge: {
		borderRadius: token('radius.xlarge'),
		'&::after': { borderRadius: token('radius.xlarge') },
	},
});

type AvatarContentProps = {
	children?: ReactNode;
};

/**
 * __Avatar content__
 *
 * Avatar content renders the avatar content. It can be composed with the Avatar component
 * to create a custom avatar.
 *
 * - [Examples](https://atlassian.design/components/avatar/examples)
 * - [Code](https://atlassian.design/components/avatar/code)
 * - [Usage](https://atlassian.design/components/avatar/usage)
 */
export const AvatarContent: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<AvatarContentProps> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, AvatarContentProps>(({ children }, ref) => {
	useEnsureIsInsideAvatar();
	const {
		as: Container,
		appearance,
		avatarImage,
		borderColor = token('elevation.surface'),
		href,
		isDisabled,
		label,
		onClick,
		ref: contextRef,
		tabIndex,
		target,
		testId,
		size,
		stackIndex,
	} = useAvatarContent();

	const isInteractive = Boolean(onClick || href || isDisabled);

	const renderedContent = (
		<Container
			css={[
				unboundStyles.root,
				styles.root,
				!fg('platform_dst_avatar_tile') && borderRadiusMap[size],
				appearance === 'square' && fg('platform_dst_avatar_tile') && styles.square,
				appearance === 'circle' && styles.circle,
				appearance === 'hexagon' && unboundStyles.hexagon,
				widthHeightMap[size],
				stackIndex !== undefined && styles.positionRelative,
				isInteractive && !isDisabled && unboundStyles.interactive,
				isDisabled && styles.disabled,
			]}
			style={
				{
					[bgColorCssVar]: borderColor,
					[boxShadowCssVar]: `0 0 0 2px ${borderColor}`,
				} as CSSProperties
			}
			ref={
				(ref || contextRef) as React.Ref<HTMLAnchorElement & HTMLButtonElement & HTMLSpanElement>
			}
			aria-label={isInteractive ? label : undefined}
			onClick={onClick}
			tabIndex={tabIndex}
			data-testid={testId}
			disabled={isDisabled}
			type={Container === 'button' ? 'button' : undefined}
			{...(href && {
				href,
				target,
				rel: target === '_blank' ? 'noopener noreferrer' : undefined,
			})}
		>
			{children || avatarImage}
		</Container>
	);

	if (appearance !== 'hexagon') {
		return renderedContent;
	}

	// For a Hexagon Avatar in order to have hexagonal "border" and "outline", we have to
	// layer multiple elements and use their background colors to create the different layers.
	return (
		<div
			// NOTE: This is effectively the "outline" of the hexagon.
			css={[unboundStyles.hexagonFocusContainer, marginAdjustmentMap[size]]}
			style={
				{
					[bgColorCssVar]: borderColor,
					[boxShadowCssVar]: `0 0 0 2px ${borderColor}`,
				} as CSSProperties
			}
		>
			<div
				// NOTE: This is effectively the "border" of the hexagon.
				css={unboundStyles.hexagonBorderContainer}
			>
				{renderedContent}
			</div>
		</div>
	);
});
