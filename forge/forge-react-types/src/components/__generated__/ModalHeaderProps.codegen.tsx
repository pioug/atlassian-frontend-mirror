/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalHeaderProps
 *
 * @codegen <<SignedSource::1b833d542df0d0794bdab0484cb7e7af>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-header.partial.tsx <<SignedSource::c7406471b8da5362a6b844effff24ce4>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { ModalHeader as PlatformModalHeader } from '@atlaskit/modal-dialog';

type PlatformModalHeaderProps = React.ComponentProps<typeof PlatformModalHeader>;

export type ModalHeaderProps = Pick<
  PlatformModalHeaderProps,
  'children' | 'testId'
>;