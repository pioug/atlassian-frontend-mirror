/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - EmptyStateProps
 *
 * @codegen <<SignedSource::9cdad29cc05434ff3c605fc096399900>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/emptystate/__generated__/index.partial.tsx <<SignedSource::1b9a45148138d319f05ae40d08407eb2>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';


// Serialized type
type PlatformEmptyStateProps = {
  /**
	 * Accessible name for the action buttons group of empty state. Can be used for internationalization. Default is "Button group".
	 */
	buttonGroupLabel?: string;
  /**
	 * The main block of text that holds additional supporting information.
	 */
	description?: React.ReactNode;
  /**
	 * Title that briefly describes the page to the user.
	 */
	header: string;
  /**
	 * The value used to set the heading level of the header element.
	 * Must be in the range of 1 to 6. Defaults to 4.
	 */
	headingLevel?: number;
  /**
	 * Used to indicate a loading state. Will show a spinner next to the action buttons when true.
	 */
	isLoading?: boolean;
  /**
	 * Primary action button for the page, usually it will be something like "Create" (or "Retry" for error pages).
	 */
	primaryAction?: React.ReactNode;
  /**
	 * Secondary action button for the page.
	 */
	secondaryAction?: React.ReactNode;
  /**
	 * Controls how much horizontal space the component fills. Defaults to "wide".
	 */
	width?: 'narrow' | 'wide';
  /**
	 * Button with link to some external resource like documentation or tutorial, it will be opened in a new tab.
	 */
	tertiaryAction?: React.ReactNode;
  /**
	 * A hook for automated testing.
	 */
	testId?: string;
};

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