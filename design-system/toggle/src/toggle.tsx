/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, memo, useState } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import { type UIAnalyticsEvent, usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import __noop from '@atlaskit/ds-lib/noop';
import { useId } from '@atlaskit/ds-lib/use-id';
import CheckMarkIcon from '@atlaskit/icon/core/migration/check-mark--editor-done';
import CloseIcon from '@atlaskit/icon/core/migration/cross--editor-close';
import type { Size as IconSize } from '@atlaskit/icon/types';
import { fg } from '@atlaskit/platform-feature-flags';
import { B200, G400, G500, N0, N20, N200, N400, N70 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import IconContainer from './icon-container';
import { type Size, type ToggleProps } from './types';

const basicStyles = css({
	display: 'inline-block',
	boxSizing: 'content-box',
	position: 'relative',
	backgroundClip: 'content-box',
	backgroundColor: token('color.background.neutral.bold', N200),
	borderColor: 'transparent',
	borderStyle: 'solid',
	borderWidth: '2px',
	color: token('color.icon.inverse', N0),
	marginBlockEnd: token('space.025'),
	marginBlockStart: token('space.025'),
	marginInlineEnd: token('space.025'),
	marginInlineStart: token('space.025'),
	paddingBlockEnd: token('space.025'),
	paddingBlockStart: token('space.025'),
	paddingInlineEnd: token('space.025'),
	paddingInlineStart: token('space.025'),
	transition: 'transform 0.2s ease',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:has(:focus-visible)': {
		borderColor: token('color.border.focused', B200),
		borderStyle: 'solid',
		borderWidth: '2px',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&[data-disabled]:not([data-checked])': {
		backgroundColor: token('color.background.disabled', N20),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&[data-disabled][data-checked],&[data-disabled][data-checked]:hover': {
		backgroundColor: token('color.background.disabled', N20),
	},

	'&:hover': {
		backgroundColor: token('color.background.neutral.bold.hovered', N400),
		cursor: 'pointer',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&[data-disabled]:hover,&[data-disabled][data-checked]:hover,&[data-disabled]:not([data-checked]):hover':
		{
			cursor: 'not-allowed',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&[data-checked]': {
		backgroundColor: token('color.background.success.bold', G400),
		color: token('color.icon.inverse', N0),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&[data-checked]:hover': {
		backgroundColor: token('color.background.success.bold.hovered', G500),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:not([data-checked]):hover': {
		backgroundColor: token('color.background.neutral.bold.hovered', N400),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&[data-disabled]:not([data-checked]):hover': {
		backgroundColor: token('color.background.disabled', N20),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&[data-disabled], &[data-disabled][data-checked], &[data-disabled][data-checked]:hover': {
		color: token('color.icon.disabled', N70),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'input[type="checkbox"]': {
		margin: 0,
		padding: 0,
		border: 'none',
		opacity: 0,
		'&:focus': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			outline: 'none !important',
		},
	},

	// slider
	'&::before': {
		position: 'absolute',
		backgroundColor: token('color.icon.inverse', N0),
		borderRadius: token('border.radius.circle', '50%'),
		content: '""',
		insetBlockEnd: `4px`,
		insetInlineStart: `4px`,
		transform: 'initial',
		transition: 'transform 0.2s ease',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&[data-checked]::before': {
		backgroundColor: token('color.icon.inverse', N0),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&[data-disabled]::before': {
		zIndex: 1,
		backgroundColor: token('color.icon.inverse', N0),
	},
	'@media screen and (forced-colors: active)': {
		'&::before': {
			filter: 'grayscale(100%) invert(1)',
		},
		'&:focus-within': {
			outline: '1px solid',
		},
	},
});

const iconStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'> span > span': {
		width: '20px',
		height: '20px',
	},
});

const sizeStyles = cssMap({
	regular: {
		borderRadius: token('space.200'),
		height: token('space.200'),
		width: token('space.400'),
		'&::before': {
			height: token('space.150'),
			width: `12px`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-checked]::before': {
			transform: `translateX(${token('space.200')})`,
		},
	},
	large: {
		borderRadius: token('space.250'),
		height: token('space.250'),
		width: token('space.500'),
		'&::before': {
			height: token('space.200'),
			width: `16px`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&[data-checked]::before': {
			transform: `translateX(${token('space.250')})`,
		},
	},
});

const noop = __noop;

const analyticsAttributes = {
	componentName: 'toggle',
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
};

const iconSizeMap: Record<Size, IconSize> = {
	regular: 'small',
	large: 'medium',
};

/**
 * __Toggle__
 *
 * A toggle is used to view or switch between enabled or disabled states.
 *
 * - [Examples](https://atlassian.design/components/toggle/examples)
 * - [Code](https://atlassian.design/components/toggle/code)
 * - [Usage](https://atlassian.design/components/toggle/usage)
 */
const Toggle = memo(
	forwardRef<HTMLInputElement, ToggleProps>((props, ref) => {
		const {
			defaultChecked = false,
			isDisabled = false,
			onBlur: providedOnBlur = noop,
			onChange: providedChange = noop,
			onFocus: providedFocus = noop,
			size = 'regular' as Size,
			name = '',
			value = '',
			isChecked,
			analyticsContext,
			id,
			testId,
			label,
			descriptionId,
		} = props;

		const isControlled = typeof isChecked === 'undefined';
		const [checked, setChecked] = useState(defaultChecked);

		const handleBlur = usePlatformLeafEventHandler({
			fn: providedOnBlur,
			action: 'blur',
			analyticsData: analyticsContext,
			...analyticsAttributes,
		});

		const handleFocus = usePlatformLeafEventHandler({
			fn: providedFocus,
			action: 'focus',
			analyticsData: analyticsContext,
			...analyticsAttributes,
		});

		const handleChange = usePlatformLeafEventHandler({
			fn: (event: React.ChangeEvent<HTMLInputElement>, analyticsEvent: UIAnalyticsEvent) => {
				if (isControlled) {
					setChecked((checked) => !checked);
				}
				return providedChange(event, analyticsEvent);
			},
			action: 'change',
			analyticsData: analyticsContext,
			...analyticsAttributes,
		});

		const shouldChecked = isControlled ? checked : isChecked;

		const controlProps = {
			'data-checked': shouldChecked ? shouldChecked : undefined,
			'data-disabled': isDisabled ? isDisabled : undefined,
			'data-size': size,
			'data-testid': testId ? testId : undefined,
		};

		const legacyIconSize = iconSizeMap[size];

		const labelId = useId();
		return (
			<label
				{...controlProps}
				css={[
					basicStyles,
					size === 'large' && !fg('platform-visual-refresh-icons') && iconStyles,
					sizeStyles[size],
				]}
			>
				{label ? (
					<span id={labelId} hidden>
						{label}
					</span>
				) : null}
				<input
					ref={ref}
					checked={shouldChecked}
					disabled={isDisabled}
					id={id}
					name={name}
					onBlur={handleBlur}
					onChange={handleChange}
					onFocus={handleFocus}
					type="checkbox"
					value={value}
					data-testid={testId && `${testId}--input`}
					aria-labelledby={label ? labelId : undefined}
					aria-describedby={descriptionId}
				/>
				<IconContainer size={size} isHidden={!shouldChecked} position="left">
					<CheckMarkIcon
						label=""
						color="currentColor"
						LEGACY_size={legacyIconSize}
						testId={testId && `${testId}--toggle-check-icon`}
						size="small"
					/>
				</IconContainer>
				<IconContainer size={size} isHidden={shouldChecked} position="right">
					<CloseIcon
						label=""
						color="currentColor"
						LEGACY_size={legacyIconSize}
						testId={testId && `${testId}--toggle-cross-icon`}
						size="small"
					/>
				</IconContainer>
			</label>
		);
	}),
);

Toggle.displayName = 'Toggle';

export default Toggle;
