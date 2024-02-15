/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalFooterProps
 *
 * @codegen <<SignedSource::3a1d3a84d0dadc80fccb033374723796>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/modal/__generated__/modal-footer.partial.tsx <<SignedSource::fc59ea9a104e24791c53ba9f68069a4a>>
 */
import React from 'react';
import { ModalFooter as PlatformModalFooter } from '@atlaskit/modal-dialog';

type PlatformModalFooterProps = React.ComponentProps<typeof PlatformModalFooter>;

export type ModalFooterProps = Pick<
  PlatformModalFooterProps,
  'children' | 'testId'
>;