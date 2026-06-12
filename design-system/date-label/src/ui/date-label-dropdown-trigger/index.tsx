/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap as cssMapUnbound } from '@compiled/react';

import { cssMap, jsx } from '@atlaskit/css';
import WarningOutlineIcon from '@atlaskit/icon-lab/core/warning-outline';
import CalendarIcon from '@atlaskit/icon/core/calendar';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ClockIcon from '@atlaskit/icon/core/clock';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import type { DateLabelDropdownTriggerAppearance, DateLabelDropdownTriggerProps } from './types';

const containerStyles = cssMap({
	base: {
		position: 'relative',
		boxSizing: 'border-box',
		display: 'inline-flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingBlock: token('space.025'),
		paddingInline: token('space.050'),
		gap: token('space.050'),
		borderRadius: token('radius.small'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		cursor: 'pointer',
		backgroundColor: 'transparent',
		'&:focus-visible': {
			outlineColor: token('color.border.focused'),
			outlineWidth: token('border.width.focused'),
			outlineStyle: 'solid',
			outlineOffset: token('space.025'),
		},
	},
	hoveredAndPressed: {
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
	},
	spacious: {
		minHeight: '2rem',
		borderRadius: token('radius.medium'),
		paddingBlock: token('space.050'),
		paddingInline: token('space.150'),
		gap: token('space.075'),
	},
	neutral: {
		borderColor: token('color.border.accent.gray.subtle'),
		color: token('color.text'),
	},
	warning: {
		borderColor: token('color.border.warning.subtle'),
		color: token('color.text.warning'),
		'&:active': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			// @ts-expect-error - color.text.warning.bolder is not valid in cssMap pseudo-selector types
			color: token('color.text.warning.bolder'),
		},
	},
	danger: {
		borderColor: token('color.border.danger.subtle'),
		color: token('color.text.danger'),
	},
	selected: {
		backgroundColor: token('color.background.neutral.subtle.pressed'),
	},
	selectedWarning: {
		color: token('color.text.warning.bolder'),
	},
});

const textStyles = cssMap({
	base: {
		font: token('font.body.small'),
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		minWidth: 0,
	},
	spacious: {
		font: token('font.body'),
	},
});

/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors */
const iconStyles = cssMapUnbound({
	base: {
		display: 'flex',
		flexShrink: 0,
		'[data-appearance="neutral"] &': { color: token('color.icon.subtlest') },
		'[data-appearance="neutral"]:hover &': { color: token('color.text.subtle') },
		'[data-appearance="neutral"]:active &, [data-appearance="neutral"][data-selected] &': {
			color: token('color.text.subtle'),
		},
		'[data-appearance="warning"] &': { color: token('color.icon.warning') },
		'[data-appearance="warning"]:hover &': { color: token('color.text.warning') },
		'[data-appearance="warning"]:active &, [data-appearance="warning"][data-selected] &': {
			color: token('color.text.warning'),
		},
		'[data-appearance="danger"] &': { color: token('color.icon.danger') },
		'[data-appearance="danger"]:hover &': { color: token('color.text.danger') },
		'[data-appearance="danger"]:active &, [data-appearance="danger"][data-selected] &': {
			color: token('color.text.danger'),
		},
	},
});
/* eslint-enable @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors */

const loadingStyles = cssMap({
	overlay: {
		display: 'flex',
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		insetBlockStart: token('space.0'),
		insetBlockEnd: token('space.0'),
		insetInlineStart: token('space.0'),
		insetInlineEnd: token('space.0'),
		pointerEvents: 'none',
	},
});

const inlineStyles = cssMap({
	base: {
		display: 'inline-flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: token('space.050'),
		minWidth: 0,
	},
	spacious: {
		gap: token('space.075'),
	},
	loading: {
		opacity: 0,
	},
});

const DEFAULT_MAX_WIDTH = 200;

const defaultIconLabels: Record<DateLabelDropdownTriggerAppearance, string> = {
	neutral: 'Date',
	warning: 'Warning',
	danger: 'Danger',
};

/**
 * __DateLabelDropdownTrigger__
 *
 * An interactive date label that acts as a dropdown trigger.
 * Renders as a `<button>` with hover, pressed, selected, and focus ring states,
 * and a chevron icon on the right to signal interactivity.
 *
 * Supports all three appearances (`neutral`, `warning`, `danger`),
 * the `isSpacious` variant, and `isSelected` for open/active dropdown state.
 *
 * - [Examples](https://atlassian.design/components/date-label/examples)
 * - [Code](https://atlassian.design/components/date-label/code)
 * - [Usage](https://atlassian.design/components/date-label/usage)
 */
export default function DateLabelDropdownTrigger({
	label,
	appearance = 'neutral',
	hasIconBefore = true,
	isSpacious = false,
	isSelected = false,
	isLoading = false,
	maxWidth = DEFAULT_MAX_WIDTH,
	iconLabel,
	onClick,
	'aria-controls': ariaControls,
	'aria-expanded': ariaExpanded,
	'aria-haspopup': ariaHaspopup,
	'aria-label': ariaLabel,
	testId,
}: DateLabelDropdownTriggerProps): JSX.Element {
	const maxWidthValue = typeof maxWidth === 'string' ? maxWidth : `${maxWidth}px`;
	const iconSize = isSpacious ? 'medium' : 'small';
	const resolvedIconLabel = iconLabel !== undefined ? iconLabel : defaultIconLabels[appearance];

	return (
		<button
			css={[
				containerStyles.base,
				isSpacious && containerStyles.spacious,
				containerStyles[appearance],
				isSelected ? containerStyles.selected : containerStyles.hoveredAndPressed,
				isSelected && appearance === 'warning' && containerStyles.selectedWarning,
			]}
			type="button"
			onClick={isLoading ? undefined : onClick}
			aria-disabled={isLoading || undefined}
			aria-controls={ariaControls}
			aria-expanded={ariaExpanded}
			aria-haspopup={ariaHaspopup}
			aria-label={ariaLabel}
			data-testid={testId}
			data-appearance={appearance}
			data-selected={isSelected || undefined}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={{ maxWidth: maxWidthValue, cursor: isLoading ? 'progress' : undefined }}
		>
			<span
				css={[
					inlineStyles.base,
					isSpacious && inlineStyles.spacious,
					isLoading && inlineStyles.loading,
				]}
			>
				{hasIconBefore && (
					<span css={iconStyles.base}>
						{appearance === 'neutral' && (
							<CalendarIcon label={resolvedIconLabel} size={iconSize} color="currentColor" />
						)}
						{appearance === 'warning' && (
							<ClockIcon label={resolvedIconLabel} size={iconSize} color="currentColor" />
						)}
						{appearance === 'danger' && (
							<WarningOutlineIcon label={resolvedIconLabel} size={iconSize} color="currentColor" />
						)}
					</span>
				)}
				<span css={[textStyles.base, isSpacious && textStyles.spacious]}>{label}</span>
			</span>
			{isLoading ? (
				<span css={loadingStyles.overlay}>
					<Spinner
						size={isSpacious ? 'small' : 'xsmall'}
						label=", Loading"
						testId={testId ? `${testId}--loading-spinner` : undefined}
					/>
				</span>
			) : (
				<ChevronDownIcon label="" size={iconSize} color="currentColor" />
			)}
		</button>
	);
}
