/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, memo, type Ref, useLayoutEffect, useRef, useState } from 'react';

import Badge, { type BadgeNewProps } from '@atlaskit/badge/new';
import { cssMap, cx, jsx } from '@atlaskit/css';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import { useResizing } from '@atlaskit/motion/resizing';
import { fg } from '@atlaskit/platform-feature-flags';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- TODO: migrate to @atlaskit/primitives/compiled
import Pressable from '@atlaskit/primitives/pressable';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import { getThemeStyles } from './get-theme-styles';
import IconRenderer from './icon-renderer';
import { type LozengeBaseProps } from './types';
import { resolveLozengeColor } from './utils';

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
	motionContainer: {
		transitionProperty: 'background-color, border-color',
		transitionDuration: token('motion.duration.medium'),
		transitionTimingFunction: token('motion.easing.inout.bold'),
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
		whiteSpace: 'nowrap',
	},
	textEllipsis: {
		textOverflow: 'ellipsis',
	},
	textClip: {
		textOverflow: 'clip',
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

	// Semantic colors
	'semantic.success': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--border-color': token('color.border.success.subtle'),
		backgroundColor: token('color.background.success.subtler'),
		color: token('color.text.success.bolder'),
	},
	'semantic.warning': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--border-color': token('color.border.warning.subtle'),
		backgroundColor: token('color.background.warning.subtler'),
		color: token('color.text.warning.bolder'),
	},
	'semantic.danger': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--border-color': token('color.border.danger.subtle'),
		backgroundColor: token('color.background.danger.subtler'),
		color: token('color.text.danger.bolder'),
	},
	'semantic.information': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--border-color': token('color.border.information.subtle'),
		backgroundColor: token('color.background.information.subtler'),
		color: token('color.text.information.bolder'),
	},
	'semantic.neutral': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--border-color': token('color.border'),
		backgroundColor: token('color.background.neutral'),
		color: token('color.text'),
	},
	'semantic.discovery': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--border-color': token('color.border.discovery.subtle'),
		backgroundColor: token('color.background.discovery.subtler'),
		color: token('color.text.discovery.bolder'),
	},
	// Accent colors
	'accent.red': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--border-color': token('color.border.accent.red.subtle'),
		backgroundColor: token('color.background.accent.red.subtler'),
		color: token('color.text.accent.red.bolder'),
	},
	'accent.orange': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--border-color': token('color.border.accent.orange.subtle'),
		backgroundColor: token('color.background.accent.orange.subtler'),
		color: token('color.text.accent.orange.bolder'),
	},
	'accent.yellow': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--border-color': token('color.border.accent.yellow.subtle'),
		backgroundColor: token('color.background.accent.yellow.subtler'),
		color: token('color.text.accent.yellow.bolder'),
	},
	'accent.lime': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--border-color': token('color.border.accent.lime.subtle'),
		backgroundColor: token('color.background.accent.lime.subtler'),
		color: token('color.text.accent.lime.bolder'),
	},
	'accent.green': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--border-color': token('color.border.accent.green.subtle'),
		backgroundColor: token('color.background.accent.green.subtler'),
		color: token('color.text.accent.green.bolder'),
	},
	'accent.teal': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--border-color': token('color.border.accent.teal.subtle'),
		backgroundColor: token('color.background.accent.teal.subtler'),
		color: token('color.text.accent.teal.bolder'),
	},
	'accent.blue': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--border-color': token('color.border.accent.blue.subtle'),
		backgroundColor: token('color.background.accent.blue.subtler'),
		color: token('color.text.accent.blue.bolder'),
	},
	'accent.purple': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--border-color': token('color.border.accent.purple.subtle'),
		backgroundColor: token('color.background.accent.purple.subtler'),
		color: token('color.text.accent.purple.bolder'),
	},
	'accent.magenta': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--border-color': token('color.border.accent.magenta.subtle'),
		backgroundColor: token('color.background.accent.magenta.subtler'),
		color: token('color.text.accent.magenta.bolder'),
	},
	'accent.gray': {
		// @ts-expect-error -- CSS variables not valid in cssMap types
		'--border-color': token('color.border'),
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
		// Border now uses color.border.*.subtle tokens directly (Color400)
		// @ts-expect-error
		borderColor: 'var(--border-color) !important',
	},
	content: {
		gap: token('space.050'),
		display: 'inline-flex',
		alignItems: 'center',
	},
	maxWidth: {
		maxWidth: '100%',
	},
	contentSpacious: {
		gap: token('space.075'),
	},
	loadingContent: {
		opacity: 0,
	},
	// In the pressed/selected state the lozenge background darkens, so override the
	// badge background to `color.background.neutral` to keep it distinguishable.
	// Applied via `:active` (mouse-down) and `data-selected` (dropdown open).
	// Note: the neutral appearance overrides this with `neutral.hovered` via
	// `containerBadgeNeutralAppearance`, which is applied last in xcss order
	// (equal specificity, so source order wins).
	containerBadgePressed: {
		// @ts-expect-error - nested selector for metric badge not in cssMap schema
		'&:active [data-lozenge-metric-wrapper] > span:first-of-type, &[data-selected="true"] [data-lozenge-metric-wrapper] > span:first-of-type':
			{
				backgroundColor: `${token('color.background.neutral')} !important`,
			},
	},
	// For the **neutral** lozenge appearance, the default `neutral` badge
	// background is the same alpha-grey as the lozenge background, so it
	// visually blends in. Override the badge background to
	// `color.background.neutral.hovered` (a slightly darker alpha grey) in
	// all states (default, hovered, and pressed) so the badge stays
	// distinguishable. Using the same value across all states keeps the
	// neutral badge stable rather than going lighter on press.
	containerBadgeNeutralAppearance: {
		// @ts-expect-error - nested selector for metric badge not in cssMap schema
		'& [data-lozenge-metric-wrapper] > span:first-of-type, &:active [data-lozenge-metric-wrapper] > span:first-of-type, &[data-selected="true"] [data-lozenge-metric-wrapper] > span:first-of-type':
			{
				backgroundColor: `${token('color.background.neutral.hovered')} !important`,
			},
	},
});

/**
 * __New Lozenge__
 *
 * A lozenge is a visual indicator used to highlight an item's status for quick recognition.
 * This is the updated version with the new North Star visual language.
 */
const LozengeBase: import('react').MemoExoticComponent<
	import('react').ForwardRefExoticComponent<
		Omit<LozengeBaseProps, 'ref'> & import('react').RefAttributes<HTMLButtonElement | HTMLElement>
	>
> = memo(
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
				'aria-controls': ariaControls,
				'aria-expanded': ariaExpanded,
				'aria-haspopup': ariaHaspopup,
				'aria-label': ariaLabel,
			},
			ref,
		) => {
			const [resizing, setResizing] = useState<boolean>(false);
			const onFinishMotion = () => setResizing(false);
			const resizingWidth = useResizing({
				dimension: 'width',
				duration: token('motion.duration.medium'),
				easing: token('motion.easing.inout.bold'),
				onFinishMotion,
			});
			const isInitialRender = useRef<boolean>(true);

			const isInteractive = typeof onClick === 'function';

			// Determine the effective color, with fallback logic for legacy appearances
			const resolvedColor = resolveLozengeColor(appearance) || 'neutral';
			const { category, key } = getThemeStyles(resolvedColor);
			const colorStyleKey = `${category}.${key}` as keyof typeof styles;
			const interactiveStyleKey = `interactive.${category}.${key}` as keyof typeof styles;

			const maxWidthValue = typeof maxWidth === 'string' ? maxWidth : `${maxWidth}px`;
			const maxWidthIsPc = typeof maxWidth === 'string' && maxWidth.endsWith('%');

			const resolvedTrailingMetricAppearance = trailingMetricAppearance
				? trailingMetricAppearance === 'inverse'
					? 'inverse'
					: resolveLozengeColor(trailingMetricAppearance)
				: resolvedColor;

			// Map the resolved trailing metric appearance to a Badge appearance.
			// Semantic colors map to their new bold variants (e.g. successBold),
			// which provide sufficient color emphasis on top of the subtler
			// lozenge background. Accent colors and unknown values fall back to
			// the neutral appearance.
			const metricBadgeAppearance = ((): BadgeNewProps['appearance'] => {
				if (resolvedTrailingMetricAppearance === 'inverse') {
					return 'inverse';
				}
				if (resolvedTrailingMetricAppearance == null) {
					return 'neutral';
				}
				if (resolvedTrailingMetricAppearance.startsWith('accent-')) {
					return 'neutral';
				}
				switch (resolvedTrailingMetricAppearance) {
					case 'success':
						return 'successBold';
					case 'warning':
						return 'warningBold';
					case 'danger':
						return 'dangerBold';
					case 'information':
						return 'informationBold';
					case 'discovery':
						return 'discoveryBold';
					case 'neutral':
					default:
						return 'neutral';
				}
			})();

			const commonStyleOverrides = {
				backgroundColor: style?.backgroundColor,
				// Constrain the container to the smaller of the explicit maxWidth and 100% of
				// the parent. Using min(...) means the lozenge never overflows its parent,
				// while still honouring the explicit maxWidth prop when the parent is wider.
				maxWidth: maxWidthIsPc ? maxWidth : `min(${maxWidthValue}, 100%)`,
			};
			const hasTrailingMetric = trailingMetric != null && trailingMetric !== '';

			const childrenKey = typeof children === 'string' ? children : undefined;
			useLayoutEffect(() => {
				// Ignore initial render
				if (isInitialRender.current) {
					isInitialRender.current = false;
					return;
				}
				setResizing(true);
			}, [childrenKey]);

			const enableMotionFG = fg('platform-dst-motion-uplift');

			const innerContent = (
				<span
					css={[
						styles.content,
						spacing === 'spacious' && styles.contentSpacious,
						isLoading && styles.loadingContent,
						// Constrain the content wrapper to its container so text truncation
						// works correctly within the flex layout, regardless of whether maxWidth
						// is a percentage, fixed value, or the parent container is narrower than
						// the explicit maxWidth.
						styles.maxWidth,
					]}
					{...(enableMotionFG ? resizingWidth : undefined)}
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
						css={[
							styles.text,
							// Clip during animating width changes, but not when a maxWidth is specified
							enableMotionFG && resizing && !maxWidth ? styles.textClip : styles.textEllipsis,
							spacing === 'spacious' && styles.textSpacious,
						]}
						style={{
							// The text fills 100% of the inner content wrapper. The container's
							// own max-width (set on the container via commonStyleOverrides) handles
							// the actual size constraint, so the text just needs to fill the available
							// space and truncate when it overflows.
							maxWidth: maxWidthIsPc ? '100%' : `calc(${maxWidthValue} - ${token('space.100')})`,
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
							fg('platform-dst-motion-uplift') && styles.motionContainer,
							spacing === 'spacious' && styles.containerSpacious,
							!isSelected && styles.iconBorderFilter,
							styles[colorStyleKey],
							!isLoading && styles[interactiveStyleKey],
							hasTrailingMetric && styles.containerBadgePressed,
							hasTrailingMetric &&
								resolvedTrailingMetricAppearance === 'neutral' &&
								styles.containerBadgeNeutralAppearance,
						)}
						{...(isLoading && { 'aria-busy': true, 'aria-disabled': true, isDisabled: true })}
						aria-label={isLoading ? 'Loading' : ariaLabel}
						aria-controls={ariaControls}
						aria-expanded={ariaExpanded}
						aria-haspopup={ariaHaspopup}
						onClick={isLoading ? undefined : onClick}
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
							...commonStyleOverrides,
							// Specified because Pressable has a default border:none which overrides the border specified on the container
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
							border: `solid ${token('border.width')} ${
								isSelected ? 'var(--border-color) !important' : 'transparent'
							}`,
							backgroundColor: isSelected ? pressedBackgroundMapping[resolvedColor] : undefined,
							cursor: isLoading ? 'progress' : 'pointer',
						}}
						testId={testId}
						analyticsContext={analyticsContext}
						interactionName={interactionName}
						componentName="LozengeDropdownTrigger"
						// `data-selected` mirrors the `isSelected` prop so CSS can target the
						// pressed-state badge override via attribute selector.
						{...(isSelected && { 'data-selected': 'true' })}
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
						styles.iconBorderFilter,
						hasTrailingMetric &&
							resolvedTrailingMetricAppearance === 'neutral' &&
							styles.containerBadgeNeutralAppearance,
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
