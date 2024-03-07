/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalTransitionProps
 *
 * @codegen <<SignedSource::9b09b41223e9e579242ca9c16c8ae602>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/modal/__generated__/modal-transition.partial.tsx <<SignedSource::910582b1aa75eb00197dd07ca5ae1d34>>
 */
import React from 'react';
import { ModalTransition as PlatformModalTransition } from '@atlaskit/modal-dialog';

type PlatformModalTransitionProps = React.ComponentProps<typeof PlatformModalTransition>;

export type ModalTransitionProps = Pick<
  PlatformModalTransitionProps,
  'children'
>;