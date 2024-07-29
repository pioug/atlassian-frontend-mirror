/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - RadioGroupProps
 *
 * @codegen <<SignedSource::3da1d927615a1b61298bcd18c73f323a>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/radio/__generated__/radio-group.partial.tsx <<SignedSource::223b7d89d4a1f28e5d1e6a65f289180a>>
 */
import React from 'react';
import { RadioGroup as PlatformRadioGroup } from '@atlaskit/radio';
import type { EventHandlerProps } from './types.codegen';

type PlatformRadioGroupProps = React.ComponentProps<typeof PlatformRadioGroup>;

export type RadioGroupProps = Pick<
  PlatformRadioGroupProps,
  'defaultValue' | 'options' | 'onInvalid' | 'testId'
 | 'isRequired' | 'isDisabled' | 'isInvalid' | 'onChange' | 'value' | 'aria-labelledby' | 'name'
> & Pick<EventHandlerProps, 'onChange'>;