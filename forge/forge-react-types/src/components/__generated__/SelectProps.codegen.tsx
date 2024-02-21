/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SelectProps
 *
 * @codegen <<SignedSource::15d2ba46804ab0a683383a0ba9cae564>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/select/__generated__/index.partial.tsx <<SignedSource::a826a4f7af8f06890432c9274aad7332>>
 */
import { SelectProps as PlatformSelectProps } from '@atlaskit/select';

export type SelectProps = Pick<
PlatformSelectProps<any, true | false>,
  'spacing' | 'appearance' | 'testId' | 'autoFocus' | 'defaultValue' | 'closeMenuOnSelect' | 'inputValue' | 'inputId' | 'isClearable' | 'isLoading' | 'isMulti' | 'isSearchable' | 'menuIsOpen' | 'onInputChange' | 'options' | 'placeholder' | 'onChange'
 | 'id' | 'isDisabled' | 'isInvalid' | 'onBlur' | 'onFocus' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name'
> & { isRequired?: boolean };