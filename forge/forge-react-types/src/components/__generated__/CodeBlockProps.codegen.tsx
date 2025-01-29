/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CodeBlockProps
 *
 * @codegen <<SignedSource::7ac72aa38d908f5ad8be5452cccb84d1>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/code/__generated__/codeblock.partial.tsx <<SignedSource::88ed38fdfc47db0938e7801195a00403>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { CodeBlock as PlatformCodeBlock } from '@atlaskit/code';

type PlatformCodeBlockProps = React.ComponentProps<typeof PlatformCodeBlock>;

export type CodeBlockProps = Pick<
  PlatformCodeBlockProps,
  'text' | 'testId' | 'showLineNumbers' | 'language' | 'highlight' | 'highlightedStartText' | 'highlightedEndText' | 'shouldWrapLongLines'
>;

/**
 * Code highlights short strings of code snippets inline with body text.
 */
export type TCodeBlock<T> = (props: CodeBlockProps) => T;