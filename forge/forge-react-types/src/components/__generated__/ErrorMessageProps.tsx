/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ErrorMessageProps
 *
 * @codegen <<SignedSource::e06b8f2a1b0806c23aa2e60c92496071>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/form/__generated__/error-message.partial.tsx <<SignedSource::c861b69951ece4979f78212c0a4adebf>>
 */
import React from 'react';
import { ErrorMessage as PlatformErrorMessage } from '@atlaskit/form';

type PlatformErrorMessageProps = React.ComponentProps<typeof PlatformErrorMessage>;

export type ErrorMessageProps = Pick<
  PlatformErrorMessageProps,
  'children' | 'testId'
>;