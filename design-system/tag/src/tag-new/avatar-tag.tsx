/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentType, forwardRef, memo } from 'react';

import { cssMap as cssMapUnbound, jsx } from '@compiled/react';

import type { AvatarPropTypes } from '@atlaskit/avatar';
import { token } from '@atlaskit/tokens';

import {
	LinkWrapper,
	RemovableWrapper,
	useButtonInteraction,
	useLink,
	useRemoveButton,
	useTagRemoval,
} from './shared';

export interface AvatarTagProps {
	/**
	 * Text to be displayed in the tag (usually a person's name).
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	text: string;
	/**
	 * Avatar component from @atlaskit/avatar to be rendered before the tag text.
	 */
	avatar: ComponentType<AvatarPropTypes>;
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

const styles = cssMapUnbound({
	baseStyles: {
		display: 'inline-flex',
		boxSizing: 'border-box',
		minWidth: '0rem',
		height: '1.25rem',
		position: 'relative',
		alignItems: 'center',
		gap: token('space.025', '2px'),
		backgroundColor: token('color.background.neutral.subtle'),
		borderRadius: token('radius.full'),
		borderStyle: 'solid',
		borderWidth: token('border.width', '1px'),
		color: token('color.text'),
		cursor: 'default',
		font: token('font.body.small'),
		marginBlock: token('space.050', '4px'),
		marginInline: token('space.050', '4px'),
		paddingInlineEnd: '0.3125rem',
		paddingInlineStart: token('space.0', '0px'),
		paddingBlock: token('space.0', '0px'),
	},
	removableStyles: {
		paddingInlineEnd: '0.1875rem',
	},
	avatarStyles: {
		display: 'inline-flex',
		alignItems: 'center',
		flexShrink: 0,
		textDecoration: 'none',
		borderRadius: token('radius.full'),
		overflow: 'hidden',
		marginInlineStart: '-0.0625rem',
		marginInlineEnd: '-0.0625rem',
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
		marginInlineStart: token('space.025', '2px'),
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
		'& a': {
			display: 'inline-flex',
			alignItems: 'center',
			gap: token('space.025', '2px'),
			textDecoration: 'none',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			color: 'inherit !important',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			outline: 'none !important',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			boxShadow: 'none !important',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& a:focus': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			outline: 'none !important',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			boxShadow: 'none !important',
			textDecoration: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& a:visited': {
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
		'& a:hover': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
			color: 'inherit !important',
			textDecoration: 'underline',
		},
	},
});

/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-important-styles */
// Border color style - gray only for AvatarTag
const borderColorStyles = cssMapUnbound({
	root: {
		'--tag-border-token': token('color.border.accent.gray'),
	},
});

// Border filter styles - base state
const borderFilterStyles = cssMapUnbound({
	root: {
		borderColor:
			'color-mix(in oklch, var(--tag-border-token) 100%, var(--cm-border-color) var(--cm-border-value))',
		'--border-l-factor': '1.33',
		'--cm-border-color': 'white',
		'--cm-border-value': '45%',
		'[data-color-mode="dark"] &': {
			'--border-l-factor': '0.7',
			'--cm-border-color': 'black',
		},
		'@supports (color: oklch(from white l c h))': {
			borderColor: 'oklch(from var(--tag-border-token) calc(l * var(--border-l-factor)) c h)',
		},
	},
});

// Border filter styles - interactive states (hover/pressed)
const borderInteractiveFilterStyles = cssMapUnbound({
	root: {
		'--border-hovered-l-factor': '1.2',
		'--border-pressed-l-factor': '1.08',
		'--cm-border-hovered-value': '30%',
		'--cm-border-pressed-value': '10%',

		'[data-color-mode="dark"] &': {
			'--border-hovered-l-factor': '0.8',
			'--border-pressed-l-factor': '0.9',
		},

		'&:hover': {
			borderColor:
				'color-mix(in oklch, var(--tag-border-token) 100%, var(--cm-border-color) var(--cm-border-hovered-value))',
		},

		'&:active': {
			borderColor:
				'color-mix(in oklch, var(--tag-border-token) 100%, var(--cm-border-color) var(--cm-border-pressed-value))',
		},

		'@supports (color: oklch(from white l c h))': {
			'&:hover': {
				borderColor:
					'oklch(from var(--tag-border-token) calc(l * var(--border-hovered-l-factor)) c h)',
			},
			'&:active': {
				borderColor:
					'oklch(from var(--tag-border-token) calc(l * var(--border-pressed-l-factor)) c h)',
			},
		},
	},
});
/* eslint-enable @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-important-styles */

/**
 * __AvatarTag__
 *
 * AvatarTag is a specialized tag for representing people/users with an avatar and name.
 * It features a rounded pill design optimized for user representation.
 */
const AvatarTagComponent = forwardRef<HTMLSpanElement, AvatarTagProps>(function AvatarTag(
	{
		text,
		avatar: Avatar,
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
		shape: 'circle',
		buttonHandlers,
	});

	const tagContent = (
		<span
			{...other}
			ref={ref}
			css={[
				styles.baseStyles,
				borderColorStyles.root,
				borderFilterStyles.root,
				isLink && styles.interactiveBaseStyles,
				isLink && styles.focusRingStyles,
				// Only apply hover/active styles when link is hovered but NOT over the button
				isLink && isLinkHovered && !isOverButton && borderInteractiveFilterStyles.root,
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
				<span css={styles.avatarStyles}>
					<Avatar name={text} size="xsmall" borderColor="transparent" />
				</span>
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
 * __Avatar tag__
 */
const AvatarTag = memo(AvatarTagComponent);

export default AvatarTag;
