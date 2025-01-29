/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CodeProps
 *
 * @codegen <<SignedSource::1a39727c921b99c3519aa0020e967c21>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/code/__generated__/code.partial.tsx <<SignedSource::370e450903cb8f21b11acac7a9fc720b>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { Code as PlatformCode } from '@atlaskit/code';

type PlatformCodeProps = React.ComponentProps<typeof PlatformCode>;

export type CodeProps = Pick<
  PlatformCodeProps,
  'children' | 'testId'
>;

/**
 * Code highlights short strings of code snippets inline with body text.
 */
export type TCode<T> = (props: CodeProps) => T;