/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TextAreaProps
 *
 * @codegen <<SignedSource::d341a38eb88440dce90367d58211d0d7>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/textarea/index.tsx <<SignedSource::cb1d758c7c2bb0e325bf9f7e3d6ae09d>>
 */
import React from 'react';
import PlatformTextarea from '@atlaskit/textarea';
import type { EventHandlerProps } from './types.codegen';

type PlatformTextareaProps = React.ComponentProps<typeof PlatformTextarea>;

export type TextAreaProps = Pick<
	PlatformTextareaProps,
	| 'appearance'
	| 'defaultValue'
	| 'isCompact'
	| 'isMonospaced'
	| 'isReadOnly'
	| 'maxHeight'
	| 'minimumRows'
	| 'placeholder'
	| 'resize'
	| 'spellCheck'
	| 'testId'
	| 'maxLength'
	| 'minLength'
	| 'autoFocus'
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