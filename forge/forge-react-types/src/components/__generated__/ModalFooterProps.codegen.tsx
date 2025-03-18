/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalFooterProps
 *
 * @codegen <<SignedSource::9ca302c7b8cd20f9723c0613af32ff45>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-footer.partial.tsx <<SignedSource::0ff399d8f02a70c539a63e9466091768>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { ModalFooter as PlatformModalFooter } from '@atlaskit/modal-dialog';

type PlatformModalFooterProps = React.ComponentProps<typeof PlatformModalFooter>;

export type ModalFooterProps = Pick<
  PlatformModalFooterProps,
  'children' | 'testId'
>;

/**
 * A modal footer often contains a primary action and the ability to cancel and close the dialog,
 * though can contain any React element.
 *
 * @see [ModalFooter](https://developer.atlassian.com/platform/forge/ui-kit/components/modal/#footer) in UI Kit documentation for more information
 */
export type TModalFooter<T> = (props: ModalFooterProps) => T;