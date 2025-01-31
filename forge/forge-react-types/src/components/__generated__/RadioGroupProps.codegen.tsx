/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - RadioGroupProps
 *
 * @codegen <<SignedSource::9e8f5f00ccd2499b16825fd3a979fa49>>
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
 */
export type TRadioGroup<T> = (props: RadioGroupProps) => T;