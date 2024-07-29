/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ValidMessageProps
 *
 * @codegen <<SignedSource::f29747864a4de84775530717cd9c3ac5>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/valid-message.partial.tsx <<SignedSource::5642828cf60622725e2b538ad69b07d8>>
 */
import React from 'react';
import { ValidMessage as PlatformValidMessage } from '@atlaskit/form';

type PlatformValidMessageProps = React.ComponentProps<typeof PlatformValidMessage>;

export type ValidMessageProps = Pick<
  PlatformValidMessageProps,
  'children' | 'testId'
>;