/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - RadioProps
 *
 * @codegen <<SignedSource::326831c949bb5cbb99e073727ad8d55e>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/radio/__generated__/index.partial.tsx <<SignedSource::f8ac68c1f51a8a6ea746a657fc9ee4da>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { Radio as PlatformRadio } from '@atlaskit/radio';
import type { EventHandlerProps } from './types.codegen';

type PlatformRadioProps = React.ComponentProps<typeof PlatformRadio>;

export type RadioProps = Pick<
  PlatformRadioProps,
  'label' | 'testId' | 'isChecked' | 'ariaLabel' | 'onInvalid'
 | 'id' | 'isRequired' | 'isDisabled' | 'isInvalid' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name'
> & Pick<EventHandlerProps, 'onChange' | 'onBlur' | 'onFocus'>;