import { isNodeOfType, type ObjectExpression, type Property } from 'eslint-codemod-utils';

import { countMatchingKeyValues } from './count-matching-key-values';

type KeyValue = {
	key: string;
	value: string;
};

/**
 * Given a node, translate the node into css key-value pairs and
 * compare the output to the reference styles required to make a
 * visually hidden element.
 *
 * @returns {number} A fraction between 0-1 depending on the object's likeness.
 */
export const getObjectLikeness: (node: ObjectExpression) => number = (node: ObjectExpression) => {
	const styleEntries = node.properties
		.filter((node): node is Property => isNodeOfType(node, 'Property'))
		.map(({ key, value }) => {
			if (key.type === 'Identifier') {
				return {
					key: key.name,
					value: value.type === 'Literal' && value.value,
				};
			}

			return null;
		})
		.filter((node): node is KeyValue => Boolean(node));

	return countMatchingKeyValues(styleEntries);
};
