/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - EmptyStateProps
 *
 * @codegen <<SignedSource::142748ed4aa864312e3b9ea16f297672>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/emptystate/__generated__/index.partial.tsx <<SignedSource::d6c509a722d55de0f55d401cd2e75435>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformEmptyState from '@atlaskit/empty-state';

type PlatformEmptyStateProps = React.ComponentProps<typeof PlatformEmptyState>;

export type EmptyStateProps = Pick<
  PlatformEmptyStateProps,
  'buttonGroupLabel' | 'description' | 'header' | 'headingLevel' | 'isLoading' | 'primaryAction' | 'secondaryAction' | 'tertiaryAction' | 'testId' | 'width'
>;

/**
 * An empty state appears when there is no data to display and describes what the user can do next.
 *
 * @see [EmptyState](https://developer.atlassian.com/platform/forge/ui-kit/components/empty-state/) in UI Kit documentation for more information
 */
export type TEmptyState<T> = (props: EmptyStateProps) => T;