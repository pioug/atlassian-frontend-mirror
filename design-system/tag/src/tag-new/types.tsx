import React, { type ComponentType, type ReactNode } from 'react';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type {
	BackgroundColor,
	BackgroundColorHovered,
	BackgroundColorPressed,
} from '@atlaskit/tokens/css-type-schema';
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
	/**
	 * Maximum width of the tag. When exceeded, the text will be truncated with ellipsis.
	 * Accepts any valid CSS max-width value (e.g., '200px', '15rem', '100%').
	 */
	maxWidth?: string | number;
	/**
	 * Handler called when the tag is clicked. Only fires for link tags (when href is provided).
	 * The second argument provides an Atlaskit UI analytics event.
	 */
	onClick?:
		| ((e: React.MouseEvent<HTMLAnchorElement>, analyticsEvent: UIAnalyticsEvent) => void)
		| ((e: React.MouseEvent<HTMLButtonElement>, analyticsEvent?: UIAnalyticsEvent) => void);
	/**
	 * EXPERIMENTAL - Leading color swatch (12×12px), rendered before `elemBefore`.
	 * - `true`: uses `color.background.accent.<color>.subtle` for swatch color
	 * - Pass a design token (e.g. `token('color.background.accent.red.subtle')`)
	 */
	swatchBefore?: boolean | TagSwatchBeforeTokenName;
}

export type TagSwatchBeforeTokenName =
	| BackgroundColor
	| BackgroundColorHovered
	| BackgroundColorPressed;

/**
 * Props for the TagDropdownTrigger component.
 * Extends TagNewProps while removing link-related and removable props,
 * and adding dropdown-specific props.
 */
export type TagDropdownTriggerProps = Omit<
	TagNewProps,
	| 'isRemovable'
	| 'onBeforeRemoveAction'
	| 'onAfterRemoveAction'
	| 'removeButtonLabel'
	| 'href'
	| 'linkComponent'
	| 'onClick'
> & {
	/**
	 * Whether the dropdown trigger is currently selected/active.
	 * When true, applies a selected state styling with a border.
	 */
	isSelected?: boolean;

	/**
	 * Whether the dropdown trigger is in a loading state.
	 * When true, indicates the trigger is processing an action.
	 */
	isLoading?: boolean;

	/**
	 * Additional information to be included in the `context` of Atlaskit analytics events
	 * that come from the tag dropdown trigger.
	 */
	analyticsContext?: Record<string, any>;

	/**
	 * Identifies the popup element that the trigger controls.
	 * Should match the `id` of the popup content for screen readers to understand the relationship.
	 */
	'aria-controls'?: string;

	/**
	 * Announces to assistive technology whether the popup is currently open or closed.
	 */
	'aria-expanded'?: boolean;

	/**
	 * Informs assistive technology that this element triggers a popup.
	 * Supports various popup types like menu, listbox, tree, grid, or dialog.
	 */
	'aria-haspopup'?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';

	/**
	 * Defines a string value that labels the trigger element for assistive technology.
	 */
	'aria-label'?: string;

	/**
	 * When false, hides the chevron icon that is shown after the tag content.
	 */
	hasChevron?: boolean;

	/**
	 * Callback fired when the trigger is clicked. The second argument provides an Atlaskit UI analytics event that can be fired to a listening channel. See the [analytics-next documentation](https://atlaskit.atlassian.com/packages/analytics/analytics-next) for more information.
	 */
	onClick?: (event: React.MouseEvent<HTMLButtonElement>, analyticsEvent?: UIAnalyticsEvent) => void;
};
