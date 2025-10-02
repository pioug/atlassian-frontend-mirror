import type React from 'react';

import type { IntlShape } from 'react-intl-next';

import type { Node, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { EmojiId } from '@atlaskit/emoji/types';
import type { SpotlightCard } from '@atlaskit/onboarding';
import type { Placement } from '@atlaskit/popper';
import type { TooltipProps } from '@atlaskit/tooltip';

import type { DispatchAnalyticsEvent } from '../analytics/types/dispatch-analytics-event';
import type { DropdownMenuItemProps } from '../floating-toolbar';
import type { ProviderFactory } from '../provider-factory';
import type { PaletteColor } from '../ui-color/ColorPalette/Palettes/type';

import type { Command, CommandDispatch } from './command';
import type { MarkOptions, NodeOptions } from './copy-button';

/**
 * New dropdown types to support editor controls
 */
export type OverflowDropdownHeading = {
	title: string;
	type: 'overflow-dropdown-heading';
};

type OverflowDropdownCustom<T extends Object> = {
	fallback: Array<FloatingToolbarFallbackItem<T>>;
	hidden?: boolean;
	render: (
		view?: EditorView,
		dropdownOption?: Omit<DropdownMenuItemProps, 'item'>,
	) => React.ReactNode;
	type: 'custom';
};

export type OverflowDropdownOption<T extends Object> = DropdownOptionT<T> & { rank?: number };

export type FloatingToolbarOverflowDropdownOptions<T extends Object> = Array<
	| OverflowDropdownOption<T>
	| FloatingToolbarSeparator
	| OverflowDropdownHeading
	| OverflowDropdownCustom<T>
>;

export type FloatingToolbarOverflowDropdown<T extends Object> = {
	// A prop to align the dropdown with the floating toolbar instead of the toolbar item
	alignDropdownWithToolbar?: boolean;
	disabled?: boolean;
	dropdownWidth?: number;
	hidden?: boolean;
	id?: string;
	onClick?: () => void;
	options: FloatingToolbarOverflowDropdownOptions<T>;
	showSelected?: boolean;
	supportsViewMode?: boolean; // TODO: MODES-3950 - Clean up this floating toolbar view mode logic
	testId?: string;
	tooltip?: string;
	type: 'overflow-dropdown';
};

export interface RenderOptionsPropsT<T extends Object> {
	dispatchCommand: (command: T) => void;
	hide: () => void;
}

export interface DropdownOptionT<T extends Object> {
	confirmDialog?: ConfirmDialogOptions | (() => ConfirmDialogOptions);
	description?: string;
	disabled?: boolean;
	domItemOptions?: { type: typeOption };
	elemAfter?: React.ReactNode;
	hidden?: boolean;
	icon?: React.ReactNode;
	id?: string;
	onBlur?: T;
	onClick: T;
	onFocus?: T;
	onMouseDown?: T;
	onMouseEnter?: T;
	onMouseLeave?: T;
	onMouseOut?: T;
	onMouseOver?: T;
	selected?: boolean;
	testId?: string;
	title: string;
	tooltip?: string;
}

export type typeOption =
	/** Dropdown menu item type
	 * @default 'item'
	 */
	'item' | 'item-checkbox';

export type DropdownOptions<T extends Object> =
	| Array<DropdownOptionT<T>>
	| {
			height: number;
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			render: (props: RenderOptionsPropsT<T>) => React.ReactElement<any> | null;
			width: number;
	  };

export interface SelectOption<T extends Object = Object> {
	data?: T;
	disabled?: boolean;
	hidden?: boolean;
	label: string;
	selected?: boolean;
	value: string;
}

export type ButtonAppearance = 'subtle' | 'danger';
export type Icon = React.ComponentType<React.PropsWithChildren<{ label: string }>>;
export type RenderOptionsProps = RenderOptionsPropsT<Command>;

export type AlignType = 'left' | 'center' | 'right';

interface Position {
	bottom?: number;
	left?: number;
	right?: number;
	top?: number;
}

type PositionOffset = Position;

export type ConfirmDialogChildInfo = {
	amount: number;
	id: string;
	name: string | null;
};

export interface ConfirmDialogOptions {
	cancelButtonLabel?: string; // Defaults to "Cancel"
	checkboxLabel?: string;
	getChildrenInfo?: () => ConfirmDialogChildInfo[];
	isReferentialityDialog?: boolean; // option for extra content
	message: string;
	messagePrefix?: string;
	okButtonLabel?: string; // Defaults to "OK"
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onConfirm?: (...args: any[]) => Command;
	title?: string; // Defaults to "Are you sure?"
}

export type ConfirmationDialogProps = {
	/**
	 * onClose is called every time when the dialog is closed.
	 * Either clicking on 'Confirm' button or 'Cancel' button,
	 * which means it is being called after onConfirm, or by itself when clicking 'Cancel' button.
	 */
	onClose: () => void;
	onConfirm: (isCheck?: boolean) => void;
	options?: ConfirmDialogOptions;
	testId?: string;
};

export type FloatingToolbarButtonSpotlightConfig = {
	isSpotlightOpen: boolean;
	onTargetClick?: () => void;
	pulse?: boolean;
	spotlightCardOptions: React.ComponentProps<typeof SpotlightCard> & { placement?: Placement };
};

export type FloatingToolbarCopyButton = {
	hidden?: boolean;
	items: Array<FloatingToolbarSeparator | MarkOptions | NodeOptions>;
	supportsViewMode?: boolean; // TODO: MODES-3950 - Clean up this floating toolbar view mode logic
	type: 'copy-button';
};

export type FloatingToolbarButton<T extends Object> = {
	appearance?: ButtonAppearance;
	ariaHasPopup?: boolean | 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid' | undefined;
	ariaLabel?: string; // For accessibility, aria-label for the button
	className?: string;
	confirmDialog?: ConfirmDialogOptions | (() => ConfirmDialogOptions);
	disabled?: boolean;
	focusEditoronEnter?: boolean; // To focus the editor when button is pressed default value - false
	hidden?: boolean;
	hideTooltipOnClick?: boolean;
	href?: string;
	icon?: Icon;
	iconAfter?: Icon;
	iconFallback?: Icon;
	id?: string;
	interactionName?: string;
	isRadioButton?: boolean;
	// For sending data over the mobile bridge
	metadata?: { [key: string]: string };
	onBlur?: T;
	onClick: T;
	onFocus?: T;
	onMount?: () => void;
	onMouseEnter?: T;
	onMouseLeave?: T;
	onUnmount?: () => void;
	/** If true, the component will have pulse onboarding effect around it. */
	pulse?: boolean;
	selected?: boolean;
	showTitle?: boolean;
	spotlightConfig?: FloatingToolbarButtonSpotlightConfig;
	supportsViewMode?: boolean; // TODO: MODES-3950 - Clean up this floating toolbar view mode logic
	tabIndex?: number | null | undefined;
	target?: string;
	testId?: string;
	title: string;
	tooltipContent?: TooltipProps['content'];
	type: 'button';
};

export type FloatingToolbarInput<T extends Object> = {
	defaultValue?: string;
	description?: string;
	hidden?: boolean;
	id: string;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onBlur: (...args: any[]) => T;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onSubmit: (...args: any[]) => T;
	placeholder?: string;
	title?: string;
	type: 'input';
};

export type FloatingToolbarCustom<T extends Object> = {
	/**
	 * By default -- the floating toolbar supports navigating between
	 * items using arrow keys (to meet aria guidelines).
	 * In some cases the floating toolbar is being used to present
	 * non toolbar content -- such as the link editing experience.
	 * In these cases you can opt out of arrow navigation using the
	 * this property.
	 *
	 * @default false
	 */
	disableArrowNavigation?: boolean;
	fallback: Array<FloatingToolbarFallbackItem<T>>;
	hidden?: boolean;
	// No superset of all these types yet
	render: (
		view?: EditorView,
		idx?: number,
		dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
	) => React.ReactNode;
	supportsViewMode?: boolean; // TODO: MODES-3950 - Clean up this floating toolbar view mode logic
	type: 'custom';
};

type FloatingToolbarSelectBase<T extends Object, V = SelectOption> = {
	defaultValue?: V | null;
	filterOption?: ((option: V, rawInput: string) => boolean) | null;
	hidden?: boolean;
	hideExpandIcon?: boolean;
	id: string;
	isAriaExpanded?: boolean;
	onChange: (selected: V) => T;
	options: V[];
	placeholder?: string;
	returnEscToButton?: boolean;
	selectType: 'list' | 'emoji' | 'date' | 'color';
	title?: string;
	type: 'select';
};

export type FloatingToolbarListPicker<T extends Object> = FloatingToolbarSelectBase<T> & {
	selectType: 'list';
};

export type FloatingToolbarColorPicker<T extends Object> = FloatingToolbarSelectBase<
	T,
	PaletteColor
> & {
	selectType: 'color';
};

export type FloatingToolbarEmojiPicker<T extends Object> = FloatingToolbarSelectBase<T, EmojiId> & {
	options: never[];
	selected?: boolean;
	selectType: 'emoji';
};

export type FloatingToolbarDatePicker<T extends Object> = FloatingToolbarSelectBase<T, number> & {
	options: never[];
	selectType: 'date';
};

export type FloatingToolbarSelect<T extends Object> =
	| FloatingToolbarEmojiPicker<T>
	| FloatingToolbarColorPicker<T>
	| FloatingToolbarListPicker<T>
	| FloatingToolbarDatePicker<T>;

export type FloatingToolbarSeparator = {
	fullHeight?: boolean;
	hidden?: boolean;
	supportsViewMode?: boolean; // TODO: MODES-3950 - Clean up this floating toolbar view mode logic
	type: 'separator';
};

export type ExtensionDropdownOptions = () => DropdownOptions<Function>;

export type FloatingToolbarDropdown<T extends Object> = {
	// A prop to align the dropdown with the floating toolbar instead of the toolbar item
	alignDropdownWithToolbar?: boolean;
	disabled?: boolean;
	dropdownWidth?: number;
	footer?: React.ReactNode;
	hidden?: boolean;
	hideExpandIcon?: boolean;
	icon?: Icon;
	/**
	 * Places an icon before the title as a representation
	 */
	iconBefore?: Icon;
	id?: string;
	onClick?: () => void;
	onMount?: () => void;
	onToggle?: (state: EditorState, dispatch: CommandDispatch | undefined) => boolean;
	options: DropdownOptions<T> | ExtensionDropdownOptions;
	/** If true, the component will have pulse onboarding effect around it. */
	pulse?: boolean;
	shouldFitContainer?: boolean;
	showSelected?: boolean;
	testId?: string;
	title: string;
	tooltip?: string;
	type: 'dropdown';
};

type FloatingToolbarExtensionsPlaceholder = {
	hidden?: boolean;
	separator?: 'start' | 'end' | 'both';
	type: 'extensions-placeholder';
};

/**
 * This additional type is introduced in order to prevent infinite loop due to
 * `extract-react-types-loader`. The issue occurs when custom type `fallback` field
 * is an array of FloatingToolbarItem. Since FloatingToolbarItem is a FloatingToolbarCustom
 * type, it stucks in an infinite loop. Custom - Item -> Custom .... go on.
 *
 * This type is restricted with the items that can be used for fallback.
 * Make sure that this type is not a FloatingToolbarCustom type.
 */
export type FloatingToolbarFallbackItem<T extends Object> =
	| FloatingToolbarButton<T>
	| FloatingToolbarCopyButton
	| FloatingToolbarDropdown<T>
	| FloatingToolbarSelect<T>
	| FloatingToolbarInput<T>
	| FloatingToolbarSeparator;

export type FloatingToolbarItem<T extends Object> =
	| FloatingToolbarButton<T>
	| FloatingToolbarCopyButton
	| FloatingToolbarDropdown<T>
	| FloatingToolbarSelect<T>
	| FloatingToolbarInput<T>
	| FloatingToolbarCustom<T>
	| FloatingToolbarSeparator
	| FloatingToolbarExtensionsPlaceholder
	| FloatingToolbarOverflowDropdown<T>;

export interface FloatingToolbarConfig {
	/**
	 * For internal use only, we will be depricating this API soon.
	 * If any config has __suppressAllToolbars set to true, no floating toolbar will be rendered.
	 * Use case:
	 * When a node is nested inside a table and the cursor is inside of the nested node.
	 * Nested node's toolbar is active. When table's menu opens, we provide table's config with
	 * __suppressAllToolbars set to true.
	 */
	__suppressAllToolbars?: boolean;

	/** Absolute offset of the toolbar */
	absoluteOffset?: PositionOffset;

	align?: AlignType;

	/** Class added to Toolbar wrapper */
	className?: string;

	/**
	 * Enable Popup component's focus trap
	 */
	focusTrap?: boolean;

	forcePlacement?: boolean;

	/**
	 * Override the DOM reference used to apply as the target for the
	 * floating toolbar, if the config matches.
	 *
	 * By default, it will find the DOM reference of the node from the
	 * head of the current selection.
	 */
	getDomRef?: (view: EditorView) => HTMLElement | undefined;

	/** aria-label added to role='radiogroup'element */
	groupLabel?: string;

	/** Toolbar height */
	height?: number;

	/** Items that will populate the Toolbar.
	 *
	 * See: `FloatingToolbarItem`
	 */
	items:
		| Array<FloatingToolbarItem<Command>>
		| ((node: Node) => Array<FloatingToolbarItem<Command>>);
	mediaAssistiveMessage?: string;

	/**
	 * nodeType or list of `nodeType`s this floating toolbar should be shown for.
	 **/
	nodeType: NodeType | NodeType[];

	/** Offset the position of the toolbar. */
	offset?: [number, number];

	onPositionCalculated?: (editorView: EditorView, nextPos: Position) => Position;

	preventPopupOverflow?: boolean;
	scrollable?: boolean;
	stick?: boolean;
	/** Used for the ariaLabel on the <Popup /> component */
	title: string;
	/** Can prevent the Toolbar from rendering */
	visible?: boolean;
	/** Toolbar width */
	width?: number;

	zIndex?: number;
}

export type FloatingToolbarHandler = (
	state: EditorState,
	intl: IntlShape,
	providerFactory: ProviderFactory,
	processedConfigs?: Array<FloatingToolbarConfig>,
) => FloatingToolbarConfig | undefined;
