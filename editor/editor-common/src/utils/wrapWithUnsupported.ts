import type { ADFEntity } from '@atlaskit/adf-utils/types';

export function wrapWithUnsupported(
	originalValue: ADFEntity,
	type: 'block' | 'inline' | 'mark' = 'block',
): {
	attrs: {
		originalValue: ADFEntity;
	};
	type: string;
} {
	let unsupportedNodeType: string;
	switch (type) {
		case 'inline':
			unsupportedNodeType = 'unsupportedInline';
			break;

		case 'mark':
			unsupportedNodeType = 'unsupportedMark';
			break;

		default:
			unsupportedNodeType = 'unsupportedBlock';
	}

	return {
		type: unsupportedNodeType,
		attrs: { originalValue },
	};
}
