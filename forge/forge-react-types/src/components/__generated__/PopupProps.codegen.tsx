/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - PopupProps
 *
 * @codegen <<SignedSource::8763a054e66a7a157d421e05062d175f>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/popup/index.tsx <<SignedSource::e9d4bff7da064f1461f189540b88554c>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { default as PlatformPopup } from '@atlaskit/popup';

/**
 * Design decisions made:
 * `zIndex` and `offset` are excluded to constrain the appearance of the popup.
 *
 * `boundary` has been changed as the ADS type can also expect an HTMLElement to be passed in, which cannot work with Forge.
 *
 * `popupComponent` is excluded as the same customisation can be done with `Box` in content
 *
 */
// Public API
export type PopupProps = Omit<
	React.ComponentProps<typeof PlatformPopup>,
	'popupComponent' | 'zIndex' | 'offset' | 'boundary'
> & {
	boundary?: 'clippingParents';
	content: () => React.ReactNode;
	trigger: () => React.ReactNode;
};

/**
 * A popup displays brief content in an overlay.
 *
 * @see [Popup](https://developer.atlassian.com/platform/forge/ui-kit/components/popup/) in UI Kit documentation for more information
 */
export type TPopup<T> = (props: PopupProps) => T;