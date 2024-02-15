/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalTransitionProps
 *
 * @codegen <<SignedSource::df435f929563d7625457888946c4e6b3>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/modal/__generated__/modal-transition.partial.tsx <<SignedSource::d5c980dc84e9fb1ce9e5a092c27d77bc>>
 */
import React from 'react';
import { ModalTransition as PlatformModalTransition } from '@atlaskit/modal-dialog';

type PlatformModalTransitionProps = React.ComponentProps<typeof PlatformModalTransition>;

export type ModalTransitionProps = Pick<
  PlatformModalTransitionProps,
  'children'
>;