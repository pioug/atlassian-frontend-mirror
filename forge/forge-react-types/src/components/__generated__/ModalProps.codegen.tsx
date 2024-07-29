/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalProps
 *
 * @codegen <<SignedSource::3531cbed54819e4160e6549d69d19f55>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/index.partial.tsx <<SignedSource::ca1ac57c4bc55db851325b0ab1ff0021>>
 */
import React from 'react';
import PlatformModalDialog from '@atlaskit/modal-dialog';

type PlatformModalDialogProps = React.ComponentProps<typeof PlatformModalDialog>;

export type ModalProps = Pick<
  PlatformModalDialogProps,
  'autoFocus' | 'children' | 'height' | 'width' | 'onClose' | 'shouldScrollInViewport' | 'label' | 'testId'
>;