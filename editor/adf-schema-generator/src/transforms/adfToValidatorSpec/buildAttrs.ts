import type { ADFAttribute, ADFAttributes } from '../../types/ADFAttribute';
import { isAnyOf } from '../../utils/isAnyOf';
import type { ValidatorSpecAttributes } from './ValidatorSpec';

export const buildAttrs = (attrs: ADFAttributes): ValidatorSpecAttributes => {
	if (isAnyOf(attrs)) {
		return attrs.anyOf.map((attr) => buildAttributesMap(attr));
	}
	return buildAttributesMap(attrs);
};

function buildAttributesMap(attrs: Record<string, ADFAttribute>) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const tmpAttrs: Record<string, any> = cleanObject(attrs);

	Object.entries(tmpAttrs).forEach(([key, attr]) => {
		if (attr && attr.type === 'array') {
			tmpAttrs[key].type = 'array';
			tmpAttrs[key].items = attr.items.properties
				? [buildAttrs(attr.items.properties)]
				: [attr.items];
		}
		if (attr && attr.type === 'object' && attr.properties) {
			tmpAttrs[key] = buildAttrs(attr.properties);
		}
	});

	const newAttrs: ValidatorSpecAttributes = {
		props: tmpAttrs,
	};

	if (Object.keys(attrs).every((attr) => attrs[attr]?.optional === true)) {
		newAttrs.optional = true;
	}

	return newAttrs;
}

//recursive function to clean an object of any values that could be
//null, undefined, empty string, or empty object as those aren't
//necessary to include in the ValidatorSpec
function cleanObject(obj: ADFAttributes): ADFAttributes {
	const isObject = (val: unknown) => val && typeof val === 'object' && !Array.isArray(val);
	return Object.entries(obj).reduce((acc, [key, value]) => {
		if (key.startsWith('__')) {
			return acc;
		}

		if (isObject(value)) {
			const nextValue = cleanObject(value);
			if (Object.keys(nextValue).length > 0) {
				// @ts-expect-error
				acc[key] = nextValue;
			}
		} else if (value !== null && value !== undefined && value !== '' && key !== 'default') {
			// @ts-expect-error
			acc[key] = value;
		}
		return acc;
	}, {});
}
