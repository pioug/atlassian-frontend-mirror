// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';

const EXCLUDED_FILE_PATH_PARTS = [
	'/__tests__/',
	'/__mocks__/',
	'/examples/',
	'/docs/',
	'/mocks/',
	'/service-mocks/',
	'/mock-data/',
	'/fixtures/',
	'/__fixtures__/',
	'/stories/',
	'/testing/',
	'/test-utils/',
	'/test-assets/',
	'/__ai_benchmarks__/',
] as const;

const EXCLUDED_FILE_NAME_PATTERNS = [
	/\.test\.[cm]?[jt]sx?$/,
	/\.spec\.[cm]?[jt]sx?$/,
	/\.stories\.[cm]?[jt]sx?$/,
	/\.mock\.[cm]?[jt]sx?$/,
	/\/test\.[cm]?[jt]sx?$/,
	/\/mocks\.[cm]?[jt]sx?$/,
] as const;

function normalizeFilePath(filename: string): string {
	return filename.replace(/\\/g, '/');
}

function shouldIgnoreFile(filename: string): boolean {
	const normalizedFilename = normalizeFilePath(filename);
	return (
		EXCLUDED_FILE_PATH_PARTS.some((excludedPart) => normalizedFilename.includes(excludedPart)) ||
		EXCLUDED_FILE_NAME_PATTERNS.some((excludedPattern) => excludedPattern.test(normalizedFilename))
	);
}

type TypeAssertionNode = Rule.Node & {
	expression?: {
		type?: string;
		typeAnnotation?: {
			type?: string;
		};
	};
};

function getDoubleAssertionMessageId(
	node: Rule.Node,
): 'noDoubleUnknownAssertion' | 'noDoubleAnyAssertion' | undefined {
	// ESLint rule nodes carry these fields at runtime; TypeAssertionNode narrows the generic Rule.Node shape safely.
	const assertionNode = node as TypeAssertionNode;
	if (
		assertionNode.expression?.type !== 'TSAsExpression' &&
		assertionNode.expression?.type !== 'TSTypeAssertion'
	) {
		return undefined;
	}

	if (assertionNode.expression.typeAnnotation?.type === 'TSUnknownKeyword') {
		return 'noDoubleUnknownAssertion';
	}

	if (assertionNode.expression.typeAnnotation?.type === 'TSAnyKeyword') {
		return 'noDoubleAnyAssertion';
	}

	return undefined;
}

const rule: Rule.RuleModule = {
	meta: {
		type: 'suggestion',
		docs: {
			description: 'Disallow double type assertions through `unknown` or `any` in production code.',
			recommended: false,
		},
		messages: {
			noDoubleUnknownAssertion:
				'Avoid double type assertions through `unknown`. Prefer fixing the source/target type, adding a type guard, or using a narrower helper.',
			noDoubleAnyAssertion:
				'Avoid double type assertions through `any`. Prefer fixing the source/target type, adding a type guard, or using a narrower helper.',
		},
	},
	create(context) {
		const filename =
			context.filename ??
			(typeof context.getFilename === 'function' ? context.getFilename() : '<unknown>');

		if (shouldIgnoreFile(filename)) {
			return {};
		}

		const checkTypeAssertion = (node: Rule.Node) => {
			const messageId = getDoubleAssertionMessageId(node);
			if (!messageId) {
				return;
			}

			context.report({
				node,
				messageId,
			});
		};

		return {
			TSAsExpression: checkTypeAssertion,
			TSTypeAssertion: checkTypeAssertion,
		};
	},
};

export default rule;
