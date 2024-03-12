import type React from 'react';

import type { IntlShape } from 'react-intl-next';

import type { Node, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { EmojiId } from '@atlaskit/emoji/types';

import type { DispatchAnalyticsEvent } from '../analytics/types/dispatch-analytics-event';
import type { ProviderFactory } from '../provider-factory';
import type { PaletteColor } from '../ui-color/ColorPalette/Palettes/type';

import type { Command, CommandDispatch } from './command';
import type { MarkOptions, NodeOptions } from './copy-button';

export interface RenderOptionsPropsT<T extends {}> {
  hide: () => void;
  dispatchCommand: (command: T) => void;
}

export interface DropdownOptionT<T extends {}> {
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
  testId?: string;
  tooltip?: string;
  elemAfter?: React.ReactNode;
}

export type DropdownOptions<T extends {}> =
  | Array<DropdownOptionT<T>>
  | {
      render: (props: RenderOptionsPropsT<T>) => React.ReactElement<any> | null;
      height: number;
      width: number;
    };

export interface SelectOption<T extends {} = {}> {
  value: string;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  data?: T;
}

export type ButtonAppearance = 'subtle' | 'danger';
export type Icon = React.ComponentType<
  React.PropsWithChildren<{ label: string }>
>;
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

export type FloatingToolbarCopyButton = {
  type: 'copy-button';
  items: Array<FloatingToolbarSeparator | MarkOptions | NodeOptions>;
  hidden?: boolean;
};

export type FloatingToolbarButton<T extends {}> = {
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
  icon?: Icon;
  selected?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  appearance?: ButtonAppearance;
  href?: string;
  target?: string;
  className?: string;
  tooltipContent?: React.ReactNode;
  testId?: string;
  hideTooltipOnClick?: boolean;
  confirmDialog?: ConfirmDialogOptions | (() => ConfirmDialogOptions);
  // For sending data over the mobile bridge
  metadata?: { [key: string]: string };
  ariaHasPopup?:
    | boolean
    | 'dialog'
    | 'menu'
    | 'listbox'
    | 'tree'
    | 'grid'
    | undefined;
  tabIndex?: number | null | undefined;
  focusEditoronEnter?: boolean; // To focus the editor when button is pressed default value - false
  supportsViewMode?: boolean; // TODO: MODES-3950 Clean up this floating toolbar view mode logic
};

export type FloatingToolbarInput<T extends {}> = {
  id: string;
  type: 'input';
  title?: string;
  description?: string;
  onSubmit: (...args: any[]) => T;
  onBlur: (...args: any[]) => T;
  defaultValue?: string;
  placeholder?: string;
  hidden?: boolean;
};

export type FloatingToolbarCustom<T extends {}> = {
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
  ) =>
    | React.ComponentType<React.PropsWithChildren<unknown>>
    | React.ReactElement<any>
    | null;
  hidden?: boolean;
};

type FloatingToolbarSelectBase<T extends {}, V = SelectOption> = {
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
  onChange: (selected: V) => T;
  filterOption?: ((option: V, rawInput: string) => boolean) | null;
};

export type FloatingToolbarListPicker<T extends {}> =
  FloatingToolbarSelectBase<T> & {
    selectType: 'list';
  };

export type FloatingToolbarColorPicker<T extends {}> =
  FloatingToolbarSelectBase<T, PaletteColor> & {
    selectType: 'color';
  };

export type FloatingToolbarEmojiPicker<T extends {}> =
  FloatingToolbarSelectBase<T, EmojiId> & {
    selectType: 'emoji';
    selected?: boolean;
    options: never[];
  };

export type FloatingToolbarDatePicker<T extends {}> = FloatingToolbarSelectBase<
  T,
  number
> & {
  selectType: 'date';
  options: never[];
};

export type FloatingToolbarSelect<T extends {}> =
  | FloatingToolbarEmojiPicker<T>
  | FloatingToolbarColorPicker<T>
  | FloatingToolbarListPicker<T>
  | FloatingToolbarDatePicker<T>;

export type FloatingToolbarSeparator = {
  type: 'separator';
  hidden?: boolean;
};

export type FloatingToolbarDropdown<T extends {}> = {
  testId?: string;
  id?: string;
  type: 'dropdown';
  title: string;
  icon?: Icon;
  options: DropdownOptions<T>;
  hidden?: boolean;
  hideExpandIcon?: boolean;
  disabled?: boolean;
  tooltip?: string;
  dropdownWidth?: number;
  showSelected?: boolean;
  // A prop to align the dropdown with the floating toolbar instead of the toolbar item
  alignDropdownWithToolbar?: boolean;
  onToggle?: (
    state: EditorState,
    dispatch: CommandDispatch | undefined,
  ) => boolean;
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
export type FloatingToolbarFallbackItem<T extends {}> =
  | FloatingToolbarButton<T>
  | FloatingToolbarCopyButton
  | FloatingToolbarDropdown<T>
  | FloatingToolbarSelect<T>
  | FloatingToolbarInput<T>
  | FloatingToolbarSeparator;

export type FloatingToolbarItem<T extends {}> =
  | FloatingToolbarButton<T>
  | FloatingToolbarCopyButton
  | FloatingToolbarDropdown<T>
  | FloatingToolbarSelect<T>
  | FloatingToolbarInput<T>
  | FloatingToolbarCustom<T>
  | FloatingToolbarSeparator
  | FloatingToolbarExtensionsPlaceholder;

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

  onPositionCalculated?: (
    editorView: EditorView,
    nextPos: Position,
  ) => Position;
  scrollable?: boolean;
  /**
   * Enable Popup component's focus trap
   */
  focusTrap?: boolean;
  preventPopupOverflow?: boolean;
  mediaAssistiveMessage?: string;
}

export type FloatingToolbarHandler = (
  state: EditorState,
  intl: IntlShape,
  providerFactory: ProviderFactory,
) => FloatingToolbarConfig | undefined;
