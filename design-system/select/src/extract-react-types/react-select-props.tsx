// this is to DOCUMENT/display the underlying react select props, for our atlaskit/select documentation

import { type FocusEventHandler, type KeyboardEventHandler, type ReactNode } from 'react';

interface FilterOptionOption<Option> {
  readonly label: string;
  readonly value: string;
  readonly data: Option;
}

import { type StylesConfig } from '../types';

import {
  type ActionMeta,
  type AriaLiveMessages,
  type FormatOptionLabelMeta,
  type GetOptionLabel,
  type GetOptionValue,
  type GroupBase,
  type InputActionMeta,
  type MenuPlacement,
  type MenuPosition,
  type OnChangeValue,
  type Options,
  type OptionsOrGroups,
  type PropsValue,
  type SelectComponentsConfig,
  type ThemeConfig,
} from 'react-select';

interface NativeReactSelectProps<
  Option = unknown,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> {
  /** Use this to provide a descriptive name for people who use assistive technology. */
  'aria-label'?: string;
  /** HTML ID of an element that should be used as the label (for assistive technology). */
  'aria-labelledby'?: string;
  /** Identifies the element (or elements) that describes the object. By default this is associated with the placeholder. The value in this prop is additional to the label, not replacing the default. Use this to give additional information, hints, or examples about how to complete a field (for assistive technology). */
  'aria-describedby'?: string;
  /** Used to set the priority with which assistive technology like screen readers should treat updates to live regions. The possible settings are?: off, polite (default) or assertive. */
  'aria-live'?: 'off' | 'polite' | 'assertive';
  /** Customize the messages used by the aria-live component. See react-select v5.4.0 documentation for full details. */
  ariaLiveMessages?: AriaLiveMessages<Option, IsMulti, Group>;
  /** Focus the control when it is mounted. */
  autoFocus?: boolean;
  /** Remove the currently focused option when the user presses backspace when Select isClearable or isMulti. */
  backspaceRemovesValue?: boolean;
  /** Remove focus from the input when the user selects an option (handy for dismissing the keyboard on touch devices). */
  blurInputOnSelect?: boolean;
  /** When the user reaches the top/bottom of the menu, prevent scroll on the scroll-parent.  */
  captureMenuScroll?: boolean;
  /** Sets a className attribute on the outer component. */
  className?: string;
  /*
    If provided, all inner components will be given a prefixed className attribute.
    This is useful when styling via CSS classes instead of the Styles API approach.
  */
  classNamePrefix?: string | null;
  /** Close the select menu when the user selects an option. */
  closeMenuOnSelect?: boolean;
  /*
    If `true`, close the select menu when the user scrolls the document/body.
    If a function, takes a standard javascript `ScrollEvent` you return a boolean:
    `true` => The menu closes
    `false` => The menu stays open
    This is useful when you have a scrollable modal and want to portal the menu out,
    but want to avoid graphical issues.
   */
  closeMenuOnScroll?: boolean | EventListener;
  /**
   This complex object includes all the compositional components that are used in `react-select`. If you wish to overwrite a component, pass in an object with the appropriate namespace.

   If you only wish to restyle a component, we recommend using the `styles` prop instead. For a list of the components that can be passed in, and the shape that will be passed to them, see [the components docs](/components).
   */
  components?: SelectComponentsConfig<Option, IsMulti, Group>;
  /** Whether the value of the select, e.g. SingleValue, should be displayed in the control. */
  controlShouldRenderValue?: boolean;
  /** Delimiter used to join multiple values into a single HTML Input value. */
  delimiter?: string;
  /** Clear all values when the user presses escape AND the menu is closed. */
  escapeClearsValue?: boolean;
  /** Custom method to filter whether an option should be displayed in the menu. */
  filterOption?:
    | ((option?: FilterOptionOption<Option>, inputValue?: string) => boolean)
    | null;
  /** Formats group labels in the menu as React components. [Custom label example](/components/select/examples#customization). */
  formatGroupLabel?: (group?: Group) => ReactNode;
  /** Formats option labels in the menu and control as React components. */
  formatOptionLabel?: (
    data?: Option,
    formatOptionLabelMeta?: FormatOptionLabelMeta<Option>,
  ) => ReactNode;
  /**
   Resolves option data to a string to be displayed as the label by components.

   Note: Failure to resolve to a string type can interfere with filtering and assistive technology support.
   */
  getOptionLabel?: GetOptionLabel<Option>;
  /** Resolves option data to a string to compare options and specify value attributes. */
  getOptionValue?: GetOptionValue<Option>;
  /** Hide the selected option from the menu. */
  hideSelectedOptions?: boolean;
  /** The ID to set on the SelectContainer component. */
  id?: string;
  /** The value of the search input. */
  inputValue?: string;
  /** The ID of the search input. */
  inputId?: string;
  /** Define an ID prefix for the select components. For example, `{your-id}-value`. */
  instanceId?: number | string;
  /** Sets whether the select value is clearable. */
  isClearable?: boolean;
  /** Sets whether the select is disabled. People won't be able to interact with the select and it won't appear in the focus order.
   * Wherever possible, prefer using validation and error messaging over disabled fields for a more accessible experience. */
  isDisabled?: boolean;
  /** Sets whether the select is in a state of loading (async). */
  isLoading?: boolean;
  /**
   Override the built-in logic to detect whether an option is disabled.
   */
  isOptionDisabled?: (
    option?: Option,
    selectValue?: Options<Option>,
  ) => boolean;
  /** Override the built-in logic to detect whether an option is selected. */
  isOptionSelected?: (
    option?: Option,
    selectValue?: Options<Option>,
  ) => boolean;
  /** Support multiple selected options. */
  isMulti?: IsMulti;
  /** Sets if the select direction is right-to-left.*/
  isRtl?: boolean;
  /** Sets whether to enable search functionality. */
  isSearchable?: boolean;
  /** Async text to display when options are loading. */
  loadingMessage?: (obj?: { inputValue?: string }) => ReactNode;
  /** Minimum height of the menu before flipping. */
  minMenuHeight?: number;
  /** Maximum height of the menu before scrolling. */
  maxMenuHeight?: number;
  /** Sets whether the menu is open. */
  menuIsOpen?: boolean;
  /** Default placement of the menu in relation to the control. 'auto' will flip when there isn't enough space below the control. */
  menuPlacement?: MenuPlacement;
  /** The CSS position value of the menu, when "fixed" extra layout management is required. */
  menuPosition?: MenuPosition;
  /** Whether the menu should use a portal, and where it should attach. */
  menuPortalTarget?: HTMLElement | null;
  /** Whether to block scroll events when the menu is open. */
  menuShouldBlockScroll?: boolean;
  /** Whether the menu should be scrolled into view when it opens. */
  menuShouldScrollIntoView?: boolean;
  /** Name of the HTML Input (optional - without this, no input will be rendered). */
  name?: string;
  /** Text to display when there are no options. */
  noOptionsMessage?: (obj?: { inputValue?: string }) => ReactNode;
  /** Handle blur events on the control. */
  onBlur?: FocusEventHandler<HTMLInputElement>;
  /** Handle change events on the select. */
  onChange?: (
    newValue?: OnChangeValue<Option, IsMulti>,
    actionMeta?: ActionMeta<Option>,
  ) => void;
  /** Handle focus events on the control. */
  onFocus?: FocusEventHandler<HTMLInputElement>;
  /** Handle change events on the input. */
  onInputChange?: (newValue?: string, actionMeta?: InputActionMeta) => void;
  /** Handle key down events on the select. */
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  /** Handle the menu opening. */
  onMenuOpen?: () => void;
  /** Handle the menu closing. */
  onMenuClose?: () => void;
  /** Sent when the user scrolls to the top of the menu. */
  onMenuScrollToTop?: (event?: WheelEvent | TouchEvent) => void;
  /** Sent when the user scrolls to the bottom of the menu. */
  onMenuScrollToBottom?: (event?: WheelEvent | TouchEvent) => void;
  /** Allows control of whether the menu is opened when the select is focused. */
  openMenuOnFocus?: boolean;
  /** Allows control of whether the menu is opened when the select is clicked. */
  openMenuOnClick?: boolean;
  /** Array of options that populate the select menu. */
  options?: OptionsOrGroups<Option, Group>;
  /** Number of options to jump in menu when page{up|down} keys are used. */
  pageSize?: number;
  /** Placeholder for the select value. */
  placeholder?: ReactNode;
  /** Status to relay to screen readers. */
  screenReaderStatus?: (obj?: { count?: number }) => string;
  /** Style modifier methods. */
  styles?: StylesConfig;
  /** Theme modifier method. */
  theme?: ThemeConfig;
  /** Sets the tabIndex attribute on the input. */
  tabIndex?: number;
  /** Select the currently focused option when the user presses tab. */
  tabSelectsValue?: boolean;
  /** The value of the select; reflected by the selected option. */
  value?: PropsValue<Option>;
  /** Sets the form attribute on the input. */
  form?: string;
  /** Marks the value-holding input as required for form validation. */
  required?: boolean;
}
export default function ertHackForSelect(_: NativeReactSelectProps) {}
