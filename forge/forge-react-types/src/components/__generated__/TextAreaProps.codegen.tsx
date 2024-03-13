/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TextAreaProps
 *
 * @codegen <<SignedSource::fca310fde6a12e97218081fac82e0625>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/textarea/__generated__/index.partial.tsx <<SignedSource::66ee1dc657854e150ce4cbc044da7a74>>
 */
import React from 'react';
import PlatformTextarea from '@atlaskit/textarea';
import type { EventHandlerProps } from './types.codegen';

type PlatformTextareaProps = React.ComponentProps<typeof PlatformTextarea>;

export type TextAreaProps = Pick<
  PlatformTextareaProps,
  'appearance' | 'defaultValue' | 'isCompact' | 'isMonospaced' | 'isReadOnly' | 'maxHeight' | 'minimumRows' | 'placeholder' | 'resize' | 'spellCheck' | 'testId' | 'maxLength' | 'minLength'
 | 'id' | 'isRequired' | 'isDisabled' | 'isInvalid' | 'onChange' | 'onBlur' | 'onFocus' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name'
> & Pick<EventHandlerProps, 'onChange' | 'onBlur' | 'onFocus'>;