/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SelectProps
 *
 * @codegen <<SignedSource::e7cc2654f6b4dfb3d3f0374d0970989f>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/select/index.tsx <<SignedSource::f7eed13874b04c56ded5f3434e03c70e>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { SelectProps as PlatformSelectProps } from '@atlaskit/select';

export type SelectProps = Pick<
	PlatformSelectProps<any, true | false>,
	| 'appearance'
	| 'autoFocus'
	| 'closeMenuOnScroll'
	| 'closeMenuOnSelect'
	| 'defaultInputValue'
	| 'defaultMenuIsOpen'
	| 'defaultValue'
	| 'id'
	// `id` should be used instead of inputId. `inputId` is retained for now for backwards compatibility
	| 'inputId'
	| 'inputValue'
	| 'isClearable'
	| 'isDisabled'
	| 'isInvalid'
	| 'isLoading'
	| 'isMulti'
	| 'isSearchable'
	| 'menuIsOpen'
	| 'openMenuOnFocus'
	| 'name'
	| 'onBlur'
	| 'onChange'
	| 'onFocus'
	| 'onInputChange'
	| 'options'
	| 'placeholder'
	| 'spacing'
	| 'testId'
	| 'value'
	| 'isRequired'
>;

/**
 * Select allows users to make a single selection or multiple selections from a list of options.
 *
 * @see [Select](https://developer.atlassian.com/platform/forge/ui-kit/components/select/) in UI Kit documentation for more information
 */
export type TSelect<T> = (props: SelectProps) => T;