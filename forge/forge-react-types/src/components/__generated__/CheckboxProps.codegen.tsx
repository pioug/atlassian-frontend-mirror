/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CheckboxProps
 *
 * @codegen <<SignedSource::e1143d6f4dd7d33075f02cf185aea3ac>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/checkbox/__generated__/index.partial.tsx <<SignedSource::7b7730b3889af5ecf39c01387fb94d37>>
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