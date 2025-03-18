/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CheckboxProps
 *
 * @codegen <<SignedSource::d5cd5c6518e80c98416fc61091717141>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/checkbox/__generated__/index.partial.tsx <<SignedSource::e34c0ab52d3409a8548b6e51450ba43b>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformCheckbox from '@atlaskit/checkbox';
import type { EventHandlerProps } from './types.codegen';

type PlatformCheckboxProps = React.ComponentProps<typeof PlatformCheckbox>;

export type CheckboxProps = Pick<
  PlatformCheckboxProps,
  'testId' | 'defaultChecked' | 'isChecked' | 'isIndeterminate' | 'label'
 | 'id' | 'isRequired' | 'isDisabled' | 'isInvalid' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name'
> & Pick<EventHandlerProps, 'onChange' | 'onBlur' | 'onFocus'>;

/**
 * A checkbox is an input control that allows a user to select one or more options from a number of choices.
 *
 * @see [Checkbox](https://developer.atlassian.com/platform/forge/ui-kit/components/checkbox/) in UI Kit documentation for more information
 */
export type TCheckbox<T> = (props: CheckboxProps) => T;