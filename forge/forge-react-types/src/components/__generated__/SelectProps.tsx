/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SelectProps
 *
 * @codegen <<SignedSource::4e9d64e2de4d4f9cd483efaa5de5a05f>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/select/__generated__/index.partial.tsx <<SignedSource::f3e959aa3cc9fe6181aafc871483f7fc>>
 */
import { SelectProps as PlatformSelectProps } from '@atlaskit/select';

export type SelectProps = Pick<
PlatformSelectProps<any, true | false>,
  'spacing' | 'appearance' | 'testId' | 'autoFocus' | 'defaultValue' | 'closeMenuOnSelect' | 'inputValue' | 'inputId' | 'isClearable' | 'isLoading' | 'isMulti' | 'isSearchable' | 'menuIsOpen' | 'onInputChange' | 'options' | 'placeholder' | 'onChange'
 | 'id' | 'isDisabled' | 'isInvalid' | 'onBlur' | 'onFocus' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name'
> & { isRequired: boolean };