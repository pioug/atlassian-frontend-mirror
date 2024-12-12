/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalFooterProps
 *
 * @codegen <<SignedSource::7657939e947e8a4d66010076aefb0f8d>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-footer.partial.tsx <<SignedSource::b986e724d7de17ec51a6549e5a8b0e67>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { ModalFooter as PlatformModalFooter } from '@atlaskit/modal-dialog';

type PlatformModalFooterProps = React.ComponentProps<typeof PlatformModalFooter>;

export type ModalFooterProps = Pick<
  PlatformModalFooterProps,
  'children' | 'testId'
>;