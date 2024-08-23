/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CheckboxProps
 *
 * @codegen <<SignedSource::3a91a161c9c94e4ac140697510a2b366>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/checkbox/__generated__/index.partial.tsx <<SignedSource::b920c1cd759f2f7718cbd7afc3c04856>>
 */
import React from 'react';
import PlatformCheckbox from '@atlaskit/checkbox';
import type { EventHandlerProps } from './types.codegen';

type PlatformCheckboxProps = React.ComponentProps<typeof PlatformCheckbox>;

export type CheckboxProps = Pick<
  PlatformCheckboxProps,
  'testId' | 'defaultChecked' | 'isChecked' | 'isIndeterminate' | 'label'
 | 'id' | 'isRequired' | 'isDisabled' | 'isInvalid' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name'
> & Pick<EventHandlerProps, 'onChange' | 'onBlur' | 'onFocus'>;