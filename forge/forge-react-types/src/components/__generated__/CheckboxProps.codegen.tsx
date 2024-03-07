/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CheckboxProps
 *
 * @codegen <<SignedSource::1b2fa7062b83eab7fb63358a187d5aa7>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/checkbox/__generated__/index.partial.tsx <<SignedSource::677ea01a714b425478eb5be7e795920d>>
 */
import React from 'react';
import PlatformCheckbox from '@atlaskit/checkbox';
import type { EventHandlerProps } from './types.codegen';

type PlatformCheckboxProps = React.ComponentProps<typeof PlatformCheckbox>;

export type CheckboxProps = Pick<
  PlatformCheckboxProps,
  'testId' | 'defaultChecked' | 'isChecked' | 'isIndeterminate' | 'label'
 | 'id' | 'isRequired' | 'isDisabled' | 'isInvalid' | 'onChange' | 'onBlur' | 'onFocus' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name'
> & Pick<EventHandlerProps, 'onChange' | 'onBlur' | 'onFocus'>;