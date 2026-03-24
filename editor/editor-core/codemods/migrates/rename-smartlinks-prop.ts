import type core from 'jscodeshift';
import type { Collection } from 'jscodeshift/src/Collection';

/**
 * Renames a JSX attribute with the given name to be a key
 * within the JSX attribute toObjectName of the name toObjectKey.
 *
 * @param from String
 * @param toObjectName String
 * @param toObjectKey String
 */
export const createJSXRenameVariableToNestedKeyTransform = (
	from: string,
	toObjectName: string,
	toObjectKey: string,
) => {
	return (j: core.JSCodeshift, source: Collection<unknown>): void => {
		source
			.find(j.JSXAttribute, { name: { type: 'JSXIdentifier', name: from } })
			.forEach((fromAttribute) => {
				// is there an existing destination prop
				const isExistingAttribute =
					source.find(j.JSXAttribute, {
						name: { type: 'JSXIdentifier', name: toObjectName },
					}).length !== 0;

				if (
					!isExistingAttribute &&
					fromAttribute.node.value?.type === 'JSXExpressionContainer' &&
					fromAttribute.node.value.expression.type === 'ObjectExpression'
				) {
					const existingProperties = fromAttribute.node.value.expression.properties;
					const newObject = j.objectExpression([
						j.property('init', j.identifier(toObjectKey), j.objectExpression(existingProperties)),
					]);
					// eslint-disable-next-line @atlassian/perf-linting/no-expensive-split-replace -- Ignored via go/ees017 (to be fixed)
					fromAttribute.replace(
						j.jsxAttribute(j.jsxIdentifier(toObjectName), j.jsxExpressionContainer(newObject)),
					);
				}
			});
	};
};

export const renameSmartLinksProp: (j: core.JSCodeshift, source: Collection<unknown>) => void =
	createJSXRenameVariableToNestedKeyTransform('smartLinks', 'linking', 'smartLinks');
