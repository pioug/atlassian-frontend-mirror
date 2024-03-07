/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - RadioGroupProps
 *
 * @codegen <<SignedSource::7fc6c49342a8e432eac07b36e1032e13>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/radio/__generated__/radio-group.partial.tsx <<SignedSource::223b7d89d4a1f28e5d1e6a65f289180a>>
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