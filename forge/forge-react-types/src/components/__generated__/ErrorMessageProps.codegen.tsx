/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ErrorMessageProps
 *
 * @codegen <<SignedSource::e0113090a69fef83efb55ec91c533444>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/error-message.partial.tsx <<SignedSource::94778992a6ed8c3225c72407310f2a82>>
 */
import React from 'react';
import { ErrorMessage as PlatformErrorMessage } from '@atlaskit/form';

type PlatformErrorMessageProps = React.ComponentProps<typeof PlatformErrorMessage>;

export type ErrorMessageProps = Pick<
  PlatformErrorMessageProps,
  'children' | 'testId'
>;