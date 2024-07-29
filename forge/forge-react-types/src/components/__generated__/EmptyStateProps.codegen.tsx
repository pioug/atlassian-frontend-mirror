/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - EmptyStateProps
 *
 * @codegen <<SignedSource::e55c7bde0e4ca11c9b7c2bb77fd560d1>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/emptystate/__generated__/index.partial.tsx <<SignedSource::fcecc0f674b9690cf74157284c24045a>>
 */
import React from 'react';
import PlatformEmptyState from '@atlaskit/empty-state';

type PlatformEmptyStateProps = React.ComponentProps<typeof PlatformEmptyState>;

export type EmptyStateProps = Pick<
  PlatformEmptyStateProps,
  'buttonGroupLabel' | 'description' | 'header' | 'headingLevel' | 'isLoading' | 'primaryAction' | 'secondaryAction' | 'tertiaryAction' | 'testId' | 'width'
>;