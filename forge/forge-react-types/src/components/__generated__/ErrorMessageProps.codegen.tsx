/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ErrorMessageProps
 *
 * @codegen <<SignedSource::f2821b3d824a19e37d6d769695a883f4>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/error-message.partial.tsx <<SignedSource::3758488a0115c629a624fcaae1f524c7>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { ErrorMessage as PlatformErrorMessage } from '@atlaskit/form';

type PlatformErrorMessageProps = React.ComponentProps<typeof PlatformErrorMessage>;

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