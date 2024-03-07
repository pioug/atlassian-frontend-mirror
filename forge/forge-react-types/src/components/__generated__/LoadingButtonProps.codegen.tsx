/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LoadingButtonProps
 *
 * @codegen <<SignedSource::a2123d0e48cb976f4a90156c58dcbc1a>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/button/__generated__/loading-button.partial.tsx <<SignedSource::2ac2d29e443bfeb014c122223febd49b>>
 */
import React from 'react';
import { LoadingButton as PlatformLoadingButton } from '@atlaskit/button';

type PlatformLoadingButtonProps = React.ComponentProps<typeof PlatformLoadingButton>;

export type LoadingButtonProps = Pick<
  PlatformLoadingButtonProps,
  'children' | 'appearance' | 'autoFocus' | 'isDisabled' | 'isSelected' | 'onBlur' | 'onClick' | 'onFocus' | 'spacing' | 'testId' | 'shouldFitContainer' | 'type' | 'isLoading'
>;