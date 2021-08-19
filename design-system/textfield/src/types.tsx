import React, { AllHTMLAttributes, FormEventHandler } from 'react';

export interface TextfieldProps extends AllHTMLAttributes<HTMLInputElement> {
  /**
   * Affects the visual style of the text field.
   */
  appearance?: 'standard' | 'none' | 'subtle';

  /**
   * Applies compact styling, making the field smaller.
   */
  isCompact?: boolean;

  /**
   * Sets the field as to appear disabled,
   * users will not be able to interact with the text field.
   */
  isDisabled?: boolean;

  /**
   * Changes the text field to have a border indicating that its value is invalid.
   */
  isInvalid?: boolean;

  /**
   * Sets content text value to appear monospaced.
   */
  isMonospaced?: boolean;

  /**
   * If true, prevents the value of the input from being edited.
   */
  isReadOnly?: boolean;

  /**
   * Set required for form that the field is part of.
   */
  isRequired?: boolean;

  /**
   * Element after input in text field.
   */
  elemAfterInput?: React.ReactNode;

  /**
   * Element before input in text field.
   */
  elemBeforeInput?: React.ReactNode;

  /**
   * Sets maximum width of input.
   */
  width?: string | number;

  /**
   * Handler called when the mouse down event is triggered on the input element.
   */
  onMouseDown?: React.MouseEventHandler<HTMLElement>;

  /**
   * A `testId` prop is provided for specified elements, which is a unique
   * string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;

  /**
   * Name of the input element.
   */
  name?: string;

  /**
   * Class name to apply to the input element.
   */
  className?: string;

  /**
   * Placeholder text to display in the text field whenever it is empty.
   */
  placeholder?: string;

  /**
   * Handler called when the inputs value changes.
   */
  onChange?: FormEventHandler<HTMLInputElement>;
}

export type Appearance = 'subtle' | 'standard' | 'none';
