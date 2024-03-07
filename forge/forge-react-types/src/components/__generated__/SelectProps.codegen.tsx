/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SelectProps
 *
 * @codegen <<SignedSource::727e28488596a9f6dd15015cf612d87b>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/select/__generated__/index.partial.tsx <<SignedSource::d942c0f7e12d127523ea750bac92a98a>>
 */
import { SelectProps as PlatformSelectProps } from '@atlaskit/select';

export type SelectProps = Pick<
PlatformSelectProps<any, true | false>,
  'spacing' | 'appearance' | 'testId' | 'autoFocus' | 'defaultValue' | 'closeMenuOnSelect' | 'inputValue' | 'inputId' | 'isClearable' | 'isLoading' | 'isMulti' | 'isSearchable' | 'menuIsOpen' | 'onInputChange' | 'options' | 'placeholder' | 'onChange'
 | 'id' | 'isDisabled' | 'isInvalid' | 'onBlur' | 'onFocus' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name'
> & { isRequired?: boolean };