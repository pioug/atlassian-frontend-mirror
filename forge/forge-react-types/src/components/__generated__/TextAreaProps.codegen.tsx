/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TextAreaProps
 *
 * @codegen <<SignedSource::61c99f41b3cbc06cb74d1a18372da7c2>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/textarea/__generated__/index.partial.tsx <<SignedSource::31172390a51a038e9b40169b4bf76164>>
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