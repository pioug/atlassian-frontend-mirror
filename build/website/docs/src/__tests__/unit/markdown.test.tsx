import React from 'react';

import CodeBlock from '@atlaskit/code/code-block';
import { render } from '@atlassian/testing-library/testing-library/react';
import { screen } from '@atlassian/testing-library/screen';

import { md } from '../../markdown';

jest.mock('@atlaskit/code/code-block', () => ({
	__esModule: true,
	default: jest.fn(({ text }: { text: string }) => <pre>{text}</pre>),
}));

beforeEach(() => {
	jest.clearAllMocks();
});

it('renders fenced code through ADS CodeBlock with its language and literal source', () => {
	render(md`
\`\`\`tsx
<Example title="Hello" />
\`\`\`
`);

	expect(CodeBlock).toHaveBeenCalledWith(
		expect.objectContaining({ language: 'tsx', text: '<Example title="Hello" />\n' }),
		expect.anything(),
	);
	expect(screen.getByText('<Example title="Hello" />')).toBeInTheDocument();
});

it('renders an unlabelled fence without inventing a language', () => {
	render(md`
\`\`\`
plain text
\`\`\`
`);

	expect(CodeBlock).toHaveBeenCalledWith(
		expect.objectContaining({ language: undefined, text: 'plain text\n' }),
		expect.anything(),
	);
});

it('keeps inline code inline', () => {
	render(md`Use \`catalog.id\` in the host.`);

	expect(screen.getByText('catalog.id').tagName).toBe('CODE');
	expect(CodeBlock).not.toHaveBeenCalled();
});
