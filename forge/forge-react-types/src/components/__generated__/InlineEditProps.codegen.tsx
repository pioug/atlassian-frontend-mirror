/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - InlineEditProps
 *
 * @codegen <<SignedSource::cdd92f968cbe93d8725de64c5d2c1b4c>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/inline-edit/index.tsx <<SignedSource::4dab343f92d21d2637fa75f0a58fb904>>
 */
import React from 'react';
import { default as PlatformInlineEdit } from '@atlaskit/inline-edit';

type EditViewFieldProps = {
	onChange: (value: any) => void;
	value: any;
	errorMessage?: string;
	isInvalid: boolean;
	'aria-invalid': 'true' | 'false';
	isRequired: boolean;
};

export type InlineEditProps = Omit<
	React.ComponentProps<typeof PlatformInlineEdit>,
	'analyticsContext' | 'onConfirm'
> & {
	// ADS has an additional analyticsEvent arg that is not optional. We don't use this in UI Kit and it can't be removed due to breaking changes in products
	onConfirm: (value: any) => void;
	editView: (fieldProps: EditViewFieldProps) => React.ReactNode;
};