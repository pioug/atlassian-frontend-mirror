/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalHeaderProps
 *
 * @codegen <<SignedSource::9bb830bc73b9abbfaef11e3e5850b923>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-header.partial.tsx <<SignedSource::43056e44452c4de4f09f265401333751>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformModalHeader from '@atlaskit/modal-dialog/modal-header';

type PlatformModalHeaderProps = React.ComponentProps<typeof PlatformModalHeader>;

export type ModalHeaderProps = Pick<
  PlatformModalHeaderProps,
  'children' | 'testId'
>;

/**
 * A modal header contains the title of the modal and can contain other React elements such as a close button.
 *
 * @see [ModalHeader](https://developer.atlassian.com/platform/forge/ui-kit/components/modal/#header) in UI Kit documentation for more information
 */
export type TModalHeader<T> = (props: ModalHeaderProps) => T;