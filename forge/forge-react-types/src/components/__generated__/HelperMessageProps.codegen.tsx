/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - HelperMessageProps
 *
 * @codegen <<SignedSource::85d8a9188648ed81c09769eedb4935e6>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/helper-message.partial.tsx <<SignedSource::f093808bbd8bf8738059aee750524013>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { HelperMessage as PlatformHelperMessage } from '@atlaskit/form';

type PlatformHelperMessageProps = React.ComponentProps<typeof PlatformHelperMessage>;

export type HelperMessageProps = Pick<
  PlatformHelperMessageProps,
  'children' | 'testId'
>;

/**
 * A form allows users to input information.
 */
export type THelperMessage<T> = (props: HelperMessageProps) => T;