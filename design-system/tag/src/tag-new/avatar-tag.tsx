/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ComponentType, forwardRef, memo } from 'react';

import { cssMap as cssMapUnbound, jsx } from '@compiled/react';

import type { AvatarPropTypes } from '@atlaskit/avatar';
import StatusVerifiedIcon from '@atlaskit/icon/core/status-verified';
import type { TeamAvatarProps } from '@atlaskit/teams-avatar';
import { token } from '@atlaskit/tokens';

import {
	LinkWrapper,
	RemovableWrapper,
	useButtonInteraction,
	useLink,
	useRemoveButton,
	useTagRemoval,
} from './shared';

/**
 * The type values that AvatarTag accepts.
 */
export type TypesOfAvatars = 'user' | 'agent' | 'other';

/**
 * Props controlled by AvatarTag that will be passed to the avatar component.
 * These props are managed internally by AvatarTag.
 */
export interface AvatarRenderProps {
	/**
	 * The size of the avatar. Always 'xsmall' for AvatarTag.
	 */
	size: 'xsmall';
	/**
	 * The appearance/shape of the avatar based on the tag type.
	 * - 'circle' for user (round avatars)
	 * - 'square' for other/teams (square avatars)
	 * - 'hexagon' for agents (hexagonal avatars)
	 */
	appearance: 'circle' | 'square' | 'hexagon';
	/**
	 * The border color for the avatar. Always 'transparent' for AvatarTag.
	 */
	borderColor: 'transparent';
}

/**
 * Common props shared across all AvatarTag types.
 */
interface CommonAvatarTagProps {
	/**
	 * Text to be displayed in the tag (usually a person's name or entity name).
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

/**
 * Props for user avatar tags with circular avatars.
 */
type UserAvatarTag = CommonAvatarTagProps & {
	/**
	 * The type of avatar tag. 'user' uses circular avatars for individuals.
	 */
	type: 'user';
	/**
	 * isVerified is not allowed for user tags.
	 */
	isVerified?: never;
	/**
	 * The avatar component to render. AvatarTag will provide controlled props (size, appearance, borderColor).
	 * Accepts Avatar or any compatible component.
	 * @example avatar={Avatar}
	 * @example avatar={(props) => <Avatar {...props} src="user.png" />}
	 */
	avatar: ComponentType<Omit<AvatarPropTypes, 'size' | 'appearance' | 'borderColor'>>;
};

/**
 * Props for other/teams avatar tags with square avatars.
 */
type OtherAvatarTag = CommonAvatarTagProps & {
	/**
	 * The type of avatar tag. 'other' uses square avatars for teams/projects/spaces.
	 */
	type: 'other';
	/**
	 * Whether this entity is verified. Shows a blue verified icon after the text.
	 */
	isVerified?: boolean;
	/**
	 * The avatar component to render. AvatarTag will provide controlled props (size, appearance, borderColor).
	 * Accepts Avatar, TeamAvatar, or any compatible component.
	 * @example avatar={TeamAvatar}
	 * @example avatar={(props) => <TeamAvatar {...props} name="Team" />}
	 */
	avatar:
		| ComponentType<Omit<AvatarPropTypes, 'size' | 'appearance' | 'borderColor'>>
		| ComponentType<Omit<TeamAvatarProps, 'size'>>;
};

/**
 * Props for agent avatar tags with hexagonal avatars.
 */
type AgentAvatarTag = CommonAvatarTagProps & {
	/**
	 * The type of avatar tag. 'agent' uses hexagonal avatars for AI agents.
	 */
	type: 'agent';
	/**
	 * isVerified is not allowed for agent tags.
	 */
	isVerified?: never;
	/**
	 * The avatar component to render. AvatarTag will provide controlled props (size, appearance, borderColor).
	 * Accepts Avatar or any compatible component.
	 * @example avatar={Avatar}
	 * @example avatar={(props) => <Avatar {...props} src="agent.png" />}
	 */
	avatar: ComponentType<Omit<AvatarPropTypes, 'size' | 'appearance' | 'borderColor'>>;
};

/**
 * Props for AvatarTag component. Uses discriminated union based on `type`.
 */
export type AvatarTagProps = UserAvatarTag | OtherAvatarTag | AgentAvatarTag;

const styles = cssMapUnbound({
	baseStyles: {
		display: 'inline-flex',
		boxSizing: 'border-box',
		minWidth: '0px',
		height: token('space.250', '20px'),
		position: 'relative',
		alignItems: 'center',
		verticalAlign: 'middle',
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
		paddingInlineEnd: '6px',
		paddingInlineStart: token('space.0', '0px'),
		paddingBlock: token('space.0', '0px'),
	},
	otherBaseStyles: {
		borderRadius: token('radius.small', '4px'),
		paddingInlineEnd: token('space.050', '4px'),
	},
	agentBaseStyles: {
		borderRadius: token('radius.small', '4px'),
		paddingInlineEnd: token('space.050', '4px'),
	},
	removableStyles: {
		paddingInlineEnd: '3px',
	},
	userRemovableStyles: {
		paddingInlineEnd: '3px',
	},
	avatarStyles: {
		display: 'inline-flex',
		alignItems: 'center',
		flexShrink: 0,
		textDecoration: 'none',
		borderRadius: token('radius.full'),
		overflow: 'hidden',
		marginInlineStart: '-1px',
	},
	otherAvatarStyles: {
		borderRadius: token('radius.small', '4px'),
	},
	agentAvatarStyles: {
		borderRadius: 0,
	},
	textStyles: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		flexGrow: 1,
		minWidth: 0,
		maxWidth: '180px',
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
	verifiedIconStyles: {
		display: 'inline-flex',
		alignItems: 'center',
		flexShrink: 0,
		color: token('color.icon.accent.blue'),
		marginInlineStart: '1px',
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
 * AvatarTag is a specialized tag for representing people, teams/other entities, or agents with an avatar and name.
 * The visual appearance (round, square, or hexagonal) is determined by the `type` prop.
 */
const AvatarTagComponent = forwardRef<HTMLSpanElement, AvatarTagProps>(function AvatarTag(
	{
		text,
		type,
		avatar: AvatarComponent,
		href,
		linkComponent,
		isRemovable = true,
		removeButtonLabel,
		onBeforeRemoveAction,
		onAfterRemoveAction,
		testId,
		isVerified, // Shows verified icon for 'other' type tags
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

	// Determine styles based on type
	const isOtherType = type === 'other';
	const isAgentType = type === 'agent';
	const isUserType = type === 'user';

	// isVerified is only available for 'other' type
	const showVerified = isOtherType && isVerified;

	// Determine avatar appearance based on type
	const avatarAppearance = isUserType ? 'circle' : isAgentType ? 'hexagon' : 'square';

	// Determine remove button shape based on type
	const removeButtonShape = isUserType ? 'circle' : 'default';

	const removeButton = useRemoveButton({
		isRemovable,
		tagText: text,
		removeButtonLabel,
		testId,
		handleRemoveRequest,
		removingTag,
		showingTag,
		onKeyPress,
		shape: removeButtonShape,
		buttonHandlers,
	});

	// Render the avatar component with controlled props
	// Cast to ComponentType<AvatarRenderProps> to inject controlled props at runtime
	const AvatarWithControlledProps = AvatarComponent as ComponentType<AvatarRenderProps>;
	const avatarElement = (
		<AvatarWithControlledProps
			size="xsmall"
			appearance={avatarAppearance}
			borderColor="transparent"
		/>
	);

	const tagContent = (
		<span
			{...other}
			ref={ref}
			css={[
				styles.baseStyles,
				isOtherType && styles.otherBaseStyles,
				isAgentType && styles.agentBaseStyles,
				borderColorStyles.root,
				borderFilterStyles.root,
				isLink && styles.interactiveBaseStyles,
				isLink && styles.focusRingStyles,
				// Only apply hover/active styles when link is hovered but NOT over the button
				isLink && isLinkHovered && !isOverButton && borderInteractiveFilterStyles.root,
				isLink && isLinkHovered && !isOverButton && styles.interactiveHoverStyles,
				isRemovable && !isUserType && styles.removableStyles,
				isRemovable && isUserType && styles.userRemovableStyles,
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
				<span
					css={[
						styles.avatarStyles,
						isOtherType && styles.otherAvatarStyles,
						isAgentType && styles.agentAvatarStyles,
					]}
				>
					{avatarElement}
				</span>
				<span css={styles.textStyles}>{text}</span>
			</LinkWrapper>
			{showVerified && (
				<span css={styles.verifiedIconStyles}>
					<StatusVerifiedIcon label="Verified" size="small" />
				</span>
			)}
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
