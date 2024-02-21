/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TextfieldProps
 *
 * @codegen <<SignedSource::77a5f574841fda41b36a73e5427d6aa0>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/textfield/__generated__/index.partial.tsx <<SignedSource::3bcb2c74465d3be32f20d7ee141d0f9a>>
 */
import React from 'react';
import PlatformTextfield from '@atlaskit/textfield';
import type { EventHandlerProps } from './types.codegen';

type PlatformTextfieldProps = React.ComponentProps<typeof PlatformTextfield>;

export type TextfieldProps = Pick<
  PlatformTextfieldProps,
  'appearance' | 'elemAfterInput' | 'elemBeforeInput' | 'isCompact' | 'isReadOnly' | 'isMonospaced' | 'placeholder' | 'testId' | 'width' | 'type' | 'defaultValue' | 'min' | 'max' | 'maxLength' | 'minLength' | 'pattern'
 | 'id' | 'isRequired' | 'isDisabled' | 'isInvalid' | 'onChange' | 'onBlur' | 'onFocus' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name'
> & Pick<EventHandlerProps, 'onChange' | 'onBlur' | 'onFocus'>;