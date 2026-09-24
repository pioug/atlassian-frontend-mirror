/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ValidMessageProps
 *
 * @codegen <<SignedSource::753a19cded0694775e3cad5818bbb3b8>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/valid-message.partial.tsx <<SignedSource::98f990d62977391928051e91f7962883>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { ValidMessage as PlatformValidMessage } from '@atlaskit/form/valid-message';

type PlatformValidMessageProps = React.ComponentProps<typeof PlatformValidMessage>;

export type ValidMessageProps = Pick<
  PlatformValidMessageProps,
  'children' | 'testId'
>;

/**
 * A valid message is used to tell a user that the field input is valid.
 * For example, a helper message could be "Nice one, this username is available".
 *
 * @see [ValidMessage](https://developer.atlassian.com/platform/forge/ui-kit/components/form/#validation-message) in UI Kit documentation for more information
 */
export type TValidMessage<T> = (props: ValidMessageProps) => T;