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
	type: 'overflow-dropdown-heading';
	title: string;
};

type OverflowDropdownCustom<T extends Object> = {
	type: 'custom';
	fallback: Array<FloatingToolbarFallbackItem<T>>;
	render: (
		view?: EditorView,
		dropdownOption?: Omit<DropdownMenuItemProps, 'item'>,
	) => React.ReactNode;
	hidden?: boolean;
};

export type OverflowDropdownOption<T extends Object> = DropdownOptionT<T> & { rank?: number };

export type FloatingToolbarOverflowDropdownOptions<T extends Object> = Array<
	| OverflowDropdownOption<T>
	| FloatingToolbarSeparator
	| OverflowDropdownHeading
	| OverflowDropdownCustom<T>
>;

export type FloatingToolbarOverflowDropdown<T extends Object> = {
	type: 'overflow-dropdown';
	options: FloatingToolbarOverflowDropdownOptions<T>;
	testId?: string;
	id?: string;
	hidden?: boolean;
	disabled?: boolean;
	tooltip?: string;
	dropdownWidth?: number;
	showSelected?: boolean;
	// A prop to align the dropdown with the floating toolbar instead of the toolbar item
	alignDropdownWithToolbar?: boolean;
	supportsViewMode?: boolean; // TODO: MODES-3950 - Clean up this floating toolbar view mode logic
	onClick?: () => void;
};

export interface RenderOptionsPropsT<T extends Object> {
	hide: () => void;
	dispatchCommand: (command: T) => void;
}

export interface DropdownOptionT<T extends Object> {
	id?: string;
	title: string;
	onClick: T;
	onMouseDown?: T;
	onMouseOver?: T;
	onMouseEnter?: T;
	onMouseLeave?: T;
	onMouseOut?: T;
	onFocus?: T;
	onBlur?: T;
	selected?: boolean;
	disabled?: boolean;
	hidden?: boolean;
	domItemOptions?: { type: typeOption };
	testId?: string;
	tooltip?: string;
	elemAfter?: React.ReactNode;
	icon?: React.ReactNode;
}

export type typeOption =
	/** Dropdown menu item type
	 * @default 'item'
	 */
	'item' | 'item-checkbox';

export type DropdownOptions<T extends Object> =
	| Array<DropdownOptionT<T>>
	| {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			render: (props: RenderOptionsPropsT<T>) => React.ReactElement<any> | null;
			height: number;
			width: number;
	  };

export interface SelectOption<T extends Object = Object> {
	value: string;
	label: string;
	selected?: boolean;
	disabled?: boolean;
	hidden?: boolean;
	data?: T;
}

export type ButtonAppearance = 'subtle' | 'danger';
export type Icon = React.ComponentType<React.PropsWithChildren<{ label: string }>>;
export type RenderOptionsProps = RenderOptionsPropsT<Command>;

export type AlignType = 'left' | 'center' | 'right';

interface Position {
	top?: number;
	right?: number;
	bottom?: number;
	left?: number;
}

type PositionOffset = Position;

export type ConfirmDialogChildInfo = {
	id: string;
	name: string | null;
	amount: number;
};

export interface ConfirmDialogOptions {
	title?: string; // Defaults to "Are you sure?"
	message: string;
	okButtonLabel?: string; // Defaults to "OK"
	cancelButtonLabel?: string; // Defaults to "Cancel"
	isReferentialityDialog?: boolean; // option for extra content
	checkboxLabel?: string;
	messagePrefix?: string;
	getChildrenInfo?: () => ConfirmDialogChildInfo[];
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onConfirm?: (...args: any[]) => Command;
}

export type ConfirmationDialogProps = {
	onConfirm: (isCheck?: boolean) => void;
	/**
	 * onClose is called every time when the dialog is closed.
	 * Either clicking on 'Confirm' button or 'Cancel' button,
	 * which means it is being called after onConfirm, or by itself when clicking 'Cancel' button.
	 */
	onClose: () => void;
	options?: ConfirmDialogOptions;
	testId?: string;
};

export type FloatingToolbarButtonSpotlightConfig = {
	isSpotlightOpen: boolean;
	pulse?: boolean;
	onTargetClick?: () => void;
	spotlightCardOptions: React.ComponentProps<typeof SpotlightCard> & { placement?: Placement };
};

export type FloatingToolbarCopyButton = {
	type: 'copy-button';
	items: Array<FloatingToolbarSeparator | MarkOptions | NodeOptions>;
	hidden?: boolean;
	supportsViewMode?: boolean; // TODO: MODES-3950 - Clean up this floating toolbar view mode logic
};

export type FloatingToolbarButton<T extends Object> = {
	id?: string;
	type: 'button';
	isRadioButton?: boolean;
	title: string;
	onClick: T;
	showTitle?: boolean;
	onMouseEnter?: T;
	onMouseLeave?: T;
	onFocus?: T;
	onBlur?: T;
	onMount?: () => void;
	onUnmount?: () => void;
	icon?: Icon;
	iconFallback?: Icon;
	iconAfter?: Icon;
	selected?: boolean;
	disabled?: boolean;
	hidden?: boolean;
	appearance?: ButtonAppearance;
	href?: string;
	target?: string;
	className?: string;
	tooltipContent?: TooltipProps['content'];
	testId?: string;
	interactionName?: string;
	hideTooltipOnClick?: boolean;
	confirmDialog?: ConfirmDialogOptions | (() => ConfirmDialogOptions);
	// For sending data over the mobile bridge
	metadata?: { [key: string]: string };
	ariaHasPopup?: boolean | 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid' | undefined;
	tabIndex?: number | null | undefined;
	focusEditoronEnter?: boolean; // To focus the editor when button is pressed default value - false
	supportsViewMode?: boolean; // TODO: MODES-3950 - Clean up this floating toolbar view mode logic
	/** If true, the component will have pulse onboarding effect around it. */
	pulse?: boolean;
	spotlightConfig?: FloatingToolbarButtonSpotlightConfig;
};

export type FloatingToolbarInput<T extends Object> = {
	id: string;
	type: 'input';
	title?: string;
	description?: string;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onSubmit: (...args: any[]) => T;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onBlur: (...args: any[]) => T;
	defaultValue?: string;
	placeholder?: string;
	hidden?: boolean;
};

export type FloatingToolbarCustom<T extends Object> = {
	type: 'custom';
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
	// No superset of all these types yet
	render: (
		view?: EditorView,
		idx?: number,
		dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
	) => React.ReactNode;
	hidden?: boolean;
	supportsViewMode?: boolean; // TODO: MODES-3950 - Clean up this floating toolbar view mode logic
};

type FloatingToolbarSelectBase<T extends Object, V = SelectOption> = {
	id: string;
	type: 'select';
	selectType: 'list' | 'emoji' | 'date' | 'color';
	title?: string;
	isAriaExpanded?: boolean;
	options: V[];
	hidden?: boolean;
	hideExpandIcon?: boolean;
	defaultValue?: V | null;
	placeholder?: string;
	returnEscToButton?: boolean;
	onChange: (selected: V) => T;
	filterOption?: ((option: V, rawInput: string) => boolean) | null;
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
	selectType: 'emoji';
	selected?: boolean;
	options: never[];
};

export type FloatingToolbarDatePicker<T extends Object> = FloatingToolbarSelectBase<T, number> & {
	selectType: 'date';
	options: never[];
};

export type FloatingToolbarSelect<T extends Object> =
	| FloatingToolbarEmojiPicker<T>
	| FloatingToolbarColorPicker<T>
	| FloatingToolbarListPicker<T>
	| FloatingToolbarDatePicker<T>;

export type FloatingToolbarSeparator = {
	type: 'separator';
	hidden?: boolean;
	fullHeight?: boolean;
	supportsViewMode?: boolean; // TODO: MODES-3950 - Clean up this floating toolbar view mode logic
};

export type ExtensionDropdownOptions = () => DropdownOptions<Function>;

export type FloatingToolbarDropdown<T extends Object> = {
	testId?: string;
	id?: string;
	type: 'dropdown';
	title: string;
	icon?: Icon;
	/**
	 * Places an icon before the title as a representation
	 */
	iconBefore?: Icon;
	options: DropdownOptions<T> | ExtensionDropdownOptions;
	hidden?: boolean;
	hideExpandIcon?: boolean;
	disabled?: boolean;
	tooltip?: string;
	dropdownWidth?: number;
	showSelected?: boolean;
	// A prop to align the dropdown with the floating toolbar instead of the toolbar item
	alignDropdownWithToolbar?: boolean;
	onToggle?: (state: EditorState, dispatch: CommandDispatch | undefined) => boolean;
	footer?: React.ReactNode;
	/** If true, the component will have pulse onboarding effect around it. */
	pulse?: boolean;
	onMount?: () => void;
	onClick?: () => void;
	shouldFitContainer?: boolean;
};

type FloatingToolbarExtensionsPlaceholder = {
	type: 'extensions-placeholder';
	hidden?: boolean;
	separator?: 'start' | 'end' | 'both';
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
	/** Used for the ariaLabel on the <Popup /> component */
	title: string;

	/**
	 * Override the DOM reference used to apply as the target for the
	 * floating toolbar, if the config matches.
	 *
	 * By default, it will find the DOM reference of the node from the
	 * head of the current selection.
	 */
	getDomRef?: (view: EditorView) => HTMLElement | undefined;

	/** Can prevent the Toolbar from rendering */
	visible?: boolean;

	/**
	 * nodeType or list of `nodeType`s this floating toolbar should be shown for.
	 **/
	nodeType: NodeType | NodeType[];

	/** Items that will populate the Toolbar.
	 *
	 * See: `FloatingToolbarItem`
	 */
	items:
		| Array<FloatingToolbarItem<Command>>
		| ((node: Node) => Array<FloatingToolbarItem<Command>>);

	/** aria-label added to role='radiogroup'element */
	groupLabel?: string;

	align?: AlignType;

	/** Class added to Toolbar wrapper */
	className?: string;

	/** Toolbar height */
	height?: number;

	/** Toolbar width */
	width?: number;
	zIndex?: number;

	/** Offset the position of the toolbar. */
	offset?: [number, number];

	/** Absolute offset of the toolbar */
	absoluteOffset?: PositionOffset;

	forcePlacement?: boolean;

	onPositionCalculated?: (editorView: EditorView, nextPos: Position) => Position;
	scrollable?: boolean;
	/**
	 * Enable Popup component's focus trap
	 */
	focusTrap?: boolean;
	preventPopupOverflow?: boolean;
	mediaAssistiveMessage?: string;
	stick?: boolean;

	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
	/**
	 * @deprecated Unused property to support collapse/expand feature for editor controls
	 * @see clean up ticket ED-26803
	 */
	forceStaticToolbar?: boolean;
	/**
	 * For internal use only, we will be depricating this API soon.
	 * If any config has __suppressAllToolbars set to true, no floating toolbar will be rendered.
	 * Use case:
	 * When a node is nested inside a table and the cursor is inside of the nested node.
	 * Nested node's toolbar is active. When table's menu opens, we provide table's config with
	 * __suppressAllToolbars set to true.
	 */
	__suppressAllToolbars?: boolean;
}

export type FloatingToolbarHandler = (
	state: EditorState,
	intl: IntlShape,
	providerFactory: ProviderFactory,
	processedConfigs?: Array<FloatingToolbarConfig>,
) => FloatingToolbarConfig | undefined;
