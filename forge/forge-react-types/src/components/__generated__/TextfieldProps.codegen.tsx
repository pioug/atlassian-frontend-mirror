/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TextfieldProps
 *
 * @codegen <<SignedSource::53927afe8c8adcca03f0cfa65f9b44dc>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/textfield/index.tsx <<SignedSource::3cab13a24ee050b7fe926e8e6a19858b>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

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