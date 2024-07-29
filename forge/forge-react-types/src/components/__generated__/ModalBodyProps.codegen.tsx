/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalBodyProps
 *
 * @codegen <<SignedSource::7d8f7d9cf8ba92c4ab3a90a0143d902a>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-body.partial.tsx <<SignedSource::3afbe2d34b967a182c9e3517f8ada448>>
 */
import React from 'react';
import { ModalBody as PlatformModalBody } from '@atlaskit/modal-dialog';

type PlatformModalBodyProps = React.ComponentProps<typeof PlatformModalBody>;

export type ModalBodyProps = Pick<
  PlatformModalBodyProps,
  'children' | 'testId'
>;