/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, useCallback } from 'react';

import { css, jsx } from '@emotion/react';

import Avatar, {
	ACTIVE_SCALE_FACTOR,
	type AppearanceType,
	type AvatarClickEventHandler,
	type AvatarPropTypes,
	BORDER_WIDTH,
} from '@atlaskit/avatar';
import { fg } from '@atlaskit/platform-feature-flags';
import { B300, B400, B50, N0, N20, N30, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { type AvatarGroupSize } from './types';

const buttonSizes: Record<AvatarGroupSize, React.CSSProperties['font']> = {
	small: token('font.body.small'),
	medium: token('font.body.small'),
	large: token('font.body.UNSAFE_small'),
	xlarge: token('font.body.large'),
	xxlarge: token('font.body.large'),
};

const buttonActiveStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&': {
		backgroundColor: token('color.background.selected', B50),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		boxShadow: `0 0 0 ${BORDER_WIDTH}px ${token('color.border.selected', B300)}`,
		color: token('color.text.selected', B400),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		transform: `scale(${ACTIVE_SCALE_FACTOR})`,
		'&:hover': {
			backgroundColor: token('color.background.selected.hovered', N30),
			color: token('color.text.selected', N500),
		},
		'&:active': {
			backgroundColor: token('color.background.selected.pressed', B50),
			color: token('color.text.selected', B400),
		},
	},
});

const buttonStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&': {
		backgroundColor: token('color.background.neutral', N20),
		color: token('color.text', N500),

		'&:hover': {
			backgroundColor: token('color.background.neutral.hovered', N30),
			color: token('color.text', N500),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.pressed', B50),
			color: token('color.text', B400),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&::after': {
			display: 'none',
		},
	},
});

export interface MoreIndicatorProps extends AvatarPropTypes {
	count: number;
	'aria-controls'?: string;
	'aria-expanded'?: boolean;
	'aria-haspopup'?: boolean | 'dialog';
	buttonProps: Partial<React.HTMLAttributes<HTMLElement>>;
	onClick: AvatarClickEventHandler;
	isActive: boolean;
	size: AvatarGroupSize;
}

const MAX_DISPLAY_COUNT = 99;

const MoreIndicator = forwardRef<HTMLButtonElement, MoreIndicatorProps>(
	(
		{
			appearance = 'circle' as AppearanceType,
			// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
			borderColor = fg('platform-component-visual-refresh')
				? token('elevation.surface')
				: token('color.border.inverse', N0),
			size = 'medium' as AvatarGroupSize,
			count = 0,
			testId,
			onClick,
			'aria-controls': ariaControls,
			'aria-expanded': ariaExpanded,
			'aria-haspopup': ariaHaspopup,
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

		return (
			<Avatar
				appearance={appearance}
				size={size}
				borderColor={borderColor}
				ref={ref}
				onClick={onClickHander}
			>
				{({ testId: _, className, ref, ...props }) => (
					// eslint-disable-next-line @atlaskit/design-system/no-html-button
					<button
						type="submit"
						{...buttonProps}
						{...props}
						ref={ref as any}
						data-testid={testId}
						aria-controls={ariaControls}
						aria-expanded={ariaExpanded}
						aria-haspopup={ariaHaspopup}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{
							font: buttonSizes[size],
						}}
						css={[buttonStyles, isActive && buttonActiveStyles]}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className={className}
					>
						+{count! > MAX_DISPLAY_COUNT ? MAX_DISPLAY_COUNT : count}
					</button>
				)}
			</Avatar>
		);
	},
);

MoreIndicator.displayName = 'MoreIndicator';

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default MoreIndicator;
