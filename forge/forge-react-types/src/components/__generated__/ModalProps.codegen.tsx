/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalProps
 *
 * @codegen <<SignedSource::fd2d23af87d0cac85d3be5580d3b709f>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/index.partial.tsx <<SignedSource::3bf621bc2d484c5789face984482559d>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformModalDialog from '@atlaskit/modal-dialog';

type PlatformModalDialogProps = React.ComponentProps<typeof PlatformModalDialog>;

export type ModalProps = Pick<
  PlatformModalDialogProps,
  'autoFocus' | 'children' | 'height' | 'width' | 'onClose' | 'shouldScrollInViewport' | 'label' | 'testId'
>;

/**
 * A modal dialog displays content that requires user interaction, in a layer above the page.
 *
 * @see [Modal](https://developer.atlassian.com/platform/forge/ui-kit/components/modal/) in UI Kit documentation for more information
 */
export type TModal<T> = (props: ModalProps) => T;