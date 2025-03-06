/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TextAreaProps
 *
 * @codegen <<SignedSource::4735e4d09b0b6c4a75fe1c08151b6054>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/textarea/index.tsx <<SignedSource::282c20421c108bd52e5341ba0ee4293c>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

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

/**
 * A text area lets users enter long form text which spans over multiple lines.
 */
export type TTextArea<T> = (props: TextAreaProps) => T;