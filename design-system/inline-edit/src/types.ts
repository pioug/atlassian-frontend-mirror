import React from 'react';

import {
  UIAnalyticsEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { FieldProps } from '@atlaskit/form';

interface CommonProps extends WithAnalyticsEventsProps {
  /** Label above the input. */
  label?: string;
  /** Validation function handled by final-form. */
  validate?: (
    value: any,
    formState: {},
    fieldState: {},
  ) => string | void | Promise<string | void>;

  /** Set whether onConfirm should be called on blur. */
  keepEditViewOpenOnBlur?: boolean;
  /** Sets whether the checkmark and cross are displayed in the bottom right of the field. */
  hideActionButtons?: boolean;
  /** Determines whether the input value can be confirmed as empty. */
  isRequired?: boolean;
  /** Determines whether the read view has 100% width within its container, or whether it fits the content. */
  readViewFitContainerWidth?: boolean;
  /** Accessibility label for button which is used to enter edit view from keyboard. */
  editButtonLabel?: string;
  /** Accessibility label for the confirm action button. */
  confirmButtonLabel?: string;
  /** Accessibility label for the cancel action button. */
  cancelButtonLabel?: string;
  /** Handler called when checkmark is clicked. */
  onCancel?: () => void;

  /** Additional information to be included in the `context` of analytics events that come from button */
  analyticsContext?: Record<string, any>;
}

export interface ExtendedFieldProps<FieldValue> extends FieldProps<FieldValue> {
  errorMessage?: string | undefined;
}

export interface InlineEditProps<FieldValue> extends CommonProps {
  /** Component to be shown when not in edit view. */
  readView: () => React.ReactNode;
  /** Component to be shown when editing. */
  editView: (
    fieldProps: ExtendedFieldProps<FieldValue>,
    ref: React.RefObject<any>,
  ) => React.ReactNode;
  /**
   * Handler called editView is closed and changes are confirmed.
   * Field value is passed as an argument to this function.
   */
  onConfirm: (value: any, analyticsEvent: UIAnalyticsEvent) => void;
  /** Whether the component shows the readView or the editView. */
  isEditing?: boolean;
  /** The value shown in the editView when it is entered. Should be updated by onConfirm. */
  defaultValue: any;
  /** Handler called when readView is clicked. */
  onEdit?: () => void;
  /** Determines whether isEditing begins as true. */
  startWithEditViewOpen?: boolean;
}

export interface InlineEditableTextfieldProps extends CommonProps {
  /**
   * Handler called editView is closed and changes are confirmed.
   * Field value is passed as an argument to this function.
   */
  onConfirm: (value: string, analyticsEvent: UIAnalyticsEvent) => void;
  /** The value shown in the editView when it is entered. Should be updated by onConfirm. */
  defaultValue: any;
  /** Text shown in read view when value is an empty string. */
  placeholder: string;
  /** Determines whether isEditing begins as true. */
  startWithEditViewOpen?: boolean;
  /** Sets height to compact. */
  isCompact?: boolean;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;
}
