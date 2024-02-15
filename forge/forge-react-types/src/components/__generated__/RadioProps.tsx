/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - RadioProps
 *
 * @codegen <<SignedSource::a1d58472cd61500f71d474be73cc88fa>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/radio/__generated__/index.partial.tsx <<SignedSource::18874920ac24475b87e84e8c449175e8>>
 */
import React from 'react';
import { Radio as PlatformRadio } from '@atlaskit/radio';

type PlatformRadioProps = React.ComponentProps<typeof PlatformRadio>;

export type RadioProps = Pick<
  PlatformRadioProps,
  'label' | 'testId' | 'isChecked' | 'ariaLabel' | 'onInvalid'
 | 'id' | 'isRequired' | 'isDisabled' | 'isInvalid' | 'onChange' | 'onBlur' | 'onFocus' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name'
>;