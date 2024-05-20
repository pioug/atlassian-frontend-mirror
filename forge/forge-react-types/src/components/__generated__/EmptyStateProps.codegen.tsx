/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - EmptyStateProps
 *
 * @codegen <<SignedSource::28f76a7107a94512c3887133d192e2a2>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/emptystate/__generated__/index.partial.tsx <<SignedSource::d4b5b23ca37771361175c873f7dac2cb>>
 */
import React from 'react';
import PlatformEmptyState from '@atlaskit/empty-state';

type PlatformEmptyStateProps = React.ComponentProps<typeof PlatformEmptyState>;

export type EmptyStateProps = Pick<
  PlatformEmptyStateProps,
  'buttonGroupLabel' | 'description' | 'header' | 'headingLevel' | 'isLoading' | 'primaryAction' | 'secondaryAction' | 'tertiaryAction' | 'testId' | 'width'
>;