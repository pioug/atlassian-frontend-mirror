/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ValidMessageProps
 *
 * @codegen <<SignedSource::40ef2ece49a84181a994ff221e42cc39>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/valid-message.partial.tsx <<SignedSource::5460cf891302777898b53c0b4ae8b610>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { ValidMessage as PlatformValidMessage } from '@atlaskit/form';

type PlatformValidMessageProps = React.ComponentProps<typeof PlatformValidMessage>;

export type ValidMessageProps = Pick<
  PlatformValidMessageProps,
  'children' | 'testId'
>;

/**
 * A form allows users to input information.
 */
export type TValidMessage<T> = (props: ValidMessageProps) => T;