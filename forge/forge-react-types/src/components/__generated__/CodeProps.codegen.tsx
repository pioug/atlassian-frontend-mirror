/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CodeProps
 *
 * @codegen <<SignedSource::5b14dff15ad9bdad8a26fdda0fcb700c>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/code/__generated__/code.partial.tsx <<SignedSource::7c44fc035da9da9e1dc10ad78f244bed>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { Code as PlatformCode } from '@atlaskit/code';

type PlatformCodeProps = React.ComponentProps<typeof PlatformCode>;

export type CodeProps = Pick<
  PlatformCodeProps,
  'children' | 'testId'
>;