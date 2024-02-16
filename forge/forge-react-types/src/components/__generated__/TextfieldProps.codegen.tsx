/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TextfieldProps
 *
 * @codegen <<SignedSource::720c29dc742f5983dfd70304c695f12a>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/textfield/__generated__/index.partial.tsx <<SignedSource::be81e96ef821ffead27eed0b4af96460>>
 */
import React from 'react';
import PlatformTextfield from '@atlaskit/textfield';

type PlatformTextfieldProps = React.ComponentProps<typeof PlatformTextfield>;

export type TextfieldProps = Pick<
  PlatformTextfieldProps,
  'appearance' | 'elemAfterInput' | 'elemBeforeInput' | 'isCompact' | 'isReadOnly' | 'isMonospaced' | 'placeholder' | 'testId' | 'width' | 'type' | 'defaultValue' | 'min' | 'max' | 'maxLength' | 'minLength'
 | 'id' | 'isRequired' | 'isDisabled' | 'isInvalid' | 'onChange' | 'onBlur' | 'onFocus' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name'
>;