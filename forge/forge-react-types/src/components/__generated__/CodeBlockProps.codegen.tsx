/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CodeBlockProps
 *
 * @codegen <<SignedSource::098e0843568fab0c7230e24d7d1d8a4f>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/code/__generated__/codeblock.partial.tsx <<SignedSource::8d1724c2fcc8fab3764250a4f63f76eb>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { CodeBlock as PlatformCodeBlock } from '@atlaskit/code';

type PlatformCodeBlockProps = React.ComponentProps<typeof PlatformCodeBlock>;

export type CodeBlockProps = Pick<
  PlatformCodeBlockProps,
  'text' | 'testId' | 'showLineNumbers' | 'language' | 'highlight' | 'highlightedStartText' | 'highlightedEndText' | 'shouldWrapLongLines'
>;