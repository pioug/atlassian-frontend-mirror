/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SelectProps
 *
 * @codegen <<SignedSource::a382208b82dd9aabba9d2db6c1647c3e>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/select/__generated__/index.partial.tsx <<SignedSource::c500f98dd082115d2b2925bb87f29338>>
 */
import type { SelectProps as PlatformSelectProps } from '@atlaskit/select';

export type SelectProps = Pick<
PlatformSelectProps<any, true | false>,
  'spacing' | 'appearance' | 'testId' | 'autoFocus' | 'defaultValue' | 'closeMenuOnSelect' | 'inputValue' | 'inputId' | 'isClearable' | 'isLoading' | 'isMulti' | 'isSearchable' | 'menuIsOpen' | 'onInputChange' | 'options' | 'placeholder' | 'onChange'
 | 'id' | 'isDisabled' | 'isInvalid' | 'onBlur' | 'onFocus' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name' | 'openMenuOnFocus'
> & { isRequired?: boolean };