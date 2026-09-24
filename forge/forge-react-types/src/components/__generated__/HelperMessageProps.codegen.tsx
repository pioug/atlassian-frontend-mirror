/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - HelperMessageProps
 *
 * @codegen <<SignedSource::f7ab90f4ac527af50c8e940906992ac3>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/helper-message.partial.tsx <<SignedSource::bf398b90716492acb64bd6218b0140ca>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { HelperMessage as PlatformHelperMessage } from '@atlaskit/form/helper-message';

type PlatformHelperMessageProps = React.ComponentProps<typeof PlatformHelperMessage>;

export type HelperMessageProps = Pick<
  PlatformHelperMessageProps,
  'children' | 'testId'
>;

/**
 * A helper message tells the user what kind of input the field takes.
 * For example, a helper message could be "Password should be more than 4 characters".
 *
 * @see [HelperMessage](https://developer.atlassian.com/platform/forge/ui-kit/components/form/#helper-message) in UI Kit documentation for more information
 */
export type THelperMessage<T> = (props: HelperMessageProps) => T;