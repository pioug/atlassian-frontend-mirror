import type { CodeBlockDefinition } from '@atlaskit/adf-schema/code-block';
import type { NoMark } from '@atlaskit/adf-schema/mark';
import type { TextDefinition } from '@atlaskit/adf-schema/text';

export type CodeBlockContent = TextDefinition & NoMark;

export const codeBlock =
	(attrs: CodeBlockDefinition['attrs'] | undefined) =>
	(...content: Array<CodeBlockContent>): CodeBlockDefinition => ({
		type: 'codeBlock',
		attrs,
		content,
	});
