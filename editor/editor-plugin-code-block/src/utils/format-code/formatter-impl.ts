import type { FormatCodeResult } from './formatter';

export const formatCode = ({
	content,
	language,
}: {
	content: string;
	language: FormatCodeResult['language'];
}): Promise<FormatCodeResult> => {
	return Promise.resolve({
		content,
		language,
		status: 'unchanged',
	});
};
