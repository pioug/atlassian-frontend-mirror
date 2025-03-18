/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalHeaderProps
 *
 * @codegen <<SignedSource::10b4d948ea5e49b9606b2dc907be20cb>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-header.partial.tsx <<SignedSource::9102fefee5c2fe6cbee65bf860d29652>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { ModalHeader as PlatformModalHeader } from '@atlaskit/modal-dialog';

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