/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalTitleProps
 *
 * @codegen <<SignedSource::5848a62020e85d018a41fb99f5b8c979>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-title.partial.tsx <<SignedSource::8f0848e3fabd3cf3660c08e2b1863bd9>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { ModalTitle as PlatformModalTitle } from '@atlaskit/modal-dialog';

type PlatformModalTitleProps = React.ComponentProps<typeof PlatformModalTitle>;

export type ModalTitleProps = Pick<
  PlatformModalTitleProps,
  'appearance' | 'children' | 'isMultiline' | 'testId'
>;

/**
 * A modal title is used to display a title within a modal.
 *
 * @see [ModalTitle](https://developer.atlassian.com/platform/forge/ui-kit/components/modal/#title) in UI Kit documentation for more information
 */
export type TModalTitle<T> = (props: ModalTitleProps) => T;