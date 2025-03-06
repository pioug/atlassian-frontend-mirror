/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LoadingButtonProps
 *
 * @codegen <<SignedSource::3abc490a74619a5e969b95b74b8ee6f6>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/button/loading-button.tsx <<SignedSource::66edb728e0e941c5f53236e94cd02c18>>
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
 */
export type TLoadingButton<T> = (props: LoadingButtonProps) => T;