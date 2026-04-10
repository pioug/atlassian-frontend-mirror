/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, memo, useState } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import { type UIAnalyticsEvent, usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import __noop from '@atlaskit/ds-lib/noop';
import { useId } from '@atlaskit/ds-lib/use-id';
import CheckMarkIcon from '@atlaskit/icon/core/check-mark';
import CloseIcon from '@atlaskit/icon/core/cross';
import { fg } from '@atlaskit/platform-feature-flags';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden';

import IconContainer from './icon-container';
import { type Size, type ToggleProps } from './types';

const LOADING_LABEL = ', Loading';

const basicStyles = css({
	display: 'inline-block',
	boxSizing: 'content-box',
	position: 'relative',
	backgroundClip: 'content-box',
	backgroundColor: token('color.background.neutral.bold'),
	borderColor: 'transparent',
	borderStyle: 'solid',
	borderWidth: token('border.width.selected'),
	color: token('color.icon.inverse'),
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
		borderColor: token('color.border.focused'),
		borderStyle: 'solid',
		borderWidth: token('border.width.focused'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&[data-disabled]:not([data-checked])': {
		backgroundColor: token('color.background.disabled'),
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&[data-disabled][data-checked],&[data-disabled][data-checked]:hover': {
		backgroundColor: token('color.background.disabled'),
	},

	'&:hover': {
		backgroundColor: token('color.background.neutral.bold.hovered'),
		cursor: 'pointer',
	},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&[data-disabled]:hover,&[data-disabled][data-checked]:hover,&[data-disabled]:not([data-checked]):hover':
		{
			cursor: 'not-allowed',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&[data-checked]': {
		backgroundColor: token('color.background.success.bold'),
		color: token('color.icon.inverse'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&[data-checked]:hover': {
		backgroundColor: token('color.background.success.bold.hovered'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:not([data-checked]):hover': {
		backgroundColor: token('color.background.neutral.bold.hovered'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&[data-disabled]:not([data-checked]):hover': {
		backgroundColor: token('color.background.disabled'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&[data-disabled], &[data-disabled][data-checked], &[data-disabled][data-checked]:hover': {
		color: token('color.icon.disabled'),
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
		backgroundColor: token('color.icon.inverse'),
		borderRadius: token('radius.full', '50%'),
		content: '""',
		insetBlockEnd: `4px`,
		insetInlineStart: `4px`,
		transform: 'initial',
		transition: 'transform 0.2s ease',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&[data-checked]::before': {
		backgroundColor: token('color.icon.inverse'),
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&[data-disabled]::before': {
		zIndex: 1,
		backgroundColor: token('color.icon.inverse'),
	},
	'@media screen and (forced-colors: active)': {
		'&::before': {
			filter: 'grayscale(100%) invert(1)',
		},
		'&:focus-within': {
			outline: `${token('border.width')} solid`,
		},
	},
});

const sizeStyles = cssMap({
	regular: {
		borderRadius: token('radius.full'),
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
		borderRadius: token('radius.full'),
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

const atomicBaseStyles = css({
	display: 'inline-block',
	boxSizing: 'content-box',
	position: 'relative',
	backgroundClip: 'content-box',
	backgroundColor: token('color.background.neutral.bold'),
	borderColor: 'transparent',
	borderStyle: 'solid',
	borderWidth: token('border.width.selected'),
	color: token('color.icon.inverse'),
	cursor: 'pointer',
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
		borderColor: token('color.border.focused'),
		borderWidth: token('border.width.focused'),
	},
	'&::before': {
		position: 'absolute',
		backgroundColor: token('color.icon.inverse'),
		borderRadius: token('radius.full', '50%'),
		content: '""',
		insetBlockEnd: `4px`,
		insetInlineStart: `4px`,
		transition: 'transform 0.2s ease',
	},
	'@media screen and (forced-colors: active)': {
		'&::before': {
			filter: 'grayscale(100%) invert(1)',
		},
		'&:focus-within': {
			outline: `${token('border.width')} solid`,
		},
	},
});

const atomicSizeStyles = cssMap({
	regular: {
		borderRadius: token('radius.full'),
		height: token('space.200'),
		width: token('space.400'),
		'&::before': {
			height: token('space.150'),
			width: `12px`,
		},
	},
	large: {
		borderRadius: token('radius.full'),
		height: token('space.250'),
		width: token('space.500'),
		'&::before': {
			height: token('space.200'),
			width: `16px`,
		},
	},
});

/**
 * Slider knob translate transforms per size, applied when checked.
 */
const atomicCheckedSliderStyles = cssMap({
	regular: {
		'&::before': {
			transform: `translateX(${token('space.200')})`,
		},
	},
	large: {
		'&::before': {
			transform: `translateX(${token('space.250')})`,
		},
	},
});

/**
 * Applied when the toggle is checked
 */
const atomicCheckedStyles = css({
	backgroundColor: token('color.background.success.bold'),
});

/**
 * Applied when the toggle is checked and not disabled.
 */
const atomicCheckedHoveredStyles = css({
	'&:hover': {
		backgroundColor: token('color.background.success.bold.hovered'),
	},
});

/**
 * Applied when the toggle is unchecked and not disabled.
 */
const atomicUncheckedHoveredStyles = css({
	'&:hover': {
		backgroundColor: token('color.background.neutral.bold.hovered'),
	},
});

/**
 * Applied when the toggle is disabled.
 */
const atomicDisabledStyles = css({
	backgroundColor: token('color.background.disabled'),
	color: token('color.icon.disabled'),
	cursor: 'not-allowed',
	'&::before': {
		zIndex: 1,
	},
});

const atomicInputStyles = css({
	margin: 0,
	padding: 0,
	border: 'none',
	opacity: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:focus': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		outline: 'none !important',
	},
});

const noop = __noop;

const analyticsAttributes = {
	componentName: 'toggle',
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
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
const Toggle: React.MemoExoticComponent<
	React.ForwardRefExoticComponent<Omit<ToggleProps, 'ref'> & React.RefAttributes<HTMLInputElement>>
> = memo(
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
			isLoading,
			analyticsContext,
			id,
			testId,
			label,
			descriptionId,
		} = props;

		const isControlled = typeof isChecked === 'undefined';
		const [checked, setChecked] = useState(defaultChecked);
		const loadingLabelId = useId();

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
			// In the legacy styling path, data-* attributes drive CSS styling via
			// attribute selectors. In the atomic path they are no longer needed.
			...(!fg('platform-toggle-atomic-styles') && {
				'data-checked': shouldChecked ? shouldChecked : undefined,
				'data-disabled': isDisabled ? isDisabled : undefined,
				'data-size': size,
			}),
			'data-testid': testId ? testId : undefined,
		};

		const labelId = useId();
		return (
			<label
				{...controlProps}
				css={[
					// Legacy path: nested data-attribute selectors
					!fg('platform-toggle-atomic-styles') && basicStyles,
					!fg('platform-toggle-atomic-styles') && sizeStyles[size],
					// Atomic path: CSS custom properties
					fg('platform-toggle-atomic-styles') && atomicBaseStyles,
					fg('platform-toggle-atomic-styles') && atomicSizeStyles[size],
					// Checked state: success background + slider knob translation
					shouldChecked && fg('platform-toggle-atomic-styles') && atomicCheckedStyles,
					shouldChecked && fg('platform-toggle-atomic-styles') && atomicCheckedSliderStyles[size],
					// Hover states: only applied for enabled toggles
					!isDisabled &&
						shouldChecked &&
						fg('platform-toggle-atomic-styles') &&
						atomicCheckedHoveredStyles,
					!isDisabled &&
						!shouldChecked &&
						fg('platform-toggle-atomic-styles') &&
						atomicUncheckedHoveredStyles,
					// Disabled state: overrides all other styles
					isDisabled && fg('platform-toggle-atomic-styles') && atomicDisabledStyles,
				]}
			>
				{label ? (
					<span id={labelId} hidden>
						{isLoading ? `${label}${LOADING_LABEL}` : label}
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
					aria-labelledby={
						isLoading && label ? `${labelId} ${loadingLabelId}` : label ? labelId : undefined
					}
					aria-describedby={descriptionId}
					// In the atomic styling path, apply input styles directly to the input element
					// rather than via nested styles on the parent label.
					css={[fg('platform-toggle-atomic-styles') && atomicInputStyles]}
				/>
				<IconContainer size={size} isHidden={!shouldChecked} position="left">
					{isLoading && shouldChecked ? (
						<Spinner size="xsmall" appearance="invert" />
					) : (
						<CheckMarkIcon
							label=""
							color="currentColor"
							testId={testId && `${testId}--toggle-check-icon`}
							size="small"
						/>
					)}
				</IconContainer>
				<IconContainer size={size} isHidden={shouldChecked} position="right">
					{isLoading && !shouldChecked ? (
						<Spinner size="xsmall" appearance="invert" />
					) : (
						<CloseIcon
							label=""
							color="currentColor"
							testId={testId && `${testId}--toggle-cross-icon`}
							size="small"
						/>
					)}
				</IconContainer>
				{isLoading && !label && (
					<VisuallyHidden id={loadingLabelId}>{LOADING_LABEL}</VisuallyHidden>
				)}
			</label>
		);
	}),
);

Toggle.displayName = 'Toggle';

export default Toggle;
