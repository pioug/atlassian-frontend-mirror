import React, { type AriaAttributes, ReactNode } from 'react';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { Placement } from '@atlaskit/popper';

import { EmailValidator } from './components/emailValidation';
import { StylesConfig } from '@atlaskit/select';
import { BaseUserPickerWithoutAnalytics } from './components/BaseUserPicker';

export type UserPickerProps = WithAnalyticsEventsProps & {
  /**
   * Used to configure additional information regarding where the
   * user picker has been mounted.
   *
   * The purpose is to give more context as to where user picker events
   * are being fired from, as the current data may not uniquely identify
   * which field is the source.
   *
   * The value will be passed as a data attribute for analytics.
   * Examples include "assignee", "watchers" and "share".
   *
   * A second usage for the fieldId is for server side rendering (SSR) where it must be a unique id per UserPicker
   * instance contained in the serialized SSR content. E.g. a SPA page rendered through SSR that has multiple user pickers.
   *
   * fieldId can be set to null if the integrator is not listening
   * for the analytic events or does not care about SSR.
   */
  fieldId: string | null;
  /** List of users or teams to be used as options by the user picker. */
  options?: OptionData[];
  /** Width of the user picker field. It can be the amount of pixels as numbers or a string with the percentage. */
  width?: number | string;
  /** Sets the minimum width for the menu. If not set, menu will always have the same width of the field. */
  menuMinWidth?: number;
  /** Sets max height of the user picker. If not set, the height will grow based on number of picked users. */
  maxPickerHeight?: number;
  /** Sets the background color to be the same color as a textfield (Atlaskit N10) */
  textFieldBackgroundColor?: boolean;
  /**
   * Function used to load options asynchronously.
   * accepts two optional params:
   * searchText?: optional text to filter results
   * sessionId?: user picker session identifier, used to track success metric for users providers
   */
  loadOptions?: LoadOptions;
  /**
   * Function to generate the error message when there's a failure executing the loadOptions prop.
   * If not provided, will default to a default error message.
   */
  loadOptionsErrorMessage?: (value: { inputValue: string }) => React.ReactNode;
  /**
   * Function used to load user source if they are an external user.
   * accepts two params:
   * accountId: account ID of the user to lookup sources
   * signal: AbortController signal to abort the request if the tooltip is closed
   */
  loadUserSource?: LoadUserSource;
  /** Callback for value change events fired whenever a selection is inserted or removed. */
  onChange?: OnChange;
  /** To enable multi user picker. */
  isMulti?: boolean;
  /** Input text value. */
  search?: string;
  /** Anchor for the user picker popup. */
  anchor?: React.ComponentType<any>;
  /** Controls if user picker menu is open or not. If not provided, UserPicker will control menu state internally. */
  open?: boolean;
  /** Show the loading indicator. */
  isLoading?: boolean;
  /** Callback for search input text change events. */
  onInputChange?: OnInputChange;
  /** Callback for when a selection is made. */
  onSelection?: OnOption;
  /** Callback for when the field gains focus. */
  onFocus?: OnPicker;
  /** Callback for when the field loses focus. */
  onBlur?: OnPicker;
  /** Callback for when the value/s in the picker is cleared. */
  onClear?: OnPicker;
  /** Callback that is triggered when popup picker is opened */
  onOpen?: OnPicker;
  /** Callback that is triggered when popup picker is closed */
  onClose?: OnPicker;
  /** Callback that is trigger on key down in text input */
  onKeyDown?: (event: React.KeyboardEvent) => void;
  /** Appearance of the user picker. */
  appearance?: Appearance;
  /** Display the picker with a subtle style. */
  subtle?: boolean;
  /** Display the picker with no border. */
  noBorder?: boolean;
  /**
   * You may pass through a `StylesConfig` to be merged with the picker default styles if a custom override is required.
   * Consider using noBorder, subtle before customising further.
   * See https://react-select.com/styles
   */
  styles?: StylesConfig;
  /** Default value for the field to be used on initial render.
   * `defaultValue` differs from `value` in that it sets the initial value then leaves the component 'uncontrolled'
   * whereas setting the `value` prop delegates responsibility for maintaining the value to the caller
   * (i.e. listen to `onChange`) */
  defaultValue?: DefaultValue;
  /** Placeholder text to be shown when there is no value in the field. */
  placeholder?: React.ReactNode;
  /** Placeholder avatar style - defaults to person */
  placeholderAvatar?: 'person' | 'team';
  /** Message to encourage the user to add more items to user picker. */
  addMoreMessage?: string;
  /** Message to be shown when the menu is open but no options are provided.
   * If message is null, no message will be displayed.
   * If message is undefined, default message will be displayed.
   */
  noOptionsMessage?:
    | ((value: { inputValue: string }) => string | null | React.ReactNode)
    | null
    | React.ReactNode;
  /** Footer to be displayed in MenuList */
  footer?: React.ReactNode;
  /** Controls if the user picker has a value or not. If not provided, UserPicker will control the value internally. */
  value?: Value;
  /** Disable all interactions with the picker, putting it in a read-only state. */
  isDisabled?: boolean;
  /** Display a remove button on the single picker. True by default. */
  isClearable?: boolean;
  /** Optional tooltip to display on hover over the clear indicator. */
  clearValueLabel?: string;
  /** React-select prop for controlling menu position */
  menuPosition?: 'absolute' | 'fixed';
  /** React-select prop for blocking menu scroll on container when menu scrolled to the very top/bottom of the menu */
  captureMenuScroll?: boolean;
  /** Whether the menu should use a portal, and where it should attach. */
  menuPortalTarget?: HTMLElement;
  /** Whether the user is allowed to enter emails as a value. */
  allowEmail?: boolean;
  /** Setting this with allowEmail will cause the picker to constantly show an email option at the bottom for the supplied email domain/an email the user types in */
  suggestEmailsForDomain?: string;
  /** Email option label */
  emailLabel?: string;
  /** Whether to disable interaction with the input */
  disableInput?: boolean;
  /** Override default email validation function. */
  isValidEmail?: EmailValidator;
  /** Override the internal behaviour to automatically focus the control when the picker is open */
  autoFocus?: boolean;
  /** The maximum number options to be displayed in the dropdown menu during any state of search. The value should be non-negative. */
  maxOptions?: number;
  /** Allows clicking on a label with the same id to open user picker. */
  inputId?: string;
  /** Whether to close menu on scroll */
  closeMenuOnScroll?: boolean | EventListener;
  /** Whether to block scrolling actions */
  menuShouldBlockScroll?: boolean;
  /** Accessibility: Uses to set aria-label of the input*/
  ariaLabel?: string;
  /** Accessibility: Identifies the element (or elements) that labels the current element.*/
  ariaLabelledBy?: string;
  /** Accessibility: Used to set the priority with which screen reader should treat updates to live regions.*/
  ariaLive?: 'polite' | 'off' | 'assertive';
  /** Name to use for input element. */
  name?: string;
  /** Header to be displayed in MenuList */
  header?: React.ReactNode;
  /** Accessibility: A field to dictate if this is a mandatory field in the form. */
  required?: boolean;
  /**
   * Enables workaround for when <Select /> is nested inside <Draggable /> from react-beautiful-dnd
   * This relationship prevents the dropdown menu from opening because of bugs in the default focus state and clicking in a particular area of <Select />
   * Context: https://hello.atlassian.net/wiki/spaces/~989411314/pages/2861097485/Investigation+Notes+for+atlaskit+select+react-beautiful-dnd#Temporary-Solution
   */
  UNSAFE_hasDraggableParentComponent?: boolean;
  /** Override the internal behaviour of default menu open on focus and applicable for single value select  */
  openMenuOnClick?: boolean;
};

export type PopupUserPickerProps = UserPickerProps & {
  /** Whether to use the popup version of the single picker */
  target: Target;
  /** Optional title assigned to popup picker */
  popupTitle?: string;
  /**
   * The boundary element that the popup will check for overflow.
   * Defaults to `"viewport"` which are parent scroll containers,
   * but can be set to any element.
   */
  boundariesElement?: BoundariesElement;
  /**
   * Distance the popup should be offset from the reference in the format of [along, away] (units in px).
   */
  offset?: [number, number];
  /**
   * Placement of where the popup should be displayed relative to the trigger element.
   * Defaults to `"auto"`.
   */
  placement?: Placement;
  /**
   * The root boundary that the popup will check for overflow.
   * Defaults to `"viewport"` but can be set to `"document"`.
   * See `@atlaskit/popper` for further details.
   */
  rootBoundary?: RootBoundary;
  /**
   * Allows the dropdown menu to be placed on the opposite side of its trigger if it does not
   * fit in the viewport.
   */
  shouldFlip?: boolean;
};

export type AriaAttributesType =
  | AriaAttributes['aria-labelledby']
  | AriaAttributes['aria-describedby'];

export type BoundariesElement =
  | 'scrollParent'
  | 'window'
  | 'viewport'
  | HTMLElement;

export type RootBoundary = 'viewport' | 'document';

export type UserPickerState = {
  options: OptionData[];
  value?: AtlaskitSelectValue;
  isDefaultSet: boolean;
  inflightRequest: number;
  count: number;
  hoveringClearIndicator: boolean;
  menuIsOpen: boolean;
  inputValue: string;
  resolving: boolean;
  showError: boolean;
  initialFocusHandled: boolean;
};

export interface HighlightRange {
  start: number;
  end: number;
}

export interface UserHighlight {
  name: HighlightRange[];
  publicName: HighlightRange[];
}

export interface TeamHighlight {
  name: HighlightRange[];
  description?: HighlightRange[];
}

export interface GroupHighlight {
  name: HighlightRange[];
}

export interface CustomHighlight {
  name: HighlightRange[];
}

export interface OptionData {
  avatarUrl?: any;
  fixed?: boolean;
  id: string;
  isDisabled?: boolean;
  lozenge?: string | LozengeProps | ReactNode;
  name: string;
  type?: 'user' | 'team' | 'email' | 'group' | 'custom' | 'external_user';
  tooltip?: string;
  title?: string;
}

export const UserType = 'user';
export const ExternalUserType = 'external_user';

export type UserSource =
  | 'google'
  | 'slack'
  | 'microsoft'
  | 'jira'
  | 'confluence'
  | 'other-atlassian';

export interface ExternalUser extends User {
  externalUserType?: 'crossSite' | 'thirdParty';
  requiresSourceHydration?: boolean;
  sources: UserSource[];
  hasProductAccess?: boolean;
}

export interface User extends OptionData {
  avatarUrl?: string;
  publicName?: string;
  highlight?: UserHighlight;
  byline?: string;
  type?: 'user' | 'external_user';
  email?: string;
  isExternal?: boolean;
  title?: string;
}

export type LozengeColor =
  | 'default'
  | 'success'
  | 'removed'
  | 'inprogress'
  | 'new'
  | 'moved';

export interface LozengeProps {
  text: string;
  tooltip?: string;
  appearance?: LozengeColor;
  isBold?: boolean;
}
export const TeamType = 'team';

export interface TeamMember {
  name: string;
  id: string;
}

export interface Team extends OptionData {
  avatarUrl?: string;
  description?: string;
  memberCount?: number;
  members?: TeamMember[];
  includesYou?: boolean;
  highlight?: TeamHighlight;
  type: 'team';
  byline?: string;
}

export const GroupType = 'group';

export interface Group extends OptionData {
  highlight?: GroupHighlight;
  type: 'group';
}

/*
 * Custom type created to facilitate experimentation
 * without affecting other Option types
 */
export interface Custom extends OptionData {
  avatarUrl?: string;
  byline?: string;
  highlight?: CustomHighlight;
  analyticsType?: string;
  type: 'custom';
}

export type Value = OptionData | OptionData[] | null | undefined;

export type DefaultValue = Value | OptionIdentifier | OptionIdentifier[];
export type OptionIdentifier = Pick<OptionData, 'id' | 'type' | 'isDisabled'>;

export const EmailType = 'email';
export const CustomType = 'custom';

export interface Email extends OptionData {
  type: 'email';
  suggestion?: boolean;
}

export type ActionTypes =
  | 'select-option'
  | 'deselect-option'
  | 'remove-value'
  | 'pop-value'
  | 'set-value'
  | 'clear'
  | 'create-option';

export type OnChange = (value: Value, action: ActionTypes) => void;

export type OnInputChange = (query?: string, sessionId?: string) => void;

export type OnPicker = (sessionId?: string) => void;

export type OnOption = (
  value: Value,
  sessionId?: string,
  baseUserPicker?: BaseUserPickerWithoutAnalytics,
) => void;

export type Option<Data = OptionData> = {
  data: Data;
  isDisabled?: boolean;
  label: string;
  value: string;
};

export interface UserSourceResult {
  sourceId: string;
  sourceType: UserSource;
}
export interface LoadUserSource {
  (accountId: string, signal?: AbortSignal): Promise<UserSourceResult[]>;
}

export interface LoadOptions {
  (searchText?: string, sessionId?: string):
    | Promisable<OptionData | OptionData[]>
    | Iterable<
        Promisable<OptionData[] | OptionData> | OptionData | OptionData[]
      >;
}

export type Promisable<T> = T | PromiseLike<T>;

export type InputActionTypes =
  | 'set-value'
  | 'input-change'
  | 'input-blur'
  | 'menu-close';

export type AtlaskitSelectValue = Option | Array<Option> | null | undefined;

export type AtlasKitSelectChange = (
  value: AtlaskitSelectValue,
  extraInfo: {
    removedValue?: Option;
    option?: Option;
    action: ActionTypes;
  },
) => void;

export type Appearance = 'normal' | 'compact';

export type Target = (options: { ref: any; isOpen: boolean }) => ReactNode;
