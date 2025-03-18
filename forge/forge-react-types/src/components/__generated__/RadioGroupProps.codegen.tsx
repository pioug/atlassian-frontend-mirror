/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - RadioGroupProps
 *
 * @codegen <<SignedSource::62c3aaa3d85514469943303c4668c07b>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/radio/__generated__/radio-group.partial.tsx <<SignedSource::eb1a74ed6578669af32fa8e9eccfc967>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { RadioGroup as PlatformRadioGroup } from '@atlaskit/radio';
import type { EventHandlerProps } from './types.codegen';

type PlatformRadioGroupProps = React.ComponentProps<typeof PlatformRadioGroup>;

export type RadioGroupProps = Pick<
  PlatformRadioGroupProps,
  'defaultValue' | 'options' | 'onInvalid' | 'testId'
 | 'isRequired' | 'isDisabled' | 'isInvalid' | 'value' | 'aria-labelledby' | 'name'
> & Pick<EventHandlerProps, 'onChange'>;

/**
 * A radio input allows users to select only one option from a number of choices. Radio is generally displayed in a radio group.
 *
 * @see [RadioGroup](https://developer.atlassian.com/platform/forge/ui-kit/components/radio-group/) in UI Kit documentation for more information
 */
export type TRadioGroup<T> = (props: RadioGroupProps) => T;