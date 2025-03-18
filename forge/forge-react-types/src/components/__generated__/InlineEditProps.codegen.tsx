/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - InlineEditProps
 *
 * @codegen <<SignedSource::76e64cd0950ea7da3cf92b08df75f5fc>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/inline-edit/index.tsx <<SignedSource::7654358cb6b3406900f008113b08977d>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { default as PlatformInlineEdit } from '@atlaskit/inline-edit';

type EditViewFieldProps<V> = {
	onChange: (event: any) => void;
	value: V;
	errorMessage?: string;
	isInvalid: boolean;
	'aria-invalid': 'true' | 'false';
	isRequired: boolean;
};

export type InlineEditProps<V = string> = Omit<
	React.ComponentProps<typeof PlatformInlineEdit<V>>,
	'analyticsContext' | 'onConfirm' | 'editView'
> & {
	// ADS has an additional analyticsEvent arg that is not optional. We don't use this in UI Kit and it can't be removed due to breaking changes in products
	onConfirm: (value: V) => void;
	editView: (fieldProps: EditViewFieldProps<V>) => React.ReactNode;
};

/**
 * An inline edit displays a custom input component that switches between reading and editing on the same page.
 *
 * @see [InlineEdit](https://developer.atlassian.com/platform/forge/ui-kit/components/inline-edit/) in UI Kit documentation for more information
 */
export type TInlineEdit<T> = (props: InlineEditProps) => T;