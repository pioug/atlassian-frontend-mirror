/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalBodyProps
 *
 * @codegen <<SignedSource::62f525cfac967e93cd668b2be23fd932>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-body.partial.tsx <<SignedSource::073235be16b29c92968dd79b68ea21f0>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformModalBody from '@atlaskit/modal-dialog/modal-body';

type PlatformModalBodyProps = React.ComponentProps<typeof PlatformModalBody>;

export type ModalBodyProps = Pick<
  PlatformModalBodyProps,
  'children' | 'testId' | 'hasInlinePadding'
>;

/**
 * A modal body is used to display the main content of a modal.
 *
 * @see [ModalBody](https://developer.atlassian.com/platform/forge/ui-kit/components/modal/#body) in UI Kit documentation for more information
 */
export type TModalBody<T> = (props: ModalBodyProps) => T;