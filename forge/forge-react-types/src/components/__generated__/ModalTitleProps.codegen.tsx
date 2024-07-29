/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalTitleProps
 *
 * @codegen <<SignedSource::b48f8d9c55b49deb5dab9a37098cc45a>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-title.partial.tsx <<SignedSource::49055cff47790a5b805a36ec28683d0d>>
 */
import React from 'react';
import { ModalTitle as PlatformModalTitle } from '@atlaskit/modal-dialog';

type PlatformModalTitleProps = React.ComponentProps<typeof PlatformModalTitle>;

export type ModalTitleProps = Pick<
  PlatformModalTitleProps,
  'appearance' | 'children' | 'isMultiline' | 'testId'
>;