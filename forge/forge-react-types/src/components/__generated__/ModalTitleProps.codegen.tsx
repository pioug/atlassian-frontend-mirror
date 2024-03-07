/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalTitleProps
 *
 * @codegen <<SignedSource::91055c35e8e86cd3947160a93cf3861b>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/modal/__generated__/modal-title.partial.tsx <<SignedSource::49055cff47790a5b805a36ec28683d0d>>
 */
import React from 'react';
import { ModalTitle as PlatformModalTitle } from '@atlaskit/modal-dialog';

type PlatformModalTitleProps = React.ComponentProps<typeof PlatformModalTitle>;

export type ModalTitleProps = Pick<
  PlatformModalTitleProps,
  'appearance' | 'children' | 'isMultiline' | 'testId'
>;