import type React from 'react';

import { Node, NodeType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { IntlShape } from 'react-intl-next';

import type { EmojiId } from '@atlaskit/emoji/types';

import type { DispatchAnalyticsEvent } from '../analytics/types/dispatch-analytics-event';
import type { ProviderFactory } from '../provider-factory';
import type { PaletteColor } from '../ui-color/ColorPalette/Palettes/type';

import type { Command } from './command';
import type { MarkOptions, NodeOptions } from './copy-button';

export interface RenderOptionsPropsT<T> {
  hide: () => void;
  dispatchCommand: (command: T) => void;
}

export interface DropdownOptionT<T> {
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

export type DropdownOptions<T> =
  | Array<DropdownOptionT<T>>
  | {
      render: (props: RenderOptionsPropsT<T>) => React.ReactElement<any> | null;
      height: number;
      width: number;
    };

export interface SelectOption<T = unknown> {
  value: string;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  data?: T;
}

export type ButtonAppearance = 'subtle' | 'danger';
export type Icon = React.ComponentType<{ label: string }>;
export type RenderOptionsProps = RenderOptionsPropsT<Command>;

export type AlignType = 'left' | 'center' | 'right';

interface Position {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export type ConfirmDialogChildInfo = {
  id: string;
  name: string;
  amount: number;
};

export interface ConfirmDialogOptions {
  title?: string; // Defaults to "Are you sure?"
  message: string;
  okButtonLabel?: string; // Defaults to "OK"
  cancelButtonLabel?: string; // Defaults to "Cancel"
  isReferentialityDialog?: boolean; //option for extra content
  checkboxLabel?: string;
  messagePrefix?: string;
  getChildrenInfo?: () => ConfirmDialogChildInfo[];
  onConfirm?: (...args: any[]) => Command;
}

export type ConfirmationDialogProps = {
  onConfirm: (isCheck?: boolean) => void;
  onClose: () => void;
  options?: ConfirmDialogOptions;
  testId?: string;
};

export type FloatingToolbarCopyButton = {
  type: 'copy-button';
  items: Array<FloatingToolbarSeparator | MarkOptions | NodeOptions>;
  hidden?: boolean;
};

export type FloatingToolbarButton<T> = {
  id?: string;
  type: 'button';
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
  focusEditoronEnter?: boolean; //To focus the editor when button is pressed default value - false
};

export type FloatingToolbarInput<T> = {
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

export type FloatingToolbarCustom<T> = {
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
  ) => React.ComponentClass | React.SFC | React.ReactElement<any> | null;
  hidden?: boolean;
};

type FloatingToolbarSelectBase<T, V = SelectOption> = {
  id: string;
  type: 'select';
  selectType: 'list' | 'emoji' | 'date' | 'color';
  title?: string;
  options: V[];
  hidden?: boolean;
  hideExpandIcon?: boolean;
  defaultValue?: V | null;
  placeholder?: string;
  onChange: (selected: V) => T;
  filterOption?: ((option: V, rawInput: string) => boolean) | null;
};

export type FloatingToolbarListPicker<T> = FloatingToolbarSelectBase<T> & {
  selectType: 'list';
};

export type FloatingToolbarColorPicker<T> = FloatingToolbarSelectBase<
  T,
  PaletteColor
> & {
  selectType: 'color';
};

export type FloatingToolbarEmojiPicker<T> = FloatingToolbarSelectBase<
  T,
  EmojiId
> & {
  selectType: 'emoji';
  selected?: boolean;
  options: never[];
};

export type FloatingToolbarDatePicker<T> = FloatingToolbarSelectBase<
  T,
  number
> & {
  selectType: 'date';
  options: never[];
};

export type FloatingToolbarSelect<T> =
  | FloatingToolbarEmojiPicker<T>
  | FloatingToolbarColorPicker<T>
  | FloatingToolbarListPicker<T>
  | FloatingToolbarDatePicker<T>;

export type FloatingToolbarSeparator = {
  type: 'separator';
  hidden?: boolean;
};

export type FloatingToolbarDropdown<T> = {
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
export type FloatingToolbarFallbackItem<T> =
  | FloatingToolbarButton<T>
  | FloatingToolbarCopyButton
  | FloatingToolbarDropdown<T>
  | FloatingToolbarSelect<T>
  | FloatingToolbarInput<T>
  | FloatingToolbarSeparator;

export type FloatingToolbarItem<T> =
  | FloatingToolbarButton<T>
  | FloatingToolbarCopyButton
  | FloatingToolbarDropdown<T>
  | FloatingToolbarSelect<T>
  | FloatingToolbarInput<T>
  | FloatingToolbarCustom<T>
  | FloatingToolbarSeparator
  | FloatingToolbarExtensionsPlaceholder;

export interface FloatingToolbarConfig {
  title: string;
  /**
   * Override the DOM reference used to apply as the target for the
   * floating toolbar, if the config matches.
   *
   * By default, it will find the DOM reference of the node from the
   * head of the current selection.
   */
  getDomRef?: (view: EditorView) => HTMLElement | undefined;

  visible?: boolean;
  /**
   * nodeType or list of `nodeType`s this floating toolbar should be shown for.
   **/
  nodeType: NodeType | NodeType[];
  items:
    | Array<FloatingToolbarItem<Command>>
    | ((node: Node) => Array<FloatingToolbarItem<Command>>);
  align?: AlignType;
  className?: string;
  height?: number;
  width?: number;
  zIndex?: number;
  offset?: [number, number];
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
}

export type FloatingToolbarHandler = (
  state: EditorState,
  intl: IntlShape,
  providerFactory: ProviderFactory,
) => FloatingToolbarConfig | undefined;
