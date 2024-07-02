/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - SelectProps
 *
 * @codegen <<SignedSource::ab9916727dd913ba15f53678777541b5>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/select/__generated__/index.partial.tsx <<SignedSource::ceb5be0793278911e531765848d15df9>>
 */
import type { SelectProps as PlatformSelectProps } from '@atlaskit/select';

export type SelectProps = Pick<
PlatformSelectProps<any, true | false>,
  'spacing' | 'appearance' | 'testId' | 'autoFocus' | 'defaultValue' | 'closeMenuOnSelect' | 'inputValue' | 'inputId' | 'isClearable' | 'isLoading' | 'isMulti' | 'isSearchable' | 'menuIsOpen' | 'onInputChange' | 'options' | 'placeholder' | 'onChange'
 | 'id' | 'isDisabled' | 'isInvalid' | 'onBlur' | 'onFocus' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name'
> & { isRequired?: boolean };