/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SelectProps
 *
 * @codegen <<SignedSource::2bc7fe8cfb0042989648b8ea50915b1c>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/select/index.tsx <<SignedSource::1401c8d11b6573ebf4985ff32ed39da9>>
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