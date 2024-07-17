/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - PopupProps
 *
 * @codegen <<SignedSource::048c8cd953be259496fc69cb92c450c4>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/popup/index.tsx <<SignedSource::669054459a4e640892876e5374fc4d60>>
 */
import React from 'react';
import { default as PlatformPopup } from '@atlaskit/popup';

export type PopupProps = Omit<
	React.ComponentProps<typeof PlatformPopup>,
	'content' | 'trigger' | 'popupComponent' | 'zIndex' | 'offset' | 'boundary'
> & {
	children: React.ReactNode;
	boundary?: 'clippingParents';
};