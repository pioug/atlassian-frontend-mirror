/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalTransitionProps
 *
 * @codegen <<SignedSource::9d4490cd7b1938efec7181c83258a4c5>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-transition.partial.tsx <<SignedSource::7f1f7ea64369d3e65533dffbbcec26d7>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { ModalTransition as PlatformModalTransition } from '@atlaskit/modal-dialog';

type PlatformModalTransitionProps = React.ComponentProps<typeof PlatformModalTransition>;

export type ModalTransitionProps = Pick<
  PlatformModalTransitionProps,
  'children'
>;

/**
 * A modal dialog displays content that requires user interaction, in a layer above the page.
 */
export type TModalTransition<T> = (props: ModalTransitionProps) => T;