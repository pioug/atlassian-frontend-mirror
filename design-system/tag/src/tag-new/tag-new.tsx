/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, memo } from 'react';

import { cssMap as cssMapUnbound, cx, jsx } from '@compiled/react';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import __noop from '@atlaskit/ds-lib/noop';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import { Pressable } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import {
	LinkWrapper,
	RemovableWrapper,
	useButtonInteraction,
	useLink,
	useRemoveButton,
	useTagRemoval,
} from './shared';
import SwatchBefore from './swatch-before';
import { type NewTagColor, type TagDropdownTriggerProps, type TagNewProps } from './types';

// CSS variable name for icon color - must be used as literal string in cssMap due to Compiled CSS static analysis
const iconColorVar = '--ds-tag-icon' as const;

// Color mapping from old color names to new color names
export const colorMapping: Record<string, NewTagColor> = {
	standard: 'gray',
	grey: 'gray',
	blue: 'blue',
	green: 'green',
	red: 'red',
	yellow: 'yellow',
	purple: 'purple',
	lime: 'lime',
	magenta: 'magenta',
	orange: 'orange',
	teal: 'teal',
	// Light variants map to same as their non-light counterparts
	greyLight: 'gray',
	blueLight: 'blue',
	greenLight: 'green',
	redLight: 'red',
	yellowLight: 'yellow',
	purpleLight: 'purple',
	limeLight: 'lime',
	magentaLight: 'magenta',
	orangeLight: 'orange',
	tealLight: 'teal',
};

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
		marginBlock: token('space.050'),
		marginInline: token('space.050'),
		paddingBlock: token('space.025'),
		paddingInline: '0.1875rem',
		font: token('font.body.small'),
		backgroundColor: token('color.background.neutral.subtle'),
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
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		color: `var(${iconColorVar})`,
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

// Border and icon color styles - each color sets CSS variables for its token values
const colorStyles = cssMapUnbound({
	gray: {
		'--tag-border-token': token('color.border.accent.gray'),
		'--tag-icon-token': token('color.icon.accent.gray'),
	},
	blue: {
		'--tag-border-token': token('color.border.accent.blue'),
		'--tag-icon-token': token('color.icon.accent.blue'),
	},
	green: {
		'--tag-border-token': token('color.border.accent.green'),
		'--tag-icon-token': token('color.icon.accent.green'),
	},
	red: {
		'--tag-border-token': token('color.border.accent.red'),
		'--tag-icon-token': token('color.icon.accent.red'),
	},
	yellow: {
		'--tag-border-token': token('color.border.accent.yellow'),
		'--tag-icon-token': token('color.icon.accent.yellow'),
	},
	purple: {
		'--tag-border-token': token('color.border.accent.purple'),
		'--tag-icon-token': token('color.icon.accent.purple'),
	},
	lime: {
		'--tag-border-token': token('color.border.accent.lime'),
		'--tag-icon-token': token('color.icon.accent.lime'),
	},
	magenta: {
		'--tag-border-token': token('color.border.accent.magenta'),
		'--tag-icon-token': token('color.icon.accent.magenta'),
	},
	orange: {
		'--tag-border-token': token('color.border.accent.orange'),
		'--tag-icon-token': token('color.icon.accent.orange'),
	},
	teal: {
		'--tag-border-token': token('color.border.accent.teal'),
		'--tag-icon-token': token('color.icon.accent.teal'),
	},
});

/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/ui-styling-standard/no-unsafe-values */
// Border + icon filter styles - base state
const borderIconFilterStyles = cssMapUnbound({
	root: {
		borderColor:
			'color-mix(in oklch, var(--tag-border-token) 100%, var(--cm-border-color) var(--cm-border-value))',
		'--border-l-factor': '1.33',
		'--cm-border-color': 'white',
		'--cm-border-value': '45%',
		'--cm-icon-color': 'black',
		'--cm-icon-value': '20%',
		[iconColorVar]:
			'color-mix(in oklch, var(--tag-icon-token) 100%, var(--cm-icon-color) var(--cm-icon-value))',
		'--icon-l-factor': '0.88',
		'[data-color-mode="dark"] &': {
			'--border-l-factor': '0.7',
			'--cm-border-color': 'black',
			'--cm-icon-color': 'white',
			'--cm-icon-value': '0%',
			'--icon-l-factor': '1',
		},
		'@supports (color: oklch(from white l c h))': {
			borderColor: 'oklch(from var(--tag-border-token) calc(l * var(--border-l-factor)) c h)',
			[iconColorVar]: 'oklch(from var(--tag-icon-token) calc(l * var(--icon-l-factor)) c h)',
		},
	},
});

// Border + icon filter styles - interactive states (hover/pressed)
const borderIconInteractiveFilterStyles = cssMapUnbound({
	root: {
		'--border-hovered-l-factor': '1.2',
		'--border-pressed-l-factor': '1.08',
		'--cm-border-hovered-value': '30%',
		'--cm-border-pressed-value': '10%',
		'--cm-icon-hovered-value': '30%',
		'--cm-icon-pressed-value': '40%',
		'--icon-hovered-l-factor': '0.8',
		'--icon-pressed-l-factor': '0.7',

		'[data-color-mode="dark"] &': {
			'--border-hovered-l-factor': '0.8',
			'--border-pressed-l-factor': '0.9',
			'--cm-icon-hovered-value': '30%',
			'--cm-icon-pressed-value': '70%',
			'--icon-hovered-l-factor': '1.15',
			'--icon-pressed-l-factor': '1.37',
		},

		'&:hover': {
			borderColor:
				'color-mix(in oklch, var(--tag-border-token) 100%, var(--cm-border-color) var(--cm-border-hovered-value))',
			[iconColorVar]:
				'color-mix(in oklch, var(--tag-icon-token) 100%, var(--cm-icon-color) var(--cm-icon-hovered-value))',
		},

		'&:active': {
			borderColor:
				'color-mix(in oklch, var(--tag-border-token) 100%, var(--cm-border-color) var(--cm-border-pressed-value))',
			[iconColorVar]:
				'color-mix(in oklch, var(--tag-icon-token) 100%, var(--cm-icon-color) var(--cm-icon-pressed-value))',
		},

		'@supports (color: oklch(from white l c h))': {
			'&:hover': {
				borderColor:
					'oklch(from var(--tag-border-token) calc(l * var(--border-hovered-l-factor)) c h)',
				[iconColorVar]:
					'oklch(from var(--tag-icon-token) calc(l * var(--icon-hovered-l-factor)) c h)',
			},
			'&:active': {
				borderColor:
					'oklch(from var(--tag-border-token) calc(l * var(--border-pressed-l-factor)) c h)',
				[iconColorVar]:
					'oklch(from var(--tag-icon-token) calc(l * var(--icon-pressed-l-factor)) c h)',
			},
		},
	},
});
/* eslint-enable @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/ui-styling-standard/no-unsafe-values */

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

/* eslint-enable @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-important-styles, @atlaskit/ui-styling-standard/no-unsafe-values */

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
		onClick,
		swatchBefore,
		...other
	},
	ref,
) {
	const { status, handleRemoveRequest, onKeyPress, removingTag, showingTag } = useTagRemoval(
		text,
		onBeforeRemoveAction,
		onAfterRemoveAction,
	);

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
		tagText: text,
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
				<SwatchBefore colorKey={color} swatchBefore={swatchBefore} />
				{elemBefore && <span css={styles.beforeStyles}>{elemBefore}</span>}
				<span css={styles.textStyles} data-tag-text>
					{text}
				</span>
			</LinkWrapper>
			{removeButton && <span css={styles.afterStyles}>{removeButton}</span>}
		</span>
	);

	return (
		<RemovableWrapper isRemovable={isRemovable} status={status}>
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
		onClick,
		isSelected = false,
		isLoading = false,
		analyticsContext: _analyticsContext,
		hasChevron = true,
		swatchBefore,
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
				colorStyles[resolvedColor as keyof typeof colorStyles],
				dropdownStyles.interactive,
				styles.focusRingStyles,
				borderIconFilterStyles.root,
				borderIconInteractiveFilterStyles.root,
				isSelected && dropdownStyles.selected,
			)}
			onClick={isLoading ? undefined : onClick}
			style={{
				borderColor: isSelected ? token('color.border.selected') : undefined,
				cursor: isLoading ? 'progress' : 'pointer',
				maxWidth: maxWidth !== undefined ? maxWidth : undefined,
			}}
			{...(isLoading && { 'aria-busy': true, 'aria-disabled': true, isDisabled: true })}
			data-testid={testId}
			{...other}
		>
			<span css={[dropdownStyles.content, isLoading && dropdownStyles.loadingContent]}>
				<SwatchBefore colorKey={resolvedColor} swatchBefore={swatchBefore} />
				{elemBefore && (
					<span css={[styles.beforeStyles, isSelected && styles.beforeStylesSelected]}>
						{elemBefore}
					</span>
				)}
				<span css={[styles.textStyles, isSelected && styles.textStylesSelected]} data-tag-text>
					{text}
				</span>
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

export default TagNew;
