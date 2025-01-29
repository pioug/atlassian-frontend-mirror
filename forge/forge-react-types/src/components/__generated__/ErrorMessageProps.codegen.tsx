/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ErrorMessageProps
 *
 * @codegen <<SignedSource::3d3da7aa33a6ac0adb1524f89ee28208>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/error-message.partial.tsx <<SignedSource::9e1a8d256d8d999a689140fbcda430fa>>
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
 * A form allows users to input information.
 */
export type TErrorMessage<T> = (props: ErrorMessageProps) => T;