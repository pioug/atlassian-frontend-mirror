/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - HelperMessageProps
 *
 * @codegen <<SignedSource::cb7b0f9c5f923180d6ab2eb97916ff6c>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/helper-message.partial.tsx <<SignedSource::7f2e5d93a731e1fff5075644b7dd2e61>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { HelperMessage as PlatformHelperMessage } from '@atlaskit/form';

type PlatformHelperMessageProps = React.ComponentProps<typeof PlatformHelperMessage>;

export type HelperMessageProps = Pick<
  PlatformHelperMessageProps,
  'children' | 'testId'
>;