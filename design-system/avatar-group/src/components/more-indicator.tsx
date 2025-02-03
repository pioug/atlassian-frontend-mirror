/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, useCallback } from 'react';

import { css, jsx } from '@compiled/react';

import Avatar, {
	type AppearanceType,
	type AvatarClickEventHandler,
	type AvatarPropTypes,
} from '@atlaskit/avatar';
import { fg } from '@atlaskit/platform-feature-flags';
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
		backgroundColor: token('color.background.selected'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		boxShadow: `0 0 0 ${token('border.width.outline')} ${token('color.border.selected')}`,
		color: token('color.text.selected'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
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
});

const buttonStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&': {
		backgroundColor: token('color.background.neutral'),
		color: token('color.text'),

		'&:hover': {
			backgroundColor: token('color.background.neutral.hovered'),
			color: token('color.text'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.pressed'),
			color: token('color.text'),
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
				: token('color.border.inverse'),
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
							// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
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
