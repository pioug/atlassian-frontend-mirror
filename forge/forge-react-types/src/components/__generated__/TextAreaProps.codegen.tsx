/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TextAreaProps
 *
 * @codegen <<SignedSource::9a728b21f878b7d2411d9ea96c367054>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/textarea/index.tsx <<SignedSource::cb1d758c7c2bb0e325bf9f7e3d6ae09d>>
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