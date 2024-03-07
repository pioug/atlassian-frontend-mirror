/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalHeaderProps
 *
 * @codegen <<SignedSource::e8dfd9f77cfa6d58d63c2091f09e798a>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/modal/__generated__/modal-header.partial.tsx <<SignedSource::c7406471b8da5362a6b844effff24ce4>>
 */
import React from 'react';
import { ModalHeader as PlatformModalHeader } from '@atlaskit/modal-dialog';

type PlatformModalHeaderProps = React.ComponentProps<typeof PlatformModalHeader>;

export type ModalHeaderProps = Pick<
  PlatformModalHeaderProps,
  'children' | 'testId'
>;