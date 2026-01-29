/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentType, forwardRef, memo, type ReactNode } from 'react';

import { cssMap as cssMapUnbound, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import {
	LinkWrapper,
	RemovableWrapper,
	useButtonInteraction,
	useLink,
	useRemoveButton,
	useTagRemoval,
} from './shared';

// CSS variable name for icon color - must be used as literal string in cssMap due to Compiled CSS static analysis
const iconColorVar = '--ds-tag-icon' as const;

export type NewTagColor =
	| 'gray'
	| 'blue'
	| 'red'
	| 'yellow'
	| 'green'
	| 'teal'
	| 'purple'
	| 'lime'
	| 'orange'
	| 'magenta';

export interface TagNewProps {
	/**
	 * The color theme to apply. This sets both the background and text color.
	 */
	color?: NewTagColor;
	/**
	 * The component to be rendered before the tag text (e.g., an icon).
	 * For avatar/user representations, use `AvatarTag` instead.
	 *
	 * @see AvatarTag for avatar-based user tags
	 */
	elemBefore?: ReactNode;
	/**
	 * Text to be displayed in the tag.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	text: string;
	/**
	 * URI or path. If provided, the tag will be a link.
	 */
	href?: string;
	/**
	 * A link component to be used instead of our standard link. The styling of
	 * our link item will be applied to the link that is passed in.
	 */
	linkComponent?: ComponentType<any>;
	/**
	 * A `testId` prop is provided for specified elements.
	 */
	testId?: string;
	/**
	 * Flag to indicate if a tag is removable. Defaults to true.
	 */
	isRemovable?: boolean;
	/**
	 * Text rendered as the aria-label for remove button.
	 */
	removeButtonLabel?: string;
	/**
	 * Handler to be called before the tag is removed. If it does not return a
	 * truthy value, the tag will not be removed.
	 */
	onBeforeRemoveAction?: () => boolean;
	/**
	 * Handler to be called after tag is removed.
	 */
	onAfterRemoveAction?: (text: string) => void;
}

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
		height: '1.25rem',
		position: 'relative',
		alignItems: 'center',
		gap: token('space.050', '4px'),
		borderRadius: token('radius.small', '4px'),
		borderStyle: 'solid',
		borderWidth: token('border.width', '1px'),
		cursor: 'default',
		marginBlock: token('space.050', '4px'),
		marginInline: token('space.050', '4px'),
		paddingBlock: token('space.025', '2px'),
		paddingInline: '0.1875rem',
		font: token('font.body.small'),
		backgroundColor: token('color.background.neutral.subtle'),
	},
	removableStyles: {
		gap: token('space.050', '4px'),
	},
	beforeStyles: {
		display: 'inline-flex',
		alignItems: 'center',
		flexShrink: 0,
		textDecoration: 'none',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		color: `var(${iconColorVar})`,
	},
	textStyles: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		flexGrow: 1,
		minWidth: 0,
		maxWidth: '11.25rem',
		color: token('color.text'),
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
			outline: `${token('border.width.focused', '2px')} solid ${token('color.border.focused')}`,
			// @ts-ignore
			outlineOffset: token('space.025', '2px'),
		},
	},
	// Show focus ring when child link is focused via keyboard (applied conditionally via JS)
	childFocusRingStyles: {
		outline: `${token('border.width.focused', '2px')} solid ${token('color.border.focused')}`,
		// @ts-ignore
		outlineOffset: token('space.025', '2px'),
	},
	// Base interactive styles - always applied when link (cursor, link styling)
	interactiveBaseStyles: {
		cursor: 'pointer',
		// @ts-ignore
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > a': {
			display: 'inline-flex',
			alignItems: 'center',
			gap: token('space.050', '4px'),
			textDecoration: 'none',
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
		>
			<LinkWrapper
				isLink={isLink}
				href={href}
				LinkComponent={LinkComponent}
				testId={testId}
				linkHandlers={linkHandlers}
			>
				{elemBefore && <span css={styles.beforeStyles}>{elemBefore}</span>}
				<span css={styles.textStyles}>{text}</span>
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

/**
 * __Tag new__
 */
const TagNew = memo(TagNewComponent);

export default TagNew;
