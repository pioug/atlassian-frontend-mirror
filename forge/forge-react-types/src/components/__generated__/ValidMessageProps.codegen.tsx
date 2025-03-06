/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ValidMessageProps
 *
 * @codegen <<SignedSource::4cc4d2511f92d5cb8969eb03a63cb079>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/valid-message.partial.tsx <<SignedSource::7c24bfd118e399bb212709c31585209b>>
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
 * A valid message is used to tell a user that the field input is valid.
 * For example, a helper message could be "Nice one, this username is available".
 */
export type TValidMessage<T> = (props: ValidMessageProps) => T;