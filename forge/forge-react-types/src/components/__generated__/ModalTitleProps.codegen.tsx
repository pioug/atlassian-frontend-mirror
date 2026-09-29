/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalTitleProps
 *
 * @codegen <<SignedSource::1a7498f6e977a5643ac7f163ead6cb45>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-title.partial.tsx <<SignedSource::494fb3af4d307bcc568f7bd004764455>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformModalTitle from '@atlaskit/modal-dialog/modal-title';

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