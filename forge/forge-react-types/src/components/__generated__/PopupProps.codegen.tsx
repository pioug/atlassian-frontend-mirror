/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - PopupProps
 *
 * @codegen <<SignedSource::1960d11239445d1e74493a47a5518367>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/popup/index.tsx <<SignedSource::9139dc577b2c62f759ce9545e640a205>>
 */
import React from 'react';
import { default as PlatformPopup } from '@atlaskit/popup';

export type PopupProps = Omit<
	React.ComponentProps<typeof PlatformPopup>,
	'popupComponent' | 'zIndex' | 'offset' | 'boundary'
> & {
	boundary?: 'clippingParents';
	content: () => React.ReactNode;
	trigger: () => React.ReactNode;
};