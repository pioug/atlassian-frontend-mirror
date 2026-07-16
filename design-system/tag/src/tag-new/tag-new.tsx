/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, memo, useCallback } from 'react';

import { cssMap as cssMapUnbound, cx, jsx } from '@compiled/react';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import { fg } from '@atlaskit/platform-feature-flags';
import { Pressable } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import { colorMapping } from './color-mapping';
import { getTagText } from './get-tag-text';
import { LinkWrapper } from './link-wrapper';
import { RemovableWrapper } from './removable-wrapper';
import SwatchBefore from './swatch-before';
import { type TagDropdownTriggerProps, type TagNewProps } from './types';
import { useButtonInteraction } from './use-button-interaction';
import { useLink } from './use-link';
import { useRemoveButton } from './use-remove-button';
import { useTagRemoval } from './use-tag-removal';

const styles = cssMapUnbound({
	baseStyles: {
		display: 'inline-flex',
		boxSizing: 'border-box',
		minWidth: '0rem',
		maxWidth: '11.25rem',
		height: '1.25rem',
		position: 'relative',
		alignItems: 'center',
		gap: token('space.050'),
		borderRadius: token('radius.small', '4px'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		cursor: 'default',
		paddingBlock: token('space.025', '2px'),
		paddingInline: '0.1875rem',
		font: token('font.body.small'),
		backgroundColor: token('color.background.neutral.subtle'),
		marginBlock: token('space.050'),
		marginInline: token('space.050'),
	},
	noMarginStyles: {
		marginBlock: token('space.0'),
		marginInline: token('space.0'),
	},
	removableStyles: {
		gap: token('space.050'),
	},
	beforeStyles: {
		display: 'inline-flex',
		alignItems: 'center',
		flexShrink: 0,
		// Prevent underline when tag is a link
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		textDecoration: 'none !important',
		color: `var(--ds-tag-icon)`,
	},
	beforeStylesSelected: {
		color: token('color.icon.selected'),
	},
	textStyles: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		flexGrow: 1,
		minWidth: 0,
		color: token('color.text'),
	},
	textStylesSelected: {
		color: token('color.text.selected'),
	},
	afterStyles: {
		display: 'flex',
		alignItems: 'center',
		flexShrink: 0,
		pointerEvents: 'auto',
		position: 'relative',
	},
	trailingMetric: {
		display: 'inline-flex',
		boxSizing: 'border-box',
		minWidth: token('space.300'),
		justifyContent: 'center',
		alignItems: 'center',
		flexShrink: 0,
		blockSize: 'min-content',
		borderRadius: token('radius.xsmall', '2px'),
		paddingInline: token('space.050'),
		paddingBlock: 0,
		font: token('font.body.small'),
		// Use the subtler background accent color (--tag-metric-bg-token is set per color)
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		backgroundColor: 'var(--tag-metric-bg-token)',
		color: token('color.text'),
	},
	// When the metric is the last element (non-removable/no-chevron), reduce end padding so only ~1px gap remains
	trailingMetricEndPadding: {
		paddingInlineEnd: '0.0625rem',
	},
	focusRingStyles: {
		// Only show focus ring when keyboard navigating (not mouse clicks)
		'&:focus-visible': {
			outline: `${token('border.width.focused')} solid ${token('color.border.focused')}`,
			// @ts-ignore
			outlineOffset: token('space.025'),
		},
	},
	// Show focus ring when child link is focused via keyboard (applied conditionally via JS)
	childFocusRingStyles: {
		outline: `${token('border.width.focused')} solid ${token('color.border.focused')}`,
		// @ts-ignore
		outlineOffset: token('space.025'),
	},
	// Base interactive styles - always applied when link (cursor, link styling)
	interactiveBaseStyles: {
		cursor: 'pointer',
		// @ts-ignore
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > a': {
			display: 'inline-flex',
			alignItems: 'center',
			gap: token('space.050'),
			textDecoration: 'none',
			// Allow link to shrink and enable text truncation
			minWidth: 0,
			overflow: 'hidden',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			color: 'inherit !important',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			outline: 'none !important',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			boxShadow: 'none !important',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > a:focus': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			outline: 'none !important',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			boxShadow: 'none !important',
			textDecoration: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > a:visited': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			color: 'inherit !important',
		},
	},
	// Hover/active styles - only applied when NOT over the button
	interactiveHoverStyles: {
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
		// @ts-ignore
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > a:hover': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			color: 'inherit !important',
		},
		// Only underline the text span, not elemBefore
		// @ts-ignore
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > a:hover > span[data-tag-text]': {
			textDecoration: 'underline',
		},
	},
});

// For accent borders, we use the new color.border.accent.*.subtle tokens (Color300
// light / Color800 dark) which provide proper decorative-border colours
//
// Icons keep color.icon.accent.* in the default state (vibrant on the plain page
// background) and swap to color.text.accent.* in hovered/pressed states (where the
// Tag picks up a coloured background and needs guaranteed 3:1 icon contrast).
const colorStyles = cssMapUnbound({
	gray: {
		'--tag-border-token': token('color.border.accent.gray.subtle'),
		'--tag-icon-token': token('color.icon.accent.gray'),
		'--tag-icon-hovered-token': token('color.text.accent.gray'),
		'--tag-icon-pressed-token': token('color.text.accent.gray'),
		'--tag-metric-bg-token': token('color.background.accent.gray.subtler'),
	},
	blue: {
		'--tag-border-token': token('color.border.accent.blue.subtle'),
		'--tag-icon-token': token('color.icon.accent.blue'),
		'--tag-icon-hovered-token': token('color.text.accent.blue'),
		'--tag-icon-pressed-token': token('color.text.accent.blue'),
		'--tag-metric-bg-token': token('color.background.accent.blue.subtler'),
	},
	green: {
		'--tag-border-token': token('color.border.accent.green.subtle'),
		'--tag-icon-token': token('color.icon.accent.green'),
		'--tag-icon-hovered-token': token('color.text.accent.green'),
		'--tag-icon-pressed-token': token('color.text.accent.green'),
		'--tag-metric-bg-token': token('color.background.accent.green.subtler'),
	},
	red: {
		'--tag-border-token': token('color.border.accent.red.subtle'),
		'--tag-icon-token': token('color.icon.accent.red'),
		'--tag-icon-hovered-token': token('color.text.accent.red'),
		'--tag-icon-pressed-token': token('color.text.accent.red'),
		'--tag-metric-bg-token': token('color.background.accent.red.subtler'),
	},
	yellow: {
		'--tag-border-token': token('color.border.accent.yellow.subtle'),
		'--tag-icon-token': token('color.icon.accent.yellow'),
		'--tag-icon-hovered-token': token('color.text.accent.yellow'),
		'--tag-icon-pressed-token': token('color.text.accent.yellow'),
		'--tag-metric-bg-token': token('color.background.accent.yellow.subtler'),
	},
	purple: {
		'--tag-border-token': token('color.border.accent.purple.subtle'),
		'--tag-icon-token': token('color.icon.accent.purple'),
		'--tag-icon-hovered-token': token('color.text.accent.purple'),
		'--tag-icon-pressed-token': token('color.text.accent.purple'),
		'--tag-metric-bg-token': token('color.background.accent.purple.subtler'),
	},
	lime: {
		'--tag-border-token': token('color.border.accent.lime.subtle'),
		'--tag-icon-token': token('color.icon.accent.lime'),
		'--tag-icon-hovered-token': token('color.text.accent.lime'),
		'--tag-icon-pressed-token': token('color.text.accent.lime'),
		'--tag-metric-bg-token': token('color.background.accent.lime.subtler'),
	},
	magenta: {
		'--tag-border-token': token('color.border.accent.magenta.subtle'),
		'--tag-icon-token': token('color.icon.accent.magenta'),
		'--tag-icon-hovered-token': token('color.text.accent.magenta'),
		'--tag-icon-pressed-token': token('color.text.accent.magenta'),
		'--tag-metric-bg-token': token('color.background.accent.magenta.subtler'),
	},
	orange: {
		'--tag-border-token': token('color.border.accent.orange.subtle'),
		'--tag-icon-token': token('color.icon.accent.orange'),
		'--tag-icon-hovered-token': token('color.text.accent.orange'),
		'--tag-icon-pressed-token': token('color.text.accent.orange'),
		'--tag-metric-bg-token': token('color.background.accent.orange.subtler'),
	},
	teal: {
		'--tag-border-token': token('color.border.accent.teal.subtle'),
		'--tag-icon-token': token('color.icon.accent.teal'),
		'--tag-icon-hovered-token': token('color.text.accent.teal'),
		'--tag-icon-pressed-token': token('color.text.accent.teal'),
		'--tag-metric-bg-token': token('color.background.accent.teal.subtler'),
	},
});

// Border + icon filter styles - base state.
// Borders use the new color.border.accent.*.subtle tokens directly.
// Icons use the color.icon.accent.* tokens directly in the default state.
const borderIconFilterStyles = cssMapUnbound({
	root: {
		borderColor: 'var(--tag-border-token)',
		'--ds-tag-icon': 'var(--tag-icon-token)',
	},
});

// Border + icon filter styles - interactive states (hover/pressed).
// Icons swap to the color.text.accent.* tokens for guaranteed 3:1 contrast
// against the coloured interactive backgrounds. Borders stay constant.
const borderIconInteractiveFilterStyles = cssMapUnbound({
	root: {
		'&:hover': {
			borderColor: 'var(--tag-border-token)',
			'--ds-tag-icon': 'var(--tag-icon-hovered-token)',
		},
		'&:active': {
			borderColor: 'var(--tag-border-token)',
			'--ds-tag-icon': 'var(--tag-icon-pressed-token)',
		},
	},
});

const dropdownStyles = cssMapUnbound({
	interactive: {
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
	},
	selected: {
		color: token('color.text.selected'),
		borderColor: token('color.border.selected'),
		backgroundColor: token('color.background.selected'),
		'&:hover': {
			backgroundColor: token('color.background.selected.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.selected.pressed'),
		},
	},
	content: {
		display: 'inline-flex',
		alignItems: 'center',
		gap: token('space.050', '4px'),
		// Allow shrinking below intrinsic content width so parent `maxWidth` can constrain and
		// `textStyles` ellipsis applies (flex items default to min-width: auto).
		flexGrow: 1,
		flexShrink: 1,
		minWidth: 0,
		overflow: 'hidden',
	},
	loadingContent: {
		opacity: 0,
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
});

/**
 * __TagNew__
 *
 * TagNew is the visual uplift implementation of Tag
 */
const TagNewComponent = forwardRef<HTMLSpanElement, TagNewProps>(function TagNew(
	{
		color = 'gray',
		text,
		elemBefore,
		href,
		linkComponent,
		isRemovable = true,
		removeButtonLabel,
		onBeforeRemoveAction,
		onAfterRemoveAction,
		testId,
		maxWidth,
		hasMargin = true,
		onClick,
		swatchBefore,
		swatchBeforeLabel,
		swatchBeforeRole,
		trailingMetric,
		...other
	},
	ref,
) {
	const normalizedText = getTagText(text);
	const { status, handleRemoveRequest, onKeyPress, removingTag, showingTag } =
		useTagRemoval(onBeforeRemoveAction);

	const onShrinkOutExitComplete = useCallback(() => {
		onAfterRemoveAction?.(normalizedText);
	}, [normalizedText, onAfterRemoveAction]);

	const { isLink, LinkComponent } = useLink(href, linkComponent);
	const {
		isLinkHovered,
		isOverButton,
		isButtonFocused,
		isLinkFocused,
		buttonHandlers,
		linkHandlers,
	} = useButtonInteraction();

	const removeButton = useRemoveButton({
		isRemovable,
		tagText: normalizedText,
		removeButtonLabel,
		testId,
		handleRemoveRequest,
		removingTag,
		showingTag,
		onKeyPress,
		buttonHandlers,
	});

	const tagContent = (
		<span
			{...other}
			ref={ref}
			css={[
				styles.baseStyles,
				!hasMargin && styles.noMarginStyles,
				colorStyles[color as keyof typeof colorStyles],
				borderIconFilterStyles.root,
				isLink && styles.interactiveBaseStyles,
				isLink && styles.focusRingStyles,
				// Only apply hover/active styles when link is hovered but NOT over the button
				isLink && isLinkHovered && !isOverButton && borderIconInteractiveFilterStyles.root,
				isLink && isLinkHovered && !isOverButton && styles.interactiveHoverStyles,
				isRemovable && styles.removableStyles,
				// Show focus ring when link is focused (but not when button is focused)
				isLinkFocused && !isButtonFocused && styles.childFocusRingStyles,
				// Reduce end padding when trailing metric is the last element (non-removable)
				!isRemovable &&
					trailingMetric != null &&
					trailingMetric !== '' &&
					styles.trailingMetricEndPadding,
			]}
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			style={maxWidth !== undefined ? { maxWidth } : undefined}
		>
			<LinkWrapper
				isLink={isLink}
				href={href}
				LinkComponent={LinkComponent}
				testId={testId}
				linkHandlers={linkHandlers}
				onClick={
					onClick as
						| ((e: React.MouseEvent<HTMLAnchorElement>, analyticsEvent: UIAnalyticsEvent) => void)
						| undefined
				}
			>
				<SwatchBefore
					colorKey={color}
					swatchBefore={swatchBefore}
					{...(fg('parent-field-switcher-missing-info-image-text')
						? { swatchBeforeLabel, swatchBeforeRole }
						: {})}
				/>
				{elemBefore && <span css={styles.beforeStyles}>{elemBefore}</span>}
				<span css={styles.textStyles} data-tag-text>
					{normalizedText}
				</span>
				{trailingMetric != null && trailingMetric !== '' && (
					<span css={styles.trailingMetric} data-testid={testId && `${testId}--metric`}>
						{trailingMetric}
					</span>
				)}
			</LinkWrapper>
			{removeButton && <span css={styles.afterStyles}>{removeButton}</span>}
		</span>
	);

	return (
		<RemovableWrapper
			isRemovable={isRemovable}
			status={status}
			onShrinkOutExitComplete={isRemovable ? onShrinkOutExitComplete : undefined}
		>
			{tagContent}
		</RemovableWrapper>
	);
});

// Put the tag dropdown trigger in this file to reuse the styles
/**
 * __Tag dropdown trigger__
 *
 * A tag-styled pressable button that acts as a dropdown trigger. Renders a chevron icon
 * and supports selected/loading states. Use this when you need a tag that opens a popup
 * or dropdown menu.
 */
export const TagDropdownTriggerComponent: import('react').ForwardRefExoticComponent<
	TagDropdownTriggerProps & import('react').RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, TagDropdownTriggerProps>(function TagDropdownTrigger(
	{
		color = 'gray',
		text,
		elemBefore,
		testId,
		maxWidth,
		hasMargin = true,
		onClick,
		isSelected = false,
		isLoading = false,
		analyticsContext: _analyticsContext,
		hasChevron = true,
		swatchBefore,
		swatchBeforeLabel,
		swatchBeforeRole,
		trailingMetric,
		...other
	},
	ref,
) {
	const resolvedColor = colorMapping[color] || 'gray';
	return (
		<Pressable
			ref={ref}
			// @ts-expect-error paddingInline is 0.1875rem
			// eslint-disable-next-line @compiled/no-suppress-xcss
			xcss={cx(
				styles.baseStyles,
				!hasMargin && styles.noMarginStyles,
				colorStyles[resolvedColor as keyof typeof colorStyles],
				borderIconFilterStyles.root,
				dropdownStyles.interactive,
				styles.focusRingStyles,
				borderIconInteractiveFilterStyles.root,
				isSelected && dropdownStyles.selected,
				// Reduce end padding when trailing metric is the last element (no chevron)
				!hasChevron &&
					trailingMetric != null &&
					trailingMetric !== '' &&
					styles.trailingMetricEndPadding,
			)}
			onClick={isLoading ? undefined : onClick}
			style={{
				borderColor: isSelected ? token('color.border.selected') : undefined,
				cursor: isLoading ? 'progress' : 'pointer',
				maxWidth: maxWidth !== undefined ? maxWidth : undefined,
			}}
			{...(isLoading && { 'aria-busy': true, 'aria-disabled': true, isDisabled: true })}
			testId={testId}
			{...other}
		>
			<span css={[dropdownStyles.content, isLoading && dropdownStyles.loadingContent]}>
				<SwatchBefore
					colorKey={resolvedColor}
					swatchBefore={swatchBefore}
					{...(fg('parent-field-switcher-missing-info-image-text')
						? { swatchBeforeLabel, swatchBeforeRole }
						: {})}
				/>
				{elemBefore && (
					<span css={[styles.beforeStyles, isSelected && styles.beforeStylesSelected]}>
						{elemBefore}
					</span>
				)}
				<span css={[styles.textStyles, isSelected && styles.textStylesSelected]} data-tag-text>
					{getTagText(text)}
				</span>
				{trailingMetric != null && trailingMetric !== '' && (
					<span css={styles.trailingMetric} data-testid={testId && `${testId}--metric`}>
						{trailingMetric}
					</span>
				)}
				{hasChevron && (
					<ChevronDownIcon
						label=""
						size="small"
						color={'currentColor'}
						testId={testId && `${testId}--chevron`}
					/>
				)}
			</span>
			{isLoading && (
				<span css={dropdownStyles.loadingOverlay}>
					<Spinner
						size={'xsmall'}
						label=", Loading"
						testId={testId ? `${testId}--loading-spinner` : undefined}
					/>
				</span>
			)}
		</Pressable>
	);
});

/**
 * __Tag new__
 */
const TagNew: import('react').MemoExoticComponent<
	import('react').ForwardRefExoticComponent<
		TagNewProps & import('react').RefAttributes<HTMLSpanElement>
	>
> = memo(TagNewComponent);

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export default TagNew;

export { colorMapping } from './color-mapping';
