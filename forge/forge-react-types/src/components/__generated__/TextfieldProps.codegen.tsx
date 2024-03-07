/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TextfieldProps
 *
 * @codegen <<SignedSource::583a4d9d2890a1de7d1b157d68159ed1>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/textfield/__generated__/index.partial.tsx <<SignedSource::0583c3a4ae53ed30f7b74821919abdb9>>
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