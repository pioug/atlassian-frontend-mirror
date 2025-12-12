import type { ADFAttributes } from '../../types/ADFAttribute';
import { isAnyOf } from '../../utils/isAnyOf';
import type { ContentVisitorReturnType } from './adfToJsonVisitor';

export function buildRequired(attrs: ADFAttributes, hasContent: boolean, name: string) {
	const required = ['type'];

	if (hasRequiredAttributes(attrs)) {
		required.push('attrs');
	}

	if (hasContent) {
		required.push('content');
	}

	// Version exists only on doc
	if (name === 'doc') {
		required.unshift('version');
	}

	return required;
}

export function hasRequiredAttributes(attrs: ADFAttributes): boolean {
	let required = false;
	if (attrs) {
		if (isAnyOf(attrs)) {
			attrs.anyOf.forEach((attrsSet) => {
				Object.values(attrsSet).forEach((value) => {
					// If we have a single required attribute, we need the attrs field
					if (!value.optional) {
						required = true;
					}
				});
			});
		} else {
			Object.values(attrs).forEach((value) => {
				// If we have a single required attribute, we need the attrs field
				if (!value.optional) {
					required = true;
				}
			});
		}
	}
	return required;
}

export function buildVariantRequired(content: ContentVisitorReturnType[]) {
	if (
		(typeof content[0]?.minItems === 'number' && content[0]?.minItems >= 1) ||
		Boolean(content[0]?.range?.type)
	) {
		return { required: ['content'] };
	}
	return {};
}
