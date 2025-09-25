/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LoadingButtonProps
 *
 * @codegen <<SignedSource::f3ab66b3494753ac1721770620800f33>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/button/loading-button.tsx <<SignedSource::f8f88b5f1e0c23036af2f7649740ac92>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { LoadingButton as PlatformLoadingButton } from '@atlaskit/button';

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