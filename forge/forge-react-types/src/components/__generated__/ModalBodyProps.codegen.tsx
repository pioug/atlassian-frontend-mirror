/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalBodyProps
 *
 * @codegen <<SignedSource::2988707e82f67dc90dca6f9ce898bceb>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-body.partial.tsx <<SignedSource::334347658e03c9c5980bf2bd0c1bd58a>>
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