/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, memo, type Ref } from 'react';

import Badge, { type BadgeNewProps } from '@atlaskit/badge';
import { cssMap, cx, jsx } from '@atlaskit/css';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import Pressable from '@atlaskit/primitives/pressable';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import IconRenderer from './icon-renderer';
import { type LozengeBaseProps } from './types';
import { getThemeStyles, resolveLozengeColor } from './utils';

type LozengeBasePropsWithRef = LozengeBaseProps & {
	ref?: Ref<HTMLElement | HTMLButtonElement>;
};

// Get the pressed background color for the selected lozenge dropdown trigger
const pressedBackgroundMapping = {
	success: token('color.background.success.subtler.pressed'),
	warning: token('color.background.warning.subtler.pressed'),
	danger: token('color.background.danger.subtler.pressed'),
	information: token('color.background.information.subtler.pressed'),
	neutral: token('color.background.neutral.pressed'),
	discovery: token('color.background.discovery.subtler.pressed'),
	'accent-red': token('color.background.accent.red.subtler.pressed'),
	'accent-orange': token('color.background.accent.orange.subtler.pressed'),
	'accent-yellow': token('color.background.accent.yellow.subtler.pressed'),
	'accent-lime': token('color.background.accent.lime.subtler.pressed'),
	'accent-green': token('color.background.accent.green.subtler.pressed'),
	'accent-teal': token('color.background.accent.teal.subtler.pressed'),
	'accent-blue': token('color.background.accent.blue.subtler.pressed'),
	'accent-purple': token('color.background.accent.purple.subtler.pressed'),
	'accent-magenta': token('color.background.accent.magenta.subtler.pressed'),
	'accent-gray': token('color.background.accent.gray.subtlest.pressed'),
};

const styles = cssMap({
	container: {
		position: 'relative',
		display: 'inline-flex',
		alignItems: 'center',
		boxSizing: 'border-box',
		height: '1.25rem',
		borderRadius: token('radius.small', '4px'),
		overflow: 'hidden',
		paddingBlockStart: token('space.025'),
		paddingBlockEnd: token('space.025'),
		paddingInlineStart: token('space.050'),
		paddingInlineEnd: token('space.050'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: 'transparent',
	},
	containerSpacious: {
		minHeight: '2rem',
		borderRadius: token('radius.medium', '6px'),
		paddingBlockStart: token('space.050'),
		paddingBlockEnd: token('space.050'),
		paddingInlineStart: token('space.150'),
		paddingInlineEnd: token('space.150'),
	},
	containerBadgePadding: {
		// @ts-expect-error
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		paddingInlineEnd: '0.0625rem',
	},
	text: {
		// eslint-disable-next-line @compiled/shorthand-property-sorting
		font: token('font.body.small'),
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	textSpacious: {
		font: token('font.body'),
		// eslint-disable-next-line @compiled/shorthand-property-sorting
		fontWeight: token('font.weight.medium'),
	},
	textSelected: {
		color: token('color.text.selected'),
	},
	loadingOverlay: {
		display: 'flex',
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
		insetBlockEnd: token('space.0'),
		insetBlockStart: token('space.0'),
		insetInlineEnd: token('space.0'),
		insetInlineStart: token('space.0'),
		pointerEvents: 'none',
		// Force Spinner to follow the lozenge icon color.
	},
	metricBadgeWrapper: {
		display: 'flex',
	},

	// Trailing metric badge appearance variables (can be overridden independently from the lozenge appearance)
	'metric.semantic.success': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--badge-background-color': token('color.background.success.subtler.pressed'),
		'--badge-background-color-pressed': token('color.background.success.pressed'),
	},
	'metric.semantic.warning': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--badge-background-color': token('color.background.warning.subtler.pressed'),
		'--badge-background-color-pressed': token('color.background.warning.pressed'),
	},
	'metric.semantic.danger': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--badge-background-color': token('color.background.danger.subtler.pressed'),
		'--badge-background-color-pressed': token('color.background.danger.pressed'),
	},
	'metric.semantic.information': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--badge-background-color': token('color.background.information.subtler.pressed'),
		'--badge-background-color-pressed': token('color.background.information.pressed'),
	},
	'metric.semantic.neutral': {
		// Neutral400
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--badge-background-color': '#B7B9BE',
		// Neutral300
		'--badge-background-color-pressed': '#DDDEE1',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'[data-color-mode="dark"] &': {
			// DarkNeutral400
			'--badge-background-color': '#4B4D51',
			// DarkNeutral350
			'--badge-background-color-pressed': '#3D3F43',
		},
	},
	'metric.semantic.discovery': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--badge-background-color': token('color.background.discovery.subtler.pressed'),
		'--badge-background-color-pressed': token('color.background.discovery.pressed'),
	},
	'metric.inverse': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--badge-background-color': token('elevation.surface'),
		'--badge-background-color-pressed': token('elevation.surface'),
	},

	// Semantic colors
	'semantic.success': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--icon-color': token('color.icon.success'),
		'--border-color': token('color.border.success'),
		backgroundColor: token('color.background.success.subtler'),
		color: token('color.text.success.bolder'),
	},
	'semantic.warning': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--icon-color': token('color.icon.warning'),
		'--border-color': token('color.border.warning'),
		backgroundColor: token('color.background.warning.subtler'),
		color: token('color.text.warning.bolder'),
	},
	'semantic.danger': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--icon-color': token('color.icon.danger'),
		'--border-color': token('color.border.danger'),
		backgroundColor: token('color.background.danger.subtler'),
		color: token('color.text.danger.bolder'),
	},
	'semantic.information': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--icon-color': token('color.icon.information'),
		'--border-color': token('color.border.information'),
		backgroundColor: token('color.background.information.subtler'),
		color: token('color.text.information.bolder'),
	},
	'semantic.neutral': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--icon-color': token('color.icon.subtlest'),
		'--border-color': token('color.border.bold'),
		backgroundColor: token('color.background.neutral'),
		color: token('color.text'),
	},
	'semantic.discovery': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--icon-color': token('color.icon.discovery'),
		'--border-color': token('color.border.discovery'),
		backgroundColor: token('color.background.discovery.subtler'),
		color: token('color.text.discovery.bolder'),
	},
	// Accent colors
	'accent.red': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--icon-color': token('color.icon.accent.red'),
		'--border-color': token('color.border.accent.red'),
		backgroundColor: token('color.background.accent.red.subtler'),
		color: token('color.text.accent.red.bolder'),
	},
	'accent.orange': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--icon-color': token('color.icon.accent.orange'),
		'--border-color': token('color.border.accent.orange'),
		backgroundColor: token('color.background.accent.orange.subtler'),
		color: token('color.text.accent.orange.bolder'),
	},
	'accent.yellow': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--icon-color': token('color.icon.accent.yellow'),
		'--border-color': token('color.border.accent.yellow'),
		backgroundColor: token('color.background.accent.yellow.subtler'),
		color: token('color.text.accent.yellow.bolder'),
	},
	'accent.lime': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--icon-color': token('color.icon.accent.lime'),
		'--border-color': token('color.border.accent.lime'),
		backgroundColor: token('color.background.accent.lime.subtler'),
		color: token('color.text.accent.lime.bolder'),
	},
	'accent.green': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--icon-color': token('color.icon.accent.green'),
		'--border-color': token('color.border.accent.green'),
		backgroundColor: token('color.background.accent.green.subtler'),
		color: token('color.text.accent.green.bolder'),
	},
	'accent.teal': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--icon-color': token('color.icon.accent.teal'),
		'--border-color': token('color.border.accent.teal'),
		backgroundColor: token('color.background.accent.teal.subtler'),
		color: token('color.text.accent.teal.bolder'),
	},
	'accent.blue': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--icon-color': token('color.icon.accent.blue'),
		'--border-color': token('color.border.accent.blue'),
		backgroundColor: token('color.background.accent.blue.subtler'),
		color: token('color.text.accent.blue.bolder'),
	},
	'accent.purple': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--icon-color': token('color.icon.accent.purple'),
		'--border-color': token('color.border.accent.purple'),
		backgroundColor: token('color.background.accent.purple.subtler'),
		color: token('color.text.accent.purple.bolder'),
	},
	'accent.magenta': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--icon-color': token('color.icon.accent.magenta'),
		'--border-color': token('color.border.accent.magenta'),
		backgroundColor: token('color.background.accent.magenta.subtler'),
		color: token('color.text.accent.magenta.bolder'),
	},
	'accent.gray': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--icon-color': token('color.icon.accent.gray'),
		'--border-color': token('color.border.accent.gray'),
		backgroundColor: token('color.background.accent.gray.subtlest'),
		color: token('color.text.accent.gray.bolder'),
	},
	// Interactive styles for semantic colors
	'interactive.semantic.success': {
		'&:hover': {
			backgroundColor: token('color.background.success.subtler.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.success.subtler.pressed'),
		},
	},
	'interactive.semantic.warning': {
		'&:hover': {
			backgroundColor: token('color.background.warning.subtler.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.warning.subtler.pressed'),
		},
	},
	'interactive.semantic.danger': {
		'&:hover': {
			backgroundColor: token('color.background.danger.subtler.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.danger.subtler.pressed'),
		},
	},
	'interactive.semantic.information': {
		'&:hover': {
			backgroundColor: token('color.background.information.subtler.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.information.subtler.pressed'),
		},
	},
	'interactive.semantic.neutral': {
		'&:hover': {
			backgroundColor: token('color.background.neutral.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.pressed'),
		},
	},
	'interactive.semantic.discovery': {
		'&:hover': {
			backgroundColor: token('color.background.discovery.subtler.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.discovery.subtler.pressed'),
		},
	},
	// Interactive styles for accent colors
	'interactive.accent.red': {
		'&:hover': {
			backgroundColor: token('color.background.accent.red.subtler.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.red.subtler.pressed'),
		},
	},
	'interactive.accent.orange': {
		'&:hover': {
			backgroundColor: token('color.background.accent.orange.subtler.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.orange.subtler.pressed'),
		},
	},
	'interactive.accent.yellow': {
		'&:hover': {
			backgroundColor: token('color.background.accent.yellow.subtler.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.yellow.subtler.pressed'),
		},
	},
	'interactive.accent.lime': {
		'&:hover': {
			backgroundColor: token('color.background.accent.lime.subtler.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.lime.subtler.pressed'),
		},
	},
	'interactive.accent.green': {
		'&:hover': {
			backgroundColor: token('color.background.accent.green.subtler.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.green.subtler.pressed'),
		},
	},
	'interactive.accent.teal': {
		'&:hover': {
			backgroundColor: token('color.background.accent.teal.subtler.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.teal.subtler.pressed'),
		},
	},
	'interactive.accent.blue': {
		'&:hover': {
			backgroundColor: token('color.background.accent.blue.subtler.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.blue.subtler.pressed'),
		},
	},
	'interactive.accent.purple': {
		'&:hover': {
			backgroundColor: token('color.background.accent.purple.subtler.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.purple.subtler.pressed'),
		},
	},
	'interactive.accent.magenta': {
		'&:hover': {
			backgroundColor: token('color.background.accent.magenta.subtler.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.magenta.subtler.pressed'),
		},
	},
	'interactive.accent.gray': {
		'&:hover': {
			backgroundColor: token('color.background.accent.gray.subtlest.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.accent.gray.subtlest.pressed'),
		},
	},
	// Icon and border filter for darkening or lightening the icon color and border color
	/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-important-styles */
	iconBorderFilter: {
		// ---OKLCH Factors (light theme) ---
		'--icon-l-factor': '0.88',
		'--border-l-factor': '1.33',
		// --- Color Mix Fallbacks (light theme) ---
		'--cm-icon-color': 'black',
		'--cm-border-color': 'white',
		'--cm-icon-value': '20%',
		'--cm-border-value': '45%',

		'[data-color-mode="dark"] &': {
			// --- OKLCH Factors (dark theme) ---
			'--icon-l-factor': '1',
			'--border-l-factor': '0.7',
			// --- Color Mix Fallbacks (dark theme) ---
			'--cm-icon-color': 'white',
			'--cm-border-color': 'black',
			'--cm-icon-value': '0%',
		},

		'& > span:first-of-type > svg': {
			// Fallback using color-mix for browsers without OKLCH relative color syntax
			color:
				'color-mix(in oklch, var(--icon-color) 100%, var(--cm-icon-color) var(--cm-icon-value))',
		},
		// @ts-expect-error
		borderColor:
			'color-mix(in oklch, var(--border-color) 100%, var(--cm-border-color) var(--cm-border-value)) !important',

		'@supports (color: oklch(from white l c h))': {
			'& > span:first-of-type > svg': {
				color: 'oklch(from var(--icon-color) calc(l * var(--icon-l-factor)) c h)',
			},
			borderColor:
				'oklch(from var(--border-color) calc(l * var(--border-l-factor)) c h) !important',
		},
	},
	iconBorderInteractiveFilter: {
		// ---OKLCH Factors (light theme) ---
		'--icon-hovered-l-factor': '0.8',
		'--icon-pressed-l-factor': '0.7',
		'--border-hovered-l-factor': '1.2',
		'--border-pressed-l-factor': '1.08',
		// --- Color Mix Fallbacks (light theme) ---
		'--cm-icon-hovered-value': '30%',
		'--cm-icon-pressed-value': '40%',
		'--cm-border-hovered-value': '30%',
		'--cm-border-pressed-value': '10%',

		'[data-color-mode="dark"] &': {
			// --- OKLCH Factors (dark theme) ---
			'--icon-hovered-l-factor': '1.15',
			'--icon-pressed-l-factor': '1.37',
			'--border-hovered-l-factor': '0.8',
			'--border-pressed-l-factor': '0.9',
			// --- Color Mix Fallbacks (dark theme) ---
			'--cm-icon-hovered-value': '30%',
			'--cm-icon-pressed-value': '70%',
		},

		'&:hover': {
			'& > span:first-of-type > svg': {
				// Fallback using color-mix for browsers without OKLCH relative color syntax
				color:
					'color-mix(in oklch, var(--icon-color) 100%, var(--cm-icon-color) var(--cm-icon-hovered-value))',
			},
			// @ts-expect-error
			borderColor:
				'color-mix(in oklch, var(--border-color) 100%, var(--cm-border-color) var(--cm-border-hovered-value)) !important',
		},
		'&:active': {
			'& > span:first-of-type > svg': {
				// Fallback using color-mix for browsers without OKLCH relative color syntax
				color:
					'color-mix(in oklch, var(--icon-color) 100%, var(--cm-icon-color) var(--cm-icon-pressed-value))',
			},
			// @ts-expect-error
			borderColor:
				'color-mix(in oklch, var(--border-color) 100%, var(--cm-border-color) var(--cm-border-pressed-value)) !important',
		},

		'@supports (color: oklch(from white l c h))': {
			'&:hover': {
				'& > span:first-of-type > svg': {
					color: 'oklch(from var(--icon-color) calc(l * var(--icon-hovered-l-factor)) c h)',
				},
				borderColor:
					'oklch(from var(--border-color) calc(l * var(--border-hovered-l-factor)) c h) !important',
			},
			'&:active': {
				'& > span:first-of-type > svg': {
					color: 'oklch(from var(--icon-color) calc(l * var(--icon-pressed-l-factor)) c h)',
				},
				borderColor:
					'oklch(from var(--border-color) calc(l * var(--border-pressed-l-factor)) c h) !important',
			},
		},
	},
	// Selected state icons should retain semantic/accent colors.
	// We treat "selected" as "pressed" for the current appearance.
	containerSelected: {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'& > span:first-of-type > svg': {
			color: 'oklch(from var(--icon-color) calc(l * var(--icon-pressed-l-factor)) c h) !important',
		},
	},
	content: {
		gap: token('space.050'),
		display: 'inline-flex',
		alignItems: 'center',
	},
	contentSpacious: {
		gap: token('space.075'),
	},
	loadingContent: {
		opacity: 0,
	},
	containerBadge: {
		// @ts-expect-error - nested selector for metric badge not in cssMap schema
		'& [data-lozenge-metric-wrapper] > span:first-of-type': {
			backgroundColor: 'var(--badge-background-color)',
		},
	},
	containerBadgeInteractive: {
		'&:active': {
			// @ts-expect-error - nested selector for metric badge not in cssMap schema
			'& [data-lozenge-metric-wrapper] > span:first-of-type': {
				backgroundColor: 'var(--badge-background-color-pressed)',
			},
		},
	},
});

/**
 * __New Lozenge__
 *
 * A lozenge is a visual indicator used to highlight an item's status for quick recognition.
 * This is the updated version with the new North Star visual language.
 */
const LozengeBase: import("react").MemoExoticComponent<import("react").ForwardRefExoticComponent<Omit<LozengeBaseProps, "ref"> & import("react").RefAttributes<HTMLButtonElement | HTMLElement>>> = memo(
	forwardRef<HTMLElement | HTMLButtonElement, LozengeBasePropsWithRef>(
		(
			{
				children,
				testId,
				appearance,
				iconBefore,
				trailingMetric,
				trailingMetricAppearance,
				maxWidth = 200,
				spacing = 'default',
				isSelected, // for dropdown trigger
				isLoading = false, // for dropdown trigger
				onClick, // for dropdown trigger
				style,
				analyticsContext,
				interactionName,
			},
			ref,
		) => {
			const isInteractive = typeof onClick === 'function';

			// Determine the effective color, with fallback logic for legacy appearances
			const resolvedColor = resolveLozengeColor(appearance) || 'neutral';
			const { category, key } = getThemeStyles(resolvedColor);
			const colorStyleKey = `${category}.${key}` as keyof typeof styles;
			const interactiveStyleKey = `interactive.${category}.${key}` as keyof typeof styles;

			const maxWidthValue = typeof maxWidth === 'string' ? maxWidth : `${maxWidth}px`;
			const maxWidthIsPc = typeof maxWidth === 'string' && /%$/.test(maxWidth);

			const resolvedTrailingMetricAppearance = trailingMetricAppearance
				? trailingMetricAppearance === 'inverse'
					? 'inverse'
					: resolveLozengeColor(trailingMetricAppearance)
				: resolvedColor;

			const metricBadgeAppearance = (
				resolvedTrailingMetricAppearance === 'inverse'
					? 'inverse'
					: resolvedTrailingMetricAppearance != null &&
						  resolvedTrailingMetricAppearance.startsWith('accent-')
						? 'neutral'
						: (resolvedTrailingMetricAppearance ?? 'neutral')
			) as BadgeNewProps['appearance'];

			const metricStyleKey =
				resolvedTrailingMetricAppearance === 'inverse'
					? ('metric.inverse' as keyof typeof styles)
					: resolvedTrailingMetricAppearance != null &&
						  !resolvedTrailingMetricAppearance.startsWith('accent-')
						? (`metric.semantic.${getThemeStyles(resolvedTrailingMetricAppearance).key}` as keyof typeof styles)
						: ('metric.semantic.neutral' as keyof typeof styles);

			const commonStyleOverrides = {
				backgroundColor: style?.backgroundColor,
				maxWidth: maxWidthIsPc ? maxWidth : '100%',
			};
			const hasTrailingMetric = trailingMetric != null && trailingMetric !== '';

			const innerContent = (
				<span
					css={[
						styles.content,
						spacing === 'spacious' && styles.contentSpacious,
						isLoading && styles.loadingContent,
					]}
				>
					{iconBefore && (
						<IconRenderer
							size={spacing === 'spacious' ? 'medium' : 'small'}
							icon={iconBefore}
							color={resolvedColor}
							testId={testId && `${testId}--icon`}
						/>
					)}
					<span
						css={[styles.text, spacing === 'spacious' && styles.textSpacious]}
						style={{
							maxWidth: maxWidthIsPc
								? '100%'
								: `calc(${maxWidthValue} - ${token('space.100', '8px')})`,
							color: style?.color,
						}}
						data-testid={testId && `${testId}--text`}
					>
						{children}
					</span>
					{hasTrailingMetric && !resolvedColor.startsWith('accent-') && (
						<span
							css={styles.metricBadgeWrapper}
							data-lozenge-metric-wrapper
							data-testid={testId && `${testId}--metric`}
						>
							<Badge appearance={metricBadgeAppearance}>{trailingMetric}</Badge>
						</span>
					)}
					{isInteractive && (
						<ChevronDownIcon
							label=""
							size="small"
							color={'currentColor'}
							testId={testId && `${testId}--chevron`}
						/>
					)}
				</span>
			);

			if (isInteractive) {
				return (
					<Pressable
						ref={ref as Ref<HTMLButtonElement>}
						xcss={cx(
							styles.container,
							spacing === 'spacious' && styles.containerSpacious,
							!isSelected && styles.iconBorderFilter,
							!isLoading && styles.iconBorderInteractiveFilter,
							styles[colorStyleKey],
							!isLoading && styles[interactiveStyleKey],
							isSelected && styles.containerSelected,
							hasTrailingMetric && styles.containerBadge,
							hasTrailingMetric && styles.containerBadgeInteractive,
							hasTrailingMetric && styles[metricStyleKey],
						)}
						{...(isLoading && { 'aria-busy': true, 'aria-disabled': true, isDisabled: true })}
						aria-label={isLoading ? 'Loading' : undefined}
						onClick={isLoading ? undefined : onClick}
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
							...commonStyleOverrides,
							// Specified because Pressable has a default border:none which overrides the border specified on the container
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
							border: `solid ${token('border.width')} ${
								isSelected
									? 'oklch(from var(--border-color) calc(l * var(--border-pressed-l-factor)) c h) !important'
									: 'transparent'
							}`,
							backgroundColor: isSelected ? pressedBackgroundMapping[resolvedColor] : undefined,
							cursor: isLoading ? 'progress' : 'pointer',
						}}
						testId={testId}
						analyticsContext={analyticsContext}
						interactionName={interactionName}
						componentName="LozengeDropdownTrigger"
					>
						{innerContent}
						{isLoading && (
							<span css={styles.loadingOverlay}>
								<Spinner
									size={spacing === 'spacious' ? 'small' : 'xsmall'}
									label=", Loading"
									testId={testId ? `${testId}--loading-spinner` : undefined}
								/>
							</span>
						)}
					</Pressable>
				);
			}

			return (
				<span
					ref={ref}
					css={[
						styles.container,
						spacing === 'spacious' && styles.containerSpacious,
						spacing !== 'spacious' && hasTrailingMetric && styles.containerBadgePadding,
						styles[colorStyleKey],
						hasTrailingMetric && styles[metricStyleKey],
						styles.iconBorderFilter,
						styles.containerBadge,
					]}
					style={commonStyleOverrides}
					data-testid={testId}
				>
					{innerContent}
				</span>
			);
		},
	),
);

export default LozengeBase;
