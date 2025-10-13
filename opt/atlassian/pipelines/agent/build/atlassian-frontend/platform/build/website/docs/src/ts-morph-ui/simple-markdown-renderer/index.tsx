import React from 'react';

import Markdown, { type Components } from 'react-markdown';

import { Code, CodeBlock } from '@atlaskit/code';
import Link from '@atlaskit/link';

const components: Components = {
	a: ({ children, href }) => <Link href={href!}>{children}</Link>,
	code: ({ inline, children }) => {
		return inline ? (
			<Code>{children}</Code>
		) : (
			<CodeBlock text={children.join('\n')} language="TSX" showLineNumbers={false} />
		);
	},
};

interface SimpleMarkdownRendererProps {
	children: string;
}

/**
 * __Simple markdown renderer__
 *
 * Renders simple markdown. For rendering short-form content including:
 * - JSDoc prop descriptions in the props table
 * - Package status messages in SectionMessages (e.g. deprecated, beta)
 *
 * This is more lightweight than other markdown renderers used in atlassian design because:
 * - It doesn't render MDX (markdown with JSX)
 * - It isn't intended for use in main content areas, because it doesn't support heading section links
 */
const SimpleMarkdownRenderer = ({ children }: SimpleMarkdownRendererProps) => {
	return (
		<Markdown
			components={components}
			transformLinkUri={(uri) => {
				/**
				 * Transform absolute atlassian.design URLs to relative links,
				 * so the router can handle them and not trigger page reloads.
				 */
				return uri.replace(/^https:\/\/(www\.)*atlassian.design/g, '');
			}}
		>
			{children}
		</Markdown>
	);
};

export default SimpleMarkdownRenderer;
