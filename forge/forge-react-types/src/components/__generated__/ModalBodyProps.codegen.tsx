/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalBodyProps
 *
 * @codegen <<SignedSource::527cab5934b668b8e86db81b839882b6>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-body.partial.tsx <<SignedSource::3afbe2d34b967a182c9e3517f8ada448>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { ModalBody as PlatformModalBody } from '@atlaskit/modal-dialog';

type PlatformModalBodyProps = React.ComponentProps<typeof PlatformModalBody>;

export type ModalBodyProps = Pick<
  PlatformModalBodyProps,
  'children' | 'testId'
>;