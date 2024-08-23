/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - RadioGroupProps
 *
 * @codegen <<SignedSource::bfe736ed7d6bc248df6a092491f99239>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/radio/__generated__/radio-group.partial.tsx <<SignedSource::4389c503fdf3481d7d3b0a5b93920e3f>>
 */
import React from 'react';
import { RadioGroup as PlatformRadioGroup } from '@atlaskit/radio';
import type { EventHandlerProps } from './types.codegen';

type PlatformRadioGroupProps = React.ComponentProps<typeof PlatformRadioGroup>;

export type RadioGroupProps = Pick<
  PlatformRadioGroupProps,
  'defaultValue' | 'options' | 'onInvalid' | 'testId'
 | 'isRequired' | 'isDisabled' | 'isInvalid' | 'value' | 'aria-labelledby' | 'name'
> & Pick<EventHandlerProps, 'onChange'>;