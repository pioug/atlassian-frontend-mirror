import type { Rule } from 'eslint';
import type { Property } from 'estree';

// We will be removing sparse checkout from pipelines in CI completely due to the load it causes on BBC.
// We will be incrementally removing sparse-checkout from the files below as it is probably unnecessasry.
// If you must add an exception below, please go through the chopper process before doing so
const sparseCheckoutExceptions = [
	'pipeline-definitions/pipelines/custom/run-issue-automat.ts',
	'pipeline-definitions/pipelines/custom/marketplace/utils.ts',
	'pipeline-definitions/pipelines/custom/confluence/utils/index.ts',
	'pipeline-definitions/pipelines/custom/afm-tools/upload-afm-dependency-graph-cache.ts',
	'pipeline-definitions/pipelines/custom/afm-tools/default-afm-tools.ts',
	'pipeline-definitions/pipelines/custom/marketplace/utils.ts',
	'pipeline-definitions/pipelines/custom/afm-git-hooks.ts',
	'pipeline-definitions/pipelines/custom/update-codeowners-and-teams-gen.ts',
	'pipeline-definitions/pipelines/custom/run-issue-automat.ts',
];

const rule: Rule.RuleModule = {
	meta: {
		docs: {
			recommended: false,
		},
		type: 'problem',
		messages: {
			noSparseCheckout:
				'Sparse checkout is not allowed in pipeline configurations. Use git-alternates instead by setting sparseCheckout to false or add this file to exceptions.',
		},
	},

	create(context) {
		const fileName = context.filename;
		if (sparseCheckoutExceptions.some((exception) => fileName.endsWith(exception))) {
			return {};
		}

		return {
			// Look for calls to afmClone or objects that match AFMCloneConfig type
			'CallExpression[callee.object.name=alias][callee.property.name=afmClone] ObjectExpression Property':
				(node: Property) => {
					if (node.key.type === 'Identifier' && node.key.name === 'sparseCheckout') {
						if (node.value.type === 'Literal' && node.value.value === true) {
							context.report({
								node,
								messageId: 'noSparseCheckout',
							});
						}
					}
				},
		};
	},
};

export default rule;
