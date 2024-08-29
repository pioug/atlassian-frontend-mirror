/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - InlineEditProps
 *
 * @codegen <<SignedSource::883cbf65ce085489448ec7a7b7eab334>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/inline-edit/index.tsx <<SignedSource::889a061fb97b1a38f584702345e428c8>>
 */
import React from 'react';
import { default as PlatformInlineEdit } from '@atlaskit/inline-edit';

type EditViewFieldProps<V> = {
	onChange: (value: V) => void;
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