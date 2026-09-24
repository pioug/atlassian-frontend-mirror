/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LoadingButtonProps
 *
 * @codegen <<SignedSource::db7a35527410061d67697199a9b3dfdb>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/button/loading-button.tsx <<SignedSource::e34bb9bc8014d07da419f6ae1cb5e56e>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformLoadingButton from '@atlaskit/button/loading-button';

type PlatformLoadingButtonProps = React.ComponentProps<typeof PlatformLoadingButton>;

export type LoadingButtonProps = Pick<
	PlatformLoadingButtonProps,
	| 'children'
	| 'appearance'
	| 'autoFocus'
	| 'isDisabled'
	| 'isSelected'
	| 'onBlur'
	| 'onClick'
	| 'onFocus'
	| 'spacing'
	| 'testId'
	| 'shouldFitContainer'
	| 'type'
	| 'isLoading'
>;

/**
 * A button that shows an spinner as an overlay on the button when you set an isLoading prop to true.
 *
 * @see [LoadingButton](https://developer.atlassian.com/platform/forge/ui-kit/components/button/#loadingbutton-props) in UI Kit documentation for more information
 */
export type TLoadingButton<T> = (props: LoadingButtonProps) => T;