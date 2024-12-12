/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalTitleProps
 *
 * @codegen <<SignedSource::d308ee8af4d7667e94b4fdfdb37d2777>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-title.partial.tsx <<SignedSource::49055cff47790a5b805a36ec28683d0d>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { ModalTitle as PlatformModalTitle } from '@atlaskit/modal-dialog';

type PlatformModalTitleProps = React.ComponentProps<typeof PlatformModalTitle>;

export type ModalTitleProps = Pick<
  PlatformModalTitleProps,
  'appearance' | 'children' | 'isMultiline' | 'testId'
>;