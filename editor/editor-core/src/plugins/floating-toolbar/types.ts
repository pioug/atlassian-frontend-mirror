import { InjectedIntl } from 'react-intl';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { NodeType, Node } from 'prosemirror-model';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { Position } from '@atlaskit/editor-common/src/ui/Popup/utils';

import { Command } from '../../types/command';
import { ButtonAppearance } from './ui/Button';
import { SelectOption } from './ui/Select';
import React from 'react';
import { DropdownOptions, RenderOptionsPropsT } from './ui/types';
import { DispatchAnalyticsEvent } from '../analytics/types/dispatch-analytics-event';
import { CardOptions } from '@atlaskit/editor-common';
import { PaletteColor } from '../../ui/ColorPalette/Palettes/type';

export type Icon = React.ComponentType<{ label: string }>;
export type RenderOptionsProps = RenderOptionsPropsT<Command>;

export type AlignType = 'left' | 'center' | 'right';

export interface ConfirmDialogOptions {
  title?: string; // Defaults to "Are you sure?"
  message: string;
  okButtonLabel?: string; // Defaults to "OK"
  cancelButtonLabel?: string; // Defaults to "Cancel"
}

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
  confirmDialog?: ConfirmDialogOptions;
  // For sending data over the mobile bridge
  metadata?: { [key: string]: string };
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
  defaultValue?: V;
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
  string
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
  id?: string;
  type: 'dropdown';
  title: string;
  icon?: Icon;
  options: DropdownOptions<T>;
  hidden?: boolean;
  hideExpandIcon?: boolean;
  disabled?: boolean;
  tooltip?: string;
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
  | FloatingToolbarDropdown<T>
  | FloatingToolbarSelect<T>
  | FloatingToolbarInput<T>
  | FloatingToolbarSeparator;

export type FloatingToolbarItem<T> =
  | FloatingToolbarButton<T>
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
  nodeType: NodeType | NodeType[];
  items:
    | Array<FloatingToolbarItem<Command>>
    | ((node: Node) => Array<FloatingToolbarItem<Command>>);
  align?: AlignType;
  className?: string;
  height?: number;
  width?: number;
  offset?: [number, number];
  forcePlacement?: boolean;
  onPositionCalculated?: (
    editorView: EditorView,
    nextPos: Position,
  ) => Position;
}

export type FloatingToolbarHandler = (
  state: EditorState,
  intl: InjectedIntl,
  providerFactory: ProviderFactory,
  cardOptions?: CardOptions,
) => FloatingToolbarConfig | undefined;
