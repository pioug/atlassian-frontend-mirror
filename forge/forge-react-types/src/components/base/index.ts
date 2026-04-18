/**
 * UIKit component prop types migrated from @atlassian/forge-ui-types.
 *
 * These types are duplicated here so that @atlaskit/forge-react-types becomes
 * the single source of truth for all Forge React component types, reducing the
 * dependency on the internal @atlassian/forge-ui-types package.
 */

import type { ForgeChildren, ForgeNode } from './forge-nodes';

export type { ForgeElement, ForgeChildren, ForgeNode } from './forge-nodes';

/**
 * A key-value option used in select and user picker components.
 */
export interface Option {
	label: string;
	value: any;
}

/**
 * The visual style variation for button components.
 *
 * - `default` — Use for most actions that aren't the main call to action.
 * - `primary` — Use to call attention to the most important action on a page. Should appear once per area.
 * - `subtle` — Use alongside a primary button for secondary actions such as "Cancel".
 * - `warning` — Use to confirm actions that may cause a significant change or loss of data.
 * - `danger` — Use as a final confirmation for a destructive and irreversible action such as deleting.
 * - `link` — Renders the button as a hyperlink. **Only accepted by `LoadingButton`**; not documented for `Button` or `LinkButton`.
 * - `subtle-link` — Renders the button as a less prominent hyperlink. **Only accepted by `LoadingButton`**; not documented for `Button` or `LinkButton`.
 *
 * @see [Button](https://developer.atlassian.com/platform/forge/ui-kit/components/button/) in UI Kit documentation
 */
export type ButtonAppearance =
	| 'default'
	| 'danger'
	| 'link'
	| 'primary'
	| 'subtle'
	| 'subtle-link'
	| 'warning';

/**
 * Atlassian Design System space token values used by layout components such as `Inline` and `Stack`.
 *
 * Note: `'space.250'` is documented for `Stack` but **not** listed in the `Inline` `space` prop docs.
 *
 * @see [Atlassian Design System space tokens](https://atlassian.design/components/tokens/all-tokens#spacing)
 */
export type Space =
	| 'space.0'
	| 'space.025'
	| 'space.050'
	| 'space.075'
	| 'space.100'
	| 'space.150'
	| 'space.200'
	| 'space.250'
	| 'space.300'
	| 'space.400'
	| 'space.500'
	| 'space.600'
	| 'space.800'
	| 'space.1000';

export interface LinkProps {
	/**
	 * The text to display for the link.
	 *
	 * @type string
	 */
	children?: ForgeChildren<ForgeNode | string | number>;
	/**
	 * The URL to navigate to. Behaves like the HTML `href` attribute.
	 * Include `http(s)://` for full URLs. Relative paths such as `/wiki` are also supported.
	 */
	href: string;
	/** Whether the link should open in a new tab. Defaults to `false`. */
	openNewTab?: boolean;
}

/**
 * A component that displays a hyperlink. Use this component for inline links,
 * typically inside a `Text` component.
 *
 * @see [Link](https://developer.atlassian.com/platform/forge/ui-kit/components/link/) in UI Kit documentation
 */
export type TLink<T> = (props: LinkProps) => T;

/**
 * The value shape returned by the `UserPicker` component's `onChange` handler.
 */
export interface UserPickerValue {
	/** URL of the user's avatar image. */
	avatarUrl: string;
	/** The email address of the selected user. */
	email: string;
	/** The Atlassian account ID of the selected user. */
	id: string;
	/** The display name of the selected user. */
	name: string;
	/** The type of the entity, e.g. `"user"`. */
	type: string;
}

export type UserPickerProps = {
	/**
	 * The initial user to display. The value should be an Atlassian account ID.
	 */
	defaultValue?: string | string[];
	/** The text description of the user picker field. */
	description?: string;
	/** Whether the user can select multiple users from the list. Defaults to `false`. */
	isMulti?: boolean;
	/**
	 * Indicates whether a value is required to submit the form.
	 * If required, an asterisk appears after the field label.
	 */
	isRequired?: boolean;
	/** The label text to display above the field. */
	label: string;
	/**
	 * The key to which the selected value is assigned in the submitted form object.
	 * If `isMulti` is `true`, the submitted value is an array of account ID strings;
	 * otherwise it is a single string.
	 */
	name: string;
	/**
	 * Called when the selected user changes. Allows reading the value without
	 * requiring a form submission.
	 */
	onChange?: (user: UserPickerValue) => void;
	/** The placeholder helper text shown when no user is selected. */
	placeholder?: string;
};

/**
 * A dropdown field that allows users to search and select users from a list.
 *
 * @see [UserPicker](https://developer.atlassian.com/platform/forge/ui-kit/components/user-picker/) in UI Kit documentation
 */
export type TUserPicker<T> = (props: UserPickerProps) => T;

export type UserGroupProps = {
	/** The `User` elements whose avatars and/or names are displayed in the group. */
	children: ForgeChildren;
};

/**
 * Displays a stack of multiple users (name and profile picture), subject to
 * their privacy settings. Can also be used inside a `Text` component, where
 * users appear as inline lozenges.
 *
 * @see [UserGroup](https://developer.atlassian.com/platform/forge/ui-kit/components/user-group/) in UI Kit documentation
 */
export type TUserGroup<T> = (props: UserGroupProps) => T;

export type FrameProps = {
	/**
	 * Sets the height of the Frame component. By default the Frame resizes
	 * according to the size of its contents; setting this disables auto-resize.
	 * Accepted units are `px` and `%`.
	 */
	height?: string;
	/**
	 * The key of the resource to load inside the Frame. Must be defined in the
	 * app's `manifest.yml`. If missing or not found, a "Not Found" message is shown.
	 */
	resource: string;
	/**
	 * Sets the width of the Frame component. By default the Frame resizes
	 * according to the size of its contents; setting this disables auto-resize.
	 * Accepted units are `px` and `%`.
	 */
	width?: string;
};

/**
 * A container for rendering static frontend applications (HTML, CSS, JavaScript)
 * within a UI Kit app. Supports bidirectional communication with the host app
 * via the Events API.
 *
 * @see [Frame](https://developer.atlassian.com/platform/forge/ui-kit/components/frame/) in UI Kit documentation
 */
export type TFrame<T> = (props: FrameProps) => T;
