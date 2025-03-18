/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalBodyProps
 *
 * @codegen <<SignedSource::7bb0c29a8aeb222b8e1996076c1ebf45>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-body.partial.tsx <<SignedSource::627540a6559205080b7e35c17eb83204>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { ModalBody as PlatformModalBody } from '@atlaskit/modal-dialog';

type PlatformModalBodyProps = React.ComponentProps<typeof PlatformModalBody>;

export type ModalBodyProps = Pick<
  PlatformModalBodyProps,
  'children' | 'testId'
>;

/**
 * A modal body is used to display the main content of a modal.
 *
 * @see [ModalBody](https://developer.atlassian.com/platform/forge/ui-kit/components/modal/#body) in UI Kit documentation for more information
 */
export type TModalBody<T> = (props: ModalBodyProps) => T;