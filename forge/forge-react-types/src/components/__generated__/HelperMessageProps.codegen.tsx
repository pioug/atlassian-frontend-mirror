/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - HelperMessageProps
 *
 * @codegen <<SignedSource::f5d010d23af5e8cb84a491df79f22e8f>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/helper-message.partial.tsx <<SignedSource::7f2e5d93a731e1fff5075644b7dd2e61>>
 */
import React from 'react';
import { HelperMessage as PlatformHelperMessage } from '@atlaskit/form';

type PlatformHelperMessageProps = React.ComponentProps<typeof PlatformHelperMessage>;

export type HelperMessageProps = Pick<
  PlatformHelperMessageProps,
  'children' | 'testId'
>;