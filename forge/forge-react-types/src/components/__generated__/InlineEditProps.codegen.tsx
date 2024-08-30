/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - InlineEditProps
 *
 * @codegen <<SignedSource::6f9f7793b1fa146a1d3ae743f8ed6483>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/inline-edit/index.tsx <<SignedSource::9f519f258e72d24157290a0844371df9>>
 */
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