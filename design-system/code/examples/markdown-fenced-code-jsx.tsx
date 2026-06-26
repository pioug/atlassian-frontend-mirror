import React from 'react';

import { CodeBlock } from '@atlaskit/code';

// Markdown code block containing a JSX fenced code block.
// With the platform-code-highlight-markdown-safe gate ON, HTML/JSX tags inside
// fenced blocks are preserved AND the inner code is properly syntax-highlighted
// with the fenced language's token classes.
const markdownWithFencedJsx = `We should show html inside fenced code in markdown codeblocks

\`\`\`jsx
<div>
  <App />
  <p>
	This is a paragraph
  </p>
</div>
const test = true;
\`\`\``;

export default function MarkdownFencedCodeJsx(): React.JSX.Element {
	return (
		<div>
			<h2>Markdown with fenced JSX code block</h2>
			<CodeBlock language="markdown" text={markdownWithFencedJsx} showLineNumbers={false} />
		</div>
	);
}
