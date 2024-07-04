import {
	type KeyboardEvent,
	type MouseEvent,
	type ReactElement,
	type ReactNode,
	type Ref,
} from 'react';

import type {
	CustomItemComponentProps,
	CustomItemProps,
	MenuGroupProps,
	SectionProps,
} from '@atlaskit/menu/types';
import type { ContentProps, TriggerProps } from '@atlaskit/popup/types';

export type FocusableElement = HTMLAnchorElement | HTMLButtonElement;
export type Action = 'next' | 'prev' | 'first' | 'last' | 'tab';

export type Placement =
	| 'auto-start'
	| 'auto'
	| 'auto-end'
	| 'top-start'
	| 'top'
	| 'top-end'
	| 'right-start'
	| 'right'
	| 'right-end'
	| 'bottom-end'
	| 'bottom'
	| 'bottom-start'
	| 'left-end'
	| 'left'
	| 'left-start';

export type ItemId = string;
export type GroupId = string;

export type CachedItem = {
	id: ItemId;
	groupId: GroupId;
};

export type FocusItem = {
	itemId: ItemId;
	itemNode: HTMLElement;
};

export type Behaviors = 'checkbox' | 'radio' | 'menuitemcheckbox' | 'menuitemradio';

export interface CustomTriggerProps<TriggerElement extends HTMLElement = any>
	extends Omit<TriggerProps, 'ref'> {
	/**
	 * Ref that should be applied to the trigger. This is used to calculate the menu position.
	 */
	triggerRef: Ref<TriggerElement>;
	/**
	 * Makes the trigger appear selected.
	 */
	isSelected?: boolean;

	/**
	 * Event that is triggered when the element is clicked.
	 */
	onClick?: (e: MouseEvent | KeyboardEvent) => void;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 *
	 * As dropdown-menu is composed of different components, we passed down the testId to the sub component you want to test:
	 * - `testId--trigger` to get the menu trigger.
	 * - `testId--content` to get the dropdown content trigger.
	 */
	testId?: string;
}

export interface OnOpenChangeArgs {
	isOpen: boolean;
	event: MouseEvent | KeyboardEvent;
}

export interface MenuWrapperProps extends MenuGroupProps {
	setInitialFocusRef?: ContentProps['setInitialFocusRef'];
	onClose?: ContentProps['onClose'];
	onUpdate: ContentProps['update'];
	isLoading?: InternalDropdownMenuProps['isLoading'];
	statusLabel?: InternalDropdownMenuProps['statusLabel'];
	shouldRenderToParent?: boolean;
	isTriggeredUsingKeyboard?: boolean;
	autoFocus?: boolean;
}

export interface DropdownMenuGroupProps extends SectionProps {}

interface InternalDropdownMenuProps<TriggerElement extends HTMLElement = any> {
	/**
	 * Controls the appearance of the menu.
	 * The default menu will scroll after its height exceeds the pre-defined amount.
	 * The tall menu won't scroll until the height exceeds the height of the viewport.
	 */
	appearance?: 'default' | 'tall';
	/**
	 * Controls if the first menu item receives focus when menu is opened. Note that the menu has a focus lock
	 * which traps the focus within the menu. The first item gets focus automatically
	 * if the menu is triggered using the keyboard.
	 *
	 */
	autoFocus?: boolean;

	/**
	 * Content that will be rendered inside the layer element. Should typically be
	 * `DropdownItemGroup` or `DropdownItem`, or the checkbox and radio variants of those.
	 */
	children?: ReactNode;

	/**
	 * If true, a spinner is rendered instead of the items.
	 */
	isLoading?: boolean;

	/**
	 * Text to be used as status for assistive technologies. Defaults to "Loading".
	 */
	statusLabel?: string;

	/**
	 * Controls the open state of the dropdown.
	 */
	isOpen?: boolean;

	/**
	 * Position of the menu.
	 */
	placement?: Placement;

	/**
	 * This fits the dropdown menu width to its parent's width.
	 * When set to `true`, the trigger and dropdown menu elements will be wrapped in a `div` with `position: relative`.
	 * The dropdown menu will be rendered as a sibling to the trigger element, and will be full width.
	 * The default is `false`.
	 */
	shouldFitContainer?: boolean;

	/**
	 * Allows the dropdown menu to be placed on the opposite side of its trigger if it does not
	 * fit in the viewport.
	 */
	shouldFlip?: boolean;

	/**
	 * The root element where the dropdown menu content should be rendered.
	 * `true` renders the dropdown menu in the DOM node closest to the trigger and avoids focus trap with tab keys.
	 * `false` renders the dropdown menu in React.Portal.
	 * Defaults to `false`.
	 */
	shouldRenderToParent?: boolean;

	/**
	 * Controls the spacing density of the menu.
	 */
	spacing?: Extract<MenuGroupProps['spacing'], 'cozy' | 'compact'>;

	/**
	 * Content that triggers the dropdown menu to open and close. Use with
	 * `triggerType` to get a button trigger. To customize the trigger element,
	 * provide a function to this prop. You can find
	 * [examples for custom triggers](https://atlassian.design/components/dropdown-menu/examples#custom-triggers)
	 * in our documentation.
	 */
	trigger?: string | ((triggerButtonProps: CustomTriggerProps<TriggerElement>) => ReactElement);

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 *
	 * As dropdown-menu is composed of different components, we passed down the testId to the sub component you want to test:
	 * - `testId--trigger` to get the menu trigger.
	 * - `testId--content` to get the dropdown content trigger.
	 */
	testId?: string;

	/**
	 * Controls the initial open state of the dropdown. If provided, the component is considered to be controlled
	 * which means that the user is responsible for managing the open and close state of the menu.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	defaultOpen?: boolean;

	/**
	 * Called when the menu should be open/closed. Receives an object with `isOpen` state.
	 */
	onOpenChange?: (args: OnOpenChangeArgs) => void;
	/**
	 * Z-index that the popup should be displayed in.
	 * This is passed to the portal component.
	 * Defaults to `layers.modal()` from `@atlaskit/theme` which is 510.
	 */
	zIndex?: number;
	/**
	 * Provide an accessible label via `aria-label` for assistive technology.
	 */
	label?: string;
}

type StandardDropdownMenuProps<TriggerElement extends HTMLElement = any> =
	InternalDropdownMenuProps<TriggerElement> & {
		shouldFitContainer?: false;
	};

type ShouldFitContainerDropdownMenuProps<TriggerElement extends HTMLElement = any> =
	InternalDropdownMenuProps<TriggerElement> & {
		shouldFitContainer: true;
		shouldRenderToParent?: true;
	};

export type DropdownMenuProps<TriggerElement extends HTMLElement = any> =
	| StandardDropdownMenuProps<TriggerElement>
	| ShouldFitContainerDropdownMenuProps<TriggerElement>;

export interface DropdownItemProps {
	/**
	 * Primary content for the item.
	 */
	children: React.ReactNode;

	/**
	 * Custom component to render as an item.
	 * Should be wrapped in `forwardRef` to avoid accessibility issues when controlling keyboard focus.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	component?: CustomItemProps['component'];

	/**
	 * Description of the item.
	 * This will render smaller text below the primary text of the item as well as slightly increasing the height of the item.
	 */
	description?: string | JSX.Element;

	/**
	 * Makes the element appear disabled. This will remove interactivity and the item won't appear in the focus order.
	 */
	isDisabled?: boolean;

	/**
	 * When `true` the title of the item will wrap multiple lines if it exceeds the width of the dropdown menu.
	 */
	shouldTitleWrap?: boolean;

	/**
	 * When `true` the description of the item will wrap multiple lines if it exceeds the width of the dropdown menu.
	 */
	shouldDescriptionWrap?: boolean;

	/**
	 * Event that is triggered when the element is clicked.
	 */
	onClick?: (e: MouseEvent | KeyboardEvent) => void;

	/**
	 * Makes the element appear selected.
	 */
	isSelected?: boolean;

	/**
	 * Link to another page.
	 */
	href?: string;

	/**
	 * Where to display the linked URL,
	 * see [anchor information](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) on mdn for more information.
	 */
	target?: string;

	/**
	 * Adds a title attribute to the root item element.
	 */
	title?: string;

	/**
	 * Element to render before the item text.
	 * Generally should be an [icon](https://atlaskit.atlassian.com/packages/design-system/icon) component.
	 */
	elemBefore?: React.ReactNode;

	/**
	 * Element to render after the item text.
	 * Generally should be an [icon](https://atlaskit.atlassian.com/packages/design-system/icon) component.
	 */
	elemAfter?: React.ReactNode;

	/**
	 * The relationship of the linked URL as space-separated link types.
	 * Generally you'll want to set this to "noopener noreferrer" when `target` is "_blank".
	 */
	rel?: string;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;

	/**
	 * Use this to opt out of using a router link and instead use a regular anchor element when
	 * using the `href` prop.
	 * Marked as "unsafe" because ideally, router links should be used for all internal links.
	 */
	UNSAFE_shouldDisableRouterLink?: boolean;
}

export interface DropdownItemCheckboxProps {
	/**
	 * Primary content for the item.
	 */
	children: React.ReactNode;

	/**
	 * Description of the item.
	 * This will render smaller text below the primary text of the item as well as slightly increasing the height of the item.
	 */
	description?: string | JSX.Element;

	/**
	 * Makes the checkbox appear disabled as well as removing interactivity.
	 */
	isDisabled?: boolean;

	/**
	 * When `true` the title of the item will wrap multiple lines if it's long enough.
	 */
	shouldTitleWrap?: boolean;

	/**
	 * When `true` the description of the item will wrap multiple lines if it's long enough.
	 */
	shouldDescriptionWrap?: boolean;

	/**
	 * Event that is triggered when the checkbox is clicked.
	 */
	onClick?: (e: MouseEvent | KeyboardEvent) => void;

	/**
	 * Sets whether the checkbox is checked or unchecked.
	 */
	isSelected?: boolean;

	/**
	 * Sets whether the checkbox begins selected.
	 */
	defaultSelected?: boolean;

	/**
	 * Unique id of a checkbox.
	 */
	id: string;

	/**
	 * Adds a title attribute to the root item element.
	 */
	title?: string;
	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
}

export interface DropdownItemRadioProps {
	/**
	 * Primary content for the item.
	 */
	children: React.ReactNode;

	/**
	 * Description of the item.
	 * This will render smaller text below the primary text of the item as well as slightly increasing the height of the item.
	 */
	description?: string | JSX.Element;

	/**
	 * Makes the checkbox appear disabled as well as removing interactivity.
	 */
	isDisabled?: boolean;

	/**
	 * When `true` the title of the item will wrap multiple lines if it's long enough.
	 */
	shouldTitleWrap?: boolean;

	/**
	 * When `true` the description of the item will wrap multiple lines if it's long enough.
	 */
	shouldDescriptionWrap?: boolean;

	/**
	 * Event that is triggered when the checkbox is clicked.
	 */
	onClick?: (e: MouseEvent | KeyboardEvent) => void;

	/**
	 * Sets whether the checkbox is checked or unchecked.
	 */
	isSelected?: boolean;

	/**
	 * Sets whether the checkbox begins selected.
	 */
	defaultSelected?: boolean;

	/**
	 * Unique ID of the checkbox.
	 */
	id: string;

	/**
	 * Adds a title attribute to the root item element.
	 */
	title?: string;
	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
}

export interface CustomItemHtmlProps extends CustomItemComponentProps {
	/**
	 * Link to another page.
	 */
	href?: string;
}
