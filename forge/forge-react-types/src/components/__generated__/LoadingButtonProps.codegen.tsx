/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LoadingButtonProps
 *
 * @codegen <<SignedSource::58521a43391f996afe6923d5a591a82c>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/button/__generated__/loading-button.partial.tsx <<SignedSource::078e02aff0fd36fb6bbf64711f0c5490>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { LoadingButton as PlatformLoadingButton } from '@atlaskit/button';

type PlatformLoadingButtonProps = React.ComponentProps<typeof PlatformLoadingButton>;

export type LoadingButtonProps = Pick<
  PlatformLoadingButtonProps,
  'children' | 'appearance' | 'autoFocus' | 'isDisabled' | 'isSelected' | 'onBlur' | 'onClick' | 'onFocus' | 'spacing' | 'testId' | 'shouldFitContainer' | 'type' | 'isLoading'
>;

/**
 * A button triggers an event or action. They let users know what will happen next.
 */
export type TLoadingButton<T> = (props: LoadingButtonProps) => T;