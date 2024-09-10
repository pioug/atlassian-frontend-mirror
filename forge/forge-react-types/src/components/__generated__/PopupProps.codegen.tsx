/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - PopupProps
 *
 * @codegen <<SignedSource::bd7e3b349530fc90a2de0e9d4a63fb8d>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/popup/index.tsx <<SignedSource::0708f76a6f3ffe765ff242a9104f7d42>>
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