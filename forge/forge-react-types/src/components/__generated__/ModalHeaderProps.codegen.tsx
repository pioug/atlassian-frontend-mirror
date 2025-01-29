/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalHeaderProps
 *
 * @codegen <<SignedSource::c3bc5fde61f2e698aba9b95565c0d268>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-header.partial.tsx <<SignedSource::932c9f34f6cd6919fe5b8bcf072745dc>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { ModalHeader as PlatformModalHeader } from '@atlaskit/modal-dialog';

type PlatformModalHeaderProps = React.ComponentProps<typeof PlatformModalHeader>;

export type ModalHeaderProps = Pick<
  PlatformModalHeaderProps,
  'children' | 'testId'
>;

/**
 * A modal dialog displays content that requires user interaction, in a layer above the page.
 */
export type TModalHeader<T> = (props: ModalHeaderProps) => T;