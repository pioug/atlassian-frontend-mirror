/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - RangeProps
 *
 * @codegen <<SignedSource::b4d9d9782fddfcc97ee7eddba7e28dca>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/range/__generated__/index.partial.tsx <<SignedSource::f103edf77dd59ef0430af04f1964ab23>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { EventHandlerProps } from './types.codegen';


// Serialized type
type PlatformRangeProps = {
  /**
	 * Sets the maximum value of the range.
	 */
	max?: number;
  /**
	 * Sets the minimum value of the range.
	 */
	min?: number;
  
	name?: string;
  /**
	 * Sets the step value for the range.
	 */
	step?: number;
  /**
	 * Sets the value of the range.
	 */
	value?: number;
  /**
	 * Hook to be invoked on change of the range.
	 */
	onChange?: (value: number) => void;
  /**
	 * Sets the default value if range is not set.
	 */
	defaultValue?: number;
  
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
	 * Sets whether the field range is disabled.
	 */
	isDisabled?: boolean;
  /**
	 * A `testId` prop is provided for specific elements. This is a unique string
	 * that appears as a data attribute `data-testid` in the rendered code and
	 * serves as a hook for automated tests.
	 */
	testId?: string;
};

export type RangeProps = Pick<
  PlatformRangeProps,
  'defaultValue' | 'max' | 'min' | 'step' | 'testId' | 'onChange'
 | 'id' | 'isDisabled' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name'
> & Pick<EventHandlerProps, 'onBlur' | 'onFocus'>;

/**
 * A range lets users choose an approximate value on a slider.
 *
 * @see [Range](https://developer.atlassian.com/platform/forge/ui-kit/components/range/) in UI Kit documentation for more information
 */
export type TRange<T> = (props: RangeProps) => T;