/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - RadioProps
 *
 * @codegen <<SignedSource::ea635961fc152531f5dc13002f9bc354>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/radio/__generated__/index.partial.tsx <<SignedSource::345d92d2db0af47e2d3879fb6d74fc1c>>
 */
import React from 'react';
import { Radio as PlatformRadio } from '@atlaskit/radio';
import type { EventHandlerProps } from './types.codegen';

type PlatformRadioProps = React.ComponentProps<typeof PlatformRadio>;

export type RadioProps = Pick<
  PlatformRadioProps,
  'label' | 'testId' | 'isChecked' | 'ariaLabel' | 'onInvalid'
 | 'id' | 'isRequired' | 'isDisabled' | 'isInvalid' | 'onChange' | 'onBlur' | 'onFocus' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name'
> & Pick<EventHandlerProps, 'onChange' | 'onBlur' | 'onFocus'>;