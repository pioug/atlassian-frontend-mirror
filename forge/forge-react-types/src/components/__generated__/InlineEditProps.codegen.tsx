/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - InlineEditProps
 *
 * @codegen <<SignedSource::8f962ba10ad28d9c11ed0430a9195438>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/inline-edit/index.tsx <<SignedSource::f4625a973245a2df44b3b63960773a46>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { default as PlatformInlineEdit } from '@atlaskit/inline-edit';

type EditViewFieldProps<V> = {
	'aria-invalid': 'true' | 'false';
	errorMessage?: string;
	isInvalid: boolean;
	isRequired: boolean;
	onChange: (event: any) => void;
	value: V;
};

export type InlineEditProps<V = string> = Omit<
	React.ComponentProps<typeof PlatformInlineEdit<V>>,
	'analyticsContext' | 'onConfirm' | 'editView'
> & {
	editView: (fieldProps: EditViewFieldProps<V>) => React.ReactNode;
	// ADS has an additional analyticsEvent arg that is not optional. We don't use this in UI Kit and it can't be removed due to breaking changes in products
	onConfirm: (value: V) => void;
};

/**
 * An inline edit displays a custom input component that switches between reading and editing on the same page.
 *
 * @see [InlineEdit](https://developer.atlassian.com/platform/forge/ui-kit/components/inline-edit/) in UI Kit documentation for more information
 */
export type TInlineEdit<T> = (props: InlineEditProps) => T;