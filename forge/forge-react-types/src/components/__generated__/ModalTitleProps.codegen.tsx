/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalTitleProps
 *
 * @codegen <<SignedSource::18cc7e23ba187aae2f8e2d8631801b53>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-title.partial.tsx <<SignedSource::996c8299a68e072c936b0023b61bdc20>>
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
 * A modal dialog displays content that requires user interaction, in a layer above the page.
 */
export type TModalTitle<T> = (props: ModalTitleProps) => T;