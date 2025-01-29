/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ModalBodyProps
 *
 * @codegen <<SignedSource::f6704cd3ad5b9e900de7e400b133ad53>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/modal/__generated__/modal-body.partial.tsx <<SignedSource::0fe5715703e89dfc44882777af179380>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { ModalBody as PlatformModalBody } from '@atlaskit/modal-dialog';

type PlatformModalBodyProps = React.ComponentProps<typeof PlatformModalBody>;

export type ModalBodyProps = Pick<
  PlatformModalBodyProps,
  'children' | 'testId'
>;

/**
 * A modal dialog displays content that requires user interaction, in a layer above the page.
 */
export type TModalBody<T> = (props: ModalBodyProps) => T;