import React, { AllHTMLAttributes, FormEventHandler } from 'react';

// We are ensuring `disabled` can't be used since we are using `isDisabled`
export interface TextfieldProps
  extends Omit<AllHTMLAttributes<HTMLInputElement>, 'disabled'> {
  /**
   * Controls the appearance of the field.
   * Subtle shows styling on hover.
   * None prevents all field styling. Take care when using the none appearance as this doesn't include accessible interactions.
   */
  appearance?: Appearance;

  /**
   * Applies compact styling, making the field smaller.
   */
  isCompact?: boolean;

  /**
   * Sets the field as to appear disabled,
   * people will not be able to interact with the text field and it won't appear in the focus order.
   * Wherever possible, prefer using validation and error messaging over disabled fields for a more accessible experience.
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
