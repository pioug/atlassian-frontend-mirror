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
	xsmall: {
		width: '16px',
		height: '16px',
	},
	small: {
		width: '24px',
		height: '24px',
	},
	medium: {
		width: '32px',
		height: '32px',
	},
	large: {
		width: '40px',
		height: '40px',
	},
	xlarge: {
		width: '96px',
		height: '96px',
	},
	xxlarge: {
		width: '128px',
		height: '128px',
	},
});

const borderRadiusMap = unboundCssMap({
	xsmall: {
		borderRadius: token('radius.xsmall'),
		'&::after': {
			borderRadius: token('radius.xsmall'),
		},
	},
	small: {
		borderRadius: token('radius.xsmall'),
		'&::after': {
			borderRadius: token('radius.xsmall'),
		},
	},
	medium: {
		borderRadius: token('radius.small', '3px'),
		'&::after': {
			borderRadius: token('radius.small', '3px'),
		},
	},
	large: {
		borderRadius: token('radius.small', '3px'),
		'&::after': {
			borderRadius: token('radius.small', '3px'),
		},
	},
	xlarge: {
		borderRadius: token('radius.medium'),
		'&::after': {
			borderRadius: token('radius.medium'),
		},
	},
	xxlarge: {
		borderRadius: token('radius.xlarge'),
		'&::after': {
			borderRadius: token('radius.xlarge'),
		},
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
export const AvatarContent = forwardRef<HTMLElement, AvatarContentProps>(({ children }, ref) => {
	useEnsureIsInsideAvatar();
	const {
		as: Container,
		appearance,
		avatarImage,
		// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
		borderColor = fg('platform-component-visual-refresh')
			? token('elevation.surface')
			: token('elevation.surface.overlay', '#FFFFFF'),
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

	return (
		<Container
			css={[
				unboundStyles.root,
				styles.root,
				borderRadiusMap[size],
				appearance === 'circle' && styles.circle,
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
});
