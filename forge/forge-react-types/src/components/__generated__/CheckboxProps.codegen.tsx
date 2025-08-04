/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CheckboxProps
 *
 * @codegen <<SignedSource::2632c877a6e3a788205d19c07f42329f>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/checkbox/__generated__/index.partial.tsx <<SignedSource::d3d8c48b03e142fc013040437e3acf2c>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { EventHandlerProps } from './types.codegen';
import type React from 'react';


// Serialized type
type PlatformCheckboxProps = {
  /**
	 * The name of the submitted field in a checkbox.
	 */
	name?: string;
  /**
	 * The value to be used in the checkbox input. This is the value that will be returned on form submission.
	 */
	value?: string | number;
  /**
	 * Sets whether the checkbox begins as checked or unchecked.
	 */
	defaultChecked?: boolean;
  /**
	 * The ID assigned to the input.
	 */
	id?: string;
  /**
         * Indicates the entered value does not conform to the format expected by the application.
         * @see aria-errormessage.
         */
	"aria-invalid"?: false | true | 'false' | 'true' | 'grammar' | 'spelling';
  /**
         * Identifies the element (or elements) that labels the current element.
         * @see aria-describedby.
         */
	"aria-labelledby"?: string;
  /**
	 * Sets whether the checkbox is checked or unchecked.
	 */
	isChecked?: boolean;
  /**
	 * Sets whether the checkbox is disabled. Don’t use a disabled checkbox if it needs to remain in the tab order for assistive technologies.
	 */
	isDisabled?: boolean;
  /**
	 * Sets whether the checkbox is indeterminate. This only affects the
	 * style and does not modify the isChecked property.
	 */
	isIndeterminate?: boolean;
  /**
	 * Marks the field as invalid. Changes style of unchecked component.
	 */
	isInvalid?: boolean;
  /**
	 * Marks the field as required & changes the label style.
	 */
	isRequired?: boolean;
  /**
	 * The label to be displayed to the right of the checkbox. The label is part
	 * of the clickable element to select the checkbox.
	 */
	label?: React.ReactChild;
  /**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
	 * we have generated testid based on the one you pass to the Checkbox component:
	 * - `{testId}--hidden-checkbox` to check if it got changed to checked/unchecked.
	 */
	testId?: string;
};

export type CheckboxProps = Pick<
  PlatformCheckboxProps,
  'testId' | 'defaultChecked' | 'isChecked' | 'isIndeterminate' | 'label'
 | 'id' | 'isRequired' | 'isDisabled' | 'isInvalid' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name'
> & Pick<EventHandlerProps, 'onChange' | 'onBlur' | 'onFocus'>;

/**
 * A checkbox is an input control that allows a user to select one or more options from a number of choices.
 *
 * @see [Checkbox](https://developer.atlassian.com/platform/forge/ui-kit/components/checkbox/) in UI Kit documentation for more information
 */
export type TCheckbox<T> = (props: CheckboxProps) => T;