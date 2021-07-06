import React from 'react';

import {
  UIAnalyticsEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { FieldProps } from '@atlaskit/form';

interface CommonProps extends WithAnalyticsEventsProps {
  /** Additional information to be included in the `context` of analytics events that come from button. */
  analyticsContext?: Record<string, any>;
  /** Accessibility label for the cancel action button. */
  cancelButtonLabel?: string;
  /** Accessibility label for the confirm action button, which saves the field value into `editValue`. */
  confirmButtonLabel?: string;
  /** The user input entered into the field during `editView`. This value is updated and saved by `onConfirm`. */
  defaultValue: any;
  /** Label above the input field that communicates what value should be entered. */
  label?: string;
  /** Displays an inline dialog with a message when the field input is invalid. This is handled by `react-final-form`. */
  validate?: (
    value: any,
    formState: {},
    fieldState: {},
  ) => string | void | Promise<string | void>;

  /**
   * Sets the view when the element blurs and loses focus (this can happen when a user clicks away).
   * When set to true, inline edit stays in `editView` when blurred. */
  keepEditViewOpenOnBlur?: boolean;
  /** Sets whether the confirm and cancel action buttons are displayed in the bottom right of the field. */
  hideActionButtons?: boolean;
  /** Determines whether the input value can be confirmed as empty. */
  isRequired?: boolean;
  /** Determines whether the `readView` has 100% width within its container, or whether it fits the content. */
  readViewFitContainerWidth?: boolean;
  /** Accessibility label for button, which is used to enter `editView` from keyboard. */
  editButtonLabel?: string;
  /** Exits `editView` and switches back to `readView`. This is called when the cancel action button (x) is clicked. */
  onCancel?: () => void;
  /**
   * Determines whether it begins in `editView` or `readView`. When set to true, `isEditing` begins as true and the inline edit
   * starts in `editView`.
   */
  startWithEditViewOpen?: boolean;
}

export interface ExtendedFieldProps<FieldValue> extends FieldProps<FieldValue> {
  errorMessage?: string | undefined;
}

export interface InlineEditProps<FieldValue> extends CommonProps {
  /** The component shown when user is editing (when the inline edit is not in `readView`). */
  editView: (
    fieldProps: ExtendedFieldProps<FieldValue>,
    ref: React.RefObject<any>,
  ) => React.ReactNode;
  /** Sets whether the component shows the `readView` or the `editView`. This is used to manage the state of the input in stateless inline edit. */
  isEditing?: boolean;
  /**
  Saves and confirms the value entered into the field. It exits `editView` and returns to `readView`.
   */
  onConfirm: (value: any, analyticsEvent: UIAnalyticsEvent) => void;
  /** Handler called when readView is clicked. */
  onEdit?: () => void;
  /** The component shown when not in `editView`. This is when the inline edit is read-only and not being edited.*/
  readView: () => React.ReactNode;
}

export interface InlineEditableTextfieldProps extends CommonProps {
  /** Sets height of the text field to compact. The top and bottom padding is decreased. */
  isCompact?: boolean;
  /**
   * Calls the `editView` handler. It confirms the changes.
   * The field value is passed as an argument to this function.
   */
  onConfirm: (value: string, analyticsEvent: UIAnalyticsEvent) => void;
  /** Text shown in `readView` when the field value is an empty string. */
  placeholder: string;
  /** A `testId` prop is provided for specific elements. This is a unique string that appears as a data attribute `data-testid` in the rendered code and serves as a hook for automated tests.
   */
  testId?: string;
}
