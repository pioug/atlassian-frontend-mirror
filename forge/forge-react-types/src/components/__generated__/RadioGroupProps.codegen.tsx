/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - RadioGroupProps
 *
 * @codegen <<SignedSource::cdab8c21bdbe308e0525c518987435f6>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/radio/__generated__/radio-group.partial.tsx <<SignedSource::7d9b07f217be4924a1cf7755f682fb58>>
 */
import React from 'react';
import { RadioGroup as PlatformRadioGroup } from '@atlaskit/radio';

type PlatformRadioGroupProps = React.ComponentProps<typeof PlatformRadioGroup>;

export type RadioGroupProps = Pick<
  PlatformRadioGroupProps,
  'defaultValue' | 'options' | 'onInvalid' | 'testId'
 | 'isRequired' | 'isDisabled' | 'isInvalid' | 'onChange' | 'value' | 'aria-labelledby' | 'name'
>;