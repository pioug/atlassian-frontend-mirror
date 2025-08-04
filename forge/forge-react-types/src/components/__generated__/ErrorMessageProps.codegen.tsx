/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ErrorMessageProps
 *
 * @codegen <<SignedSource::2f1370fde23ea2658ac0e975fb66e8a4>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/error-message.partial.tsx <<SignedSource::c9dbd6aa3a26e5a00da1735d9615813f>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type React from 'react';


// Serialized type
type PlatformErrorMessageProps = {
  /**
	 * The content of the message
	 */
	children: React.ReactNode;
  /**
	 * A testId prop is provided for specified elements, which is a unique string
	 *  that appears as a data attribute data-testid in the rendered code,
	 *  serving as a hook for automated tests
	 */
	testId?: string;
};

export type ErrorMessageProps = Pick<
  PlatformErrorMessageProps,
  'children' | 'testId'
>;

/**
 * An error message is used to tell a user that the field input is invalid.
 * For example, an error message could be "Invalid username, needs to be more than 4 characters".
 *
 * @see [ErrorMessage](https://developer.atlassian.com/platform/forge/ui-kit/components/form/#error-message) in UI Kit documentation for more information
 */
export type TErrorMessage<T> = (props: ErrorMessageProps) => T;