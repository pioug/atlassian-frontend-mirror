/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CodeProps
 *
 * @codegen <<SignedSource::e915d32433441373892842df5cce597e>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/code/__generated__/code.partial.tsx <<SignedSource::6f210b052488fe7ece12d865706a551e>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';


// Serialized type
type PlatformCodeProps = {
  /**
	 * A unique string that appears as a data attribute `data-testid`
	 * in the rendered code. Serves as a hook for automated tests.
	 */
	testId?: string;
  /**
	 * Content to be rendered in the inline code block.
	 */
	children?: React.ReactNode;
};

export type CodeProps = Pick<
  PlatformCodeProps,
  'children' | 'testId'
>;

/**
 * Code highlights short strings of code snippets inline with body text.
 *
 * @see [Code](https://developer.atlassian.com/platform/forge/ui-kit/components/code/) in UI Kit documentation for more information
 */
export type TCode<T> = (props: CodeProps) => T;