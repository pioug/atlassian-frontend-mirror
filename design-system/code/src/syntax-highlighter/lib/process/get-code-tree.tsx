import { type AstGenerator, type RefractorNode } from '../../types';

export default function getCodeTree(
	language: string,
	code: string,
	astGenerator?: AstGenerator,
): RefractorNode[] {
	if (language === 'text' || !astGenerator) {
		return [{ type: 'text', value: code }];
	}

	try {
		return astGenerator.highlight(code, language);
	} catch {
		return [{ type: 'text', value: code }];
	}
}
