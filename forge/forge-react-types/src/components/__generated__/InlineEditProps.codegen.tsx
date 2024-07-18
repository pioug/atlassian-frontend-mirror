/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - InlineEditProps
 *
 * @codegen <<SignedSource::95bea94f50b42c9241a1fa71ae53d84c>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/inline-edit/index.tsx <<SignedSource::da035ef5c02a0c9efdef35e898e20656>>
 */
import React from 'react';
import { default as PlatformInlineEdit } from '@atlaskit/inline-edit';

export type InlineEditProps = Omit<
	React.ComponentProps<typeof PlatformInlineEdit>,
	'analyticsContext' | 'onConfirm'
> & {
	// ADS has an additional analyticsEvent arg that is not optional. We don't use this in UI Kit and it can't be removed due to breaking changes in products
	onConfirm: (value: any) => void;
};