import type { CodeBlockDefinition } from '@atlaskit/adf-schema/code-block';
import type { TextDefinition } from '@atlaskit/adf-schema/text';
import type { NoMark } from '@atlaskit/adf-schema/mark';

export type CodeBlockContent = TextDefinition & NoMark;

export const codeBlock =
	(attrs: CodeBlockDefinition['attrs'] | undefined) =>
	(...content: Array<CodeBlockContent>): CodeBlockDefinition => ({
		type: 'codeBlock',
		attrs,
		content,
	});
