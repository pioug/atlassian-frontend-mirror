/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TextAreaProps
 *
 * @codegen <<SignedSource::c8fb478551776ee1318282f1e09b6aec>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/textarea/__generated__/index.partial.tsx <<SignedSource::6ff82f2e9669ec2ae4884bccaf00b53d>>
 */
import React from 'react';
import PlatformTextarea from '@atlaskit/textarea';

type PlatformTextareaProps = React.ComponentProps<typeof PlatformTextarea>;

export type TextAreaProps = Pick<
  PlatformTextareaProps,
  'appearance' | 'defaultValue' | 'isCompact' | 'isMonospaced' | 'isReadOnly' | 'maxHeight' | 'minimumRows' | 'placeholder' | 'resize' | 'spellCheck' | 'testId' | 'maxLength' | 'minLength'
 | 'id' | 'isRequired' | 'isDisabled' | 'isInvalid' | 'onChange' | 'onBlur' | 'onFocus' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name'
>;