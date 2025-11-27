import { type TokenSchema } from '../types';

export function tokenToMarkdown(token: TokenSchema): string {
	return `# ${token.name}

${token.description}

Example Value: \`${token.exampleValue}\`
`;
}

// When it comes time to generate HTML content, we can add `tokenToHtml` here.
