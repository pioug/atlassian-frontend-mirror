/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalFooterProps
 *
 * @codegen <<SignedSource::05f974150dc64ca59a44eb0b121cf773>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-footer.partial.tsx <<SignedSource::fd05c385dd42dfcac111c9ddd8c13a28>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { ModalFooter as PlatformModalFooter } from '@atlaskit/modal-dialog';

type PlatformModalFooterProps = React.ComponentProps<typeof PlatformModalFooter>;

export type ModalFooterProps = Pick<
  PlatformModalFooterProps,
  'children' | 'testId'
>;

/**
 * A modal dialog displays content that requires user interaction, in a layer above the page.
 */
export type TModalFooter<T> = (props: ModalFooterProps) => T;