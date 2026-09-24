/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalHeaderProps
 *
 * @codegen <<SignedSource::e36173598d95635fdf700f22580a40f9>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-header.partial.tsx <<SignedSource::2ce8c17d6b1e2a93c51a7fd9b707a447>>
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