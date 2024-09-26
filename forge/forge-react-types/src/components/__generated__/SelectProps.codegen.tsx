/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SelectProps
 *
 * @codegen <<SignedSource::fabe92555f9719783df92aea020d8f40>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/select/index.tsx <<SignedSource::fc28a764d3f41f08f055dafdd7317278>>
 */
import type { SelectProps as PlatformSelectProps } from '@atlaskit/select';

export type SelectProps = Pick<
	PlatformSelectProps<any, true | false>,
	| 'appearance'
	| 'aria-invalid'
	| 'aria-labelledby'
	| 'autoFocus'
	| 'closeMenuOnScroll'
	| 'closeMenuOnSelect'
	| 'defaultInputValue'
	| 'defaultMenuIsOpen'
	| 'defaultValue'
	| 'id'
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
	| 'openMenuOnFocus'
	| 'options'
	| 'placeholder'
	| 'spacing'
	| 'testId'
	| 'value'
> & { isRequired?: boolean };