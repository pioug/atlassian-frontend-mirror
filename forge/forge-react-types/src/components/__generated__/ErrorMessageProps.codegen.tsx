/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ErrorMessageProps
 *
 * @codegen <<SignedSource::4e04a95ec1d6531ceea5f968651471fb>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/form/__generated__/error-message.partial.tsx <<SignedSource::94778992a6ed8c3225c72407310f2a82>>
 */
import React from 'react';
import { ErrorMessage as PlatformErrorMessage } from '@atlaskit/form';

type PlatformErrorMessageProps = React.ComponentProps<typeof PlatformErrorMessage>;

export type ErrorMessageProps = Pick<
  PlatformErrorMessageProps,
  'children' | 'testId'
>;