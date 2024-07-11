/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - InlineEditProps
 *
 * @codegen <<SignedSource::df616049f34e7fd6ab871781645bdb6a>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/inline-edit/index.tsx <<SignedSource::86ac72f92909d48a88b33710464753bb>>
 */
import React from 'react';
import { default as PlatformInlineEdit } from '@atlaskit/inline-edit';

export type InlineEditProps = Omit<
	React.ComponentProps<typeof PlatformInlineEdit>,
	'validate' | 'analyticsContext' | 'readView' | 'editView'
> & { children: React.ReactNode };