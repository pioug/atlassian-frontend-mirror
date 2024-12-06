/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SelectProps
 *
 * @codegen <<SignedSource::3b7200ff817a7c5d80c0382e136dfbaa>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/select/index.tsx <<SignedSource::a2510e0de095c3d94007eb9c6488aa55>>
 */
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