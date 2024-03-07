/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CodeBlockProps
 *
 * @codegen <<SignedSource::1bb8e861957ec1acd27a7d7932aa8f08>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/code/__generated__/codeblock.partial.tsx <<SignedSource::8d1724c2fcc8fab3764250a4f63f76eb>>
 */
import React from 'react';
import { CodeBlock as PlatformCodeBlock } from '@atlaskit/code';

type PlatformCodeBlockProps = React.ComponentProps<typeof PlatformCodeBlock>;

export type CodeBlockProps = Pick<
  PlatformCodeBlockProps,
  'text' | 'testId' | 'showLineNumbers' | 'language' | 'highlight' | 'highlightedStartText' | 'highlightedEndText' | 'shouldWrapLongLines'
>;