/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TextAreaProps
 *
 * @codegen <<SignedSource::cd4b380163cc6c585947711b778100fe>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/textarea/__generated__/index.partial.tsx <<SignedSource::c5bf29257b775b4b86ea4789cfa24790>>
 */
import React from 'react';
import PlatformTextarea from '@atlaskit/textarea';
import type { EventHandlerProps } from './types.codegen';

type PlatformTextareaProps = React.ComponentProps<typeof PlatformTextarea>;

export type TextAreaProps = Pick<
  PlatformTextareaProps,
  'appearance' | 'defaultValue' | 'isCompact' | 'isMonospaced' | 'isReadOnly' | 'maxHeight' | 'minimumRows' | 'placeholder' | 'resize' | 'spellCheck' | 'testId' | 'maxLength' | 'minLength' | 'autoFocus'
 | 'id' | 'isRequired' | 'isDisabled' | 'isInvalid' | 'onChange' | 'onBlur' | 'onFocus' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name'
> & Pick<EventHandlerProps, 'onChange' | 'onBlur' | 'onFocus'>;