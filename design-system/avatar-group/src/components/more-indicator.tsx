/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, forwardRef, useCallback } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { type AppearanceType, type AvatarClickEventHandler } from '@atlaskit/avatar';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { type AvatarGroupSize } from './types';

const boxShadowCssVar = '--avatar-box-shadow';

const styles = cssMap({
	root: {
		display: 'flex',
		boxSizing: 'content-box',
		marginBlockStart: token('space.025'),
		marginInlineEnd: token('space.025'),
		marginBlockEnd: token('space.025'),
		marginInlineStart: token('space.025'),
		paddingBlockStart: token('space.0'),
		paddingInlineEnd: token('space.0'),
		paddingBlockEnd: token('space.0'),
		paddingInlineStart: token('space.0'),
		alignItems: 'stretch',
		justifyContent: 'center',
		flexDirection: 'column',
		border: 'none',
		cursor: 'pointer',
		outline: 'none',
		backgroundColor: token('color.background.neutral'),
		color: token('color.text'),
		boxShadow: `var(${boxShadowCssVar})`,
		overflow: 'hidden',
		transform: 'translateZ(0)',
		transition: 'transform 200ms, opacity 200ms',
		'&:hover': {
			backgroundColor: token('color.background.neutral.hovered'),
			color: token('color.text'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.pressed'),
			color: token('color.text'),
			transform: `scale(0.9)`,
		},
		'&:focus-visible': {
			boxShadow: 'none',
			outlineColor: token('color.border.focused', '#2684FF'),
			outlineStyle: 'solid',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			outlineOffset: 2,
			outlineWidth: 2,
		},
		'@media screen and (forced-colors: active)': {
			'&:focus-visible': {
				outlineWidth: 1,
			},
		},
	},
	circle: {
		borderRadius: token('radius.full', '50%'),
	},
	active: {
		backgroundColor: token('color.background.selected'),
		boxShadow: `0 0 0 ${token('border.width.selected')} ${token('color.border.selected')}`,
		color: token('color.text.selected'),
		transform: `scale(0.9)`,
		'&:hover': {
			backgroundColor: token('color.background.selected.hovered'),
			color: token('color.text.selected'),
		},
		'&:active': {
			backgroundColor: token('color.background.selected.pressed'),
			color: token('color.text.selected'),
		},
	},
	disabled: {
		cursor: 'not-allowed',
		'&::after': {
			opacity: token('opacity.disabled', '0.7'),
			backgroundColor: token('elevation.surface'),
		},
	},
	hexagon: {
		// NOTE: This is reused from `avatar-content.tsx`
		clipPath: 'polygon(45% 1.33975%, 46.5798% 0.60307%, 48.26352% 0.15192%, 50% 0%, 51.73648% 0.15192%, 53.4202% 0.60307%, 55% 1.33975%, 89.64102% 21.33975%, 91.06889% 22.33956%, 92.30146% 23.57212%, 93.30127% 25%, 94.03794% 26.5798%, 94.48909% 28.26352%, 94.64102% 30%, 94.64102% 70%, 94.48909% 71.73648%, 94.03794% 73.4202%, 93.30127% 75%, 92.30146% 76.42788%, 91.06889% 77.66044%, 89.64102% 78.66025%, 55% 98.66025%, 53.4202% 99.39693%, 51.73648% 99.84808%, 50% 100%, 48.26352% 99.84808%, 46.5798% 99.39693%, 45% 98.66025%, 10.35898% 78.66025%, 8.93111% 77.66044%, 7.69854% 76.42788%, 6.69873% 75%, 5.96206% 73.4202%, 5.51091% 71.73648%, 5.35898% 70%, 5.35898% 30%, 5.51091% 28.26352%, 5.96206% 26.5798%, 6.69873% 25%, 7.69854% 23.57212%, 8.93111% 22.33956%, 10.35898% 21.33975%)',
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

const borderRadiusMap = cssMap({
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

const fontMap = cssMap({
	small: {
		font: token('font.body.small'),
	},
	medium: {
		font: token('font.body.small'),
	},
	large: {
		font: token('font.body.small'),
	},
	xlarge: {
		font: token('font.body.large'),
	},
	xxlarge: {
		font: token('font.body.large'),
	},
});

export interface MoreIndicatorProps {
	count: number;
	'aria-controls'?: string;
	'aria-expanded'?: boolean;
	'aria-haspopup'?: boolean | 'dialog';
	moreIndicatorLabel?: string;
	buttonProps: Partial<React.HTMLAttributes<HTMLElement>>;
	onClick: AvatarClickEventHandler;
	isActive: boolean;
	size: AvatarGroupSize;
	appearance?: AppearanceType;
	borderColor?: string;
	testId?: string;
}

const MAX_DISPLAY_COUNT = 99;

const MoreIndicator: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<MoreIndicatorProps> & React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, MoreIndicatorProps>(
	(
		{
			appearance = 'circle',
			borderColor = token('elevation.surface'),
			size = 'medium',
			count = 0,
			testId,
			onClick,
			'aria-controls': ariaControls,
			'aria-expanded': ariaExpanded,
			'aria-haspopup': ariaHaspopup,
			moreIndicatorLabel,
			buttonProps = {},
			isActive,
		},
		ref,
	) => {
		const onClickHander: AvatarClickEventHandler = useCallback(
			(event, analyticsEvent) => {
				if (buttonProps.onClick) {
					buttonProps.onClick(event as React.MouseEvent<HTMLElement, MouseEvent>);
				}

				onClick(event, analyticsEvent);
			},
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[buttonProps.onClick, onClick],
		);

		const displayCount = count > MAX_DISPLAY_COUNT ? MAX_DISPLAY_COUNT : count;
		const providedAriaLabel = moreIndicatorLabel || buttonProps['aria-label'];
		const ariaLabel = providedAriaLabel ? providedAriaLabel : `${displayCount} more people`;

		return (
			<button
				type="submit"
				{...buttonProps}
				onClick={onClickHander}
				ref={ref as React.Ref<HTMLButtonElement>}
				data-testid={testId}
				aria-controls={ariaControls}
				aria-expanded={ariaExpanded}
				aria-haspopup={ariaHaspopup}
				aria-label={ariaLabel}
				style={{ [boxShadowCssVar]: `0 0 0 2px ${borderColor}` } as CSSProperties}
				css={[
					styles.root,
					borderRadiusMap[size],
					appearance === 'circle' && styles.circle,
					(appearance === 'hexagon' && fg('jira-ai-agent-stack')) && styles.hexagon,
					widthHeightMap[size],
					fontMap[size],
					isActive && styles.active,
				]}
			>
				+{displayCount}
			</button>
		);
	},
);

MoreIndicator.displayName = 'MoreIndicator';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default MoreIndicator;
