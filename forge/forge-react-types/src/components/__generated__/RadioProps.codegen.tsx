/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - RadioProps
 *
 * @codegen <<SignedSource::a7627645dca3852c8c716b51629a953d>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/radio/__generated__/index.partial.tsx <<SignedSource::24d94151d76a83de0609bd9b427e4f3a>>
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

/**
 * A radio input allows users to select only one option from a number of choices. Radio is generally displayed in a radio group.
 *
 * @see [Radio](https://developer.atlassian.com/platform/forge/ui-kit/components/radio/) in UI Kit documentation for more information
 */
export type TRadio<T> = (props: RadioProps) => T;