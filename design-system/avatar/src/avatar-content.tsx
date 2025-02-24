/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */
import { type CSSProperties, forwardRef, type ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { N0, N70A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { useAvatarContent, useEnsureIsInsideAvatar } from './context';

const boxShadowCssVar = '--avatar-box-shadow';
const bgColorCssVar = '--avatar-bg-color';

const styles = {
	root: css({
		display: 'flex',
		boxSizing: 'content-box',
		position: 'static',
		alignItems: 'stretch',
		justifyContent: 'center',
		flexDirection: 'column',
		backgroundColor: `var(${bgColorCssVar})`,
		border: 'none',
		boxShadow: `var(${boxShadowCssVar})`,
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
			boxShadow: 'none',
			outlineColor: token('color.border.focused', '#2684FF'),
			outlineOffset: token('border.width.outline'),
			outlineStyle: 'solid',
			outlineWidth: token('border.width.outline', '2px'),
		},
		'@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)': {
			'&:focus-visible': {
				outlineWidth: token('border.width', '1px'),
			},
		},
	}),
	circle: css({
		borderRadius: token('border.radius.circle', '50%'),
		'&::after': {
			borderRadius: token('border.radius.circle', '50%'),
		},
	}),
	positionRelative: css({
		position: 'relative',
	}),
	interactive: css({
		cursor: 'pointer',
		'&:hover': {
			'&::after': {
				backgroundColor: token('color.interaction.hovered', N70A),
				opacity: 1,
			},
		},
		'&:active': {
			transform: `scale(0.9)`,
			'&::after': {
				backgroundColor: token('color.interaction.pressed', N70A),
				opacity: 1,
			},
		},
		'@media screen and (forced-colors: active)': {
			'&:focus-visible': {
				outlineWidth: 1,
			},
		},
	}),
	disabled: css({
		cursor: 'not-allowed',
		'&::after': {
			backgroundColor: token('elevation.surface', N0),
			opacity: token('opacity.disabled', '0.7'),
		},
	}),
};

const widthHeightMap = {
	xsmall: css({
		width: '16px',
		height: '16px',
	}),
	small: css({
		width: '24px',
		height: '24px',
	}),
	medium: css({
		width: '32px',
		height: '32px',
	}),
	large: css({
		width: '40px',
		height: '40px',
	}),
	xlarge: css({
		width: '96px',
		height: '96px',
	}),
	xxlarge: css({
		width: '128px',
		height: '128px',
	}),
};

const borderRadiusMap = {
	xsmall: css({
		borderRadius: '2px',
		'&::after': {
			borderRadius: '2px',
		},
	}),
	small: css({
		borderRadius: '2px',
		'&::after': {
			borderRadius: '2px',
		},
	}),
	medium: css({
		borderRadius: '3px',
		'&::after': {
			borderRadius: '3px',
		},
	}),
	large: css({
		borderRadius: '3px',
		'&::after': {
			borderRadius: '3px',
		},
	}),
	xlarge: css({
		borderRadius: '6px',
		'&::after': {
			borderRadius: '6px',
		},
	}),
	xxlarge: css({
		borderRadius: '12px',
		'&::after': {
			borderRadius: '12px',
		},
	}),
};

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
			: token('elevation.surface.overlay', N0),
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
				styles.root,
				borderRadiusMap[size],
				appearance === 'circle' && styles.circle,
				widthHeightMap[size],
				stackIndex !== undefined && styles.positionRelative,
				isInteractive && !isDisabled && styles.interactive,
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
