/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - RadioGroupProps
 *
 * @codegen <<SignedSource::8b1bf9008ffb47471f70bd3b384cdabc>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/radio/__generated__/radio-group.partial.tsx <<SignedSource::57d3f8113898f8bfe14db4552e508eac>>
 */
import React from 'react';
import { RadioGroup as PlatformRadioGroup } from '@atlaskit/radio';

type PlatformRadioGroupProps = React.ComponentProps<typeof PlatformRadioGroup>;

export type RadioGroupProps = Pick<
  PlatformRadioGroupProps,
  'defaultValue' | 'options' | 'onInvalid' | 'testId'
 | 'isRequired' | 'isDisabled' | 'isInvalid' | 'onChange' | 'value' | 'aria-labelledby' | 'name'
>;