// eslint-disable-next-line import/no-extraneous-dependencies
import fs from 'fs';
import { resolve, dirname } from 'path';
import type { Rule } from 'eslint';
import type { ObjectExpression } from 'estree';
import { getObjectPropertyAsObject } from '../util/handle-ast-object';

const cwd = process.cwd();

function checkIsAllBinValuesAreValid(node: ObjectExpression, packageDir: string) {
	const binObj = getObjectPropertyAsObject(node, 'bin');

	if (!binObj || !Array.isArray(binObj.properties)) {
		return true;
	}

	return binObj.properties.every((p) => {
		if (p.type === 'Property' && p.value.type === 'Literal') {
			try {
				const binValue = String(p.value.value);
				const pathToBin = resolve(cwd, packageDir, binValue);
				// Ignore bin values that point to dist as these files don't always exist
				if (binValue.startsWith('./dist/')) {
					return true;
				}
				return fs.statSync(pathToBin).isFile();
			} catch (err) {
				return false;
			}
		}
		// If it's not a property or doesn't have a literal value, consider it invalid
		return false;
	});
}

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description: `Ensures bin values in package.json files are valid.`,
			recommended: true,
		},
		hasSuggestions: false,
		messages: {
			invalidBinValue: `Invalid bin value. Ensure that the value points to a file and not a directory.`,
		},
	},
	create(context) {
		const fileName = context.getFilename();
		return {
			ObjectExpression: (node: Rule.Node) => {
				if (!fileName.endsWith('package.json') || node.type !== 'ObjectExpression') {
					return;
				}

				const isAllBinValuesValid = checkIsAllBinValuesAreValid(node, dirname(fileName));
				if (isAllBinValuesValid) {
					return;
				}

				return context.report({
					node,
					messageId: 'invalidBinValue',
				});
			},
		};
	},
};

export default rule;
