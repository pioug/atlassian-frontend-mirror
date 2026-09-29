/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalBodyProps
 *
 * @codegen <<SignedSource::9d690db4ca963079721eb93ff73f7ab3>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-body.partial.tsx <<SignedSource::2003778fad7a695a800d9b2fa21f7e2f>>
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