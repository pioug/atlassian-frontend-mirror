/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - CodeBlockProps
 *
 * @codegen <<SignedSource::acb7589d93437f14bb10b34a87bc77c3>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/code/__generated__/codeblock.partial.tsx <<SignedSource::36e259b9b68d1f48a7f37473dcc86f82>>
 */
import React from 'react';
import { CodeBlock as PlatformCodeBlock } from '@atlaskit/code';

type PlatformCodeBlockProps = React.ComponentProps<typeof PlatformCodeBlock>;

export type CodeBlockProps = Pick<
  PlatformCodeBlockProps,
  'text' | 'testId' | 'showLineNumbers' | 'language' | 'highlight' | 'highlightedStartText' | 'highlightedEndText' | 'shouldWrapLongLines'
>;