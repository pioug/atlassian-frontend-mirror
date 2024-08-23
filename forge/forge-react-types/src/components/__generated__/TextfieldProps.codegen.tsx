/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TextfieldProps
 *
 * @codegen <<SignedSource::45c617e56bc06c911a5944941288beba>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/textfield/index.tsx <<SignedSource::3cab13a24ee050b7fe926e8e6a19858b>>
 */
import React from 'react';
import PlatformTextfield from '@atlaskit/textfield';
import type { EventHandlerProps } from './types.codegen';

type PlatformTextfieldProps = React.ComponentProps<typeof PlatformTextfield>;

export type TextfieldProps = Pick<
	PlatformTextfieldProps,
	| 'appearance'
	| 'elemAfterInput'
	| 'elemBeforeInput'
	| 'isCompact'
	| 'autoFocus'
	| 'isReadOnly'
	| 'isMonospaced'
	| 'placeholder'
	| 'testId'
	| 'width'
	| 'type'
	| 'defaultValue'
	| 'min'
	| 'max'
	| 'maxLength'
	| 'minLength'
	| 'pattern'
	| 'id'
	| 'isRequired'
	| 'isDisabled'
	| 'isInvalid'
	| 'value'
	| 'aria-invalid'
	| 'aria-labelledby'
	| 'name'
> &
	Pick<EventHandlerProps, 'onChange' | 'onBlur' | 'onFocus'>;