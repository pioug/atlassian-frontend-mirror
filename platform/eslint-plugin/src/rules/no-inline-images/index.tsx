import type { Rule } from 'eslint';

const IMAGE_DATA_URI = /data:image\/[^,]*,([^\s"'`)]*)/i;

const FIX_ADVICE =
	'Move the image into its own file and import it, or render an icon component from `@atlaskit/icon`.';

const NON_SHIPPING_PATTERNS: RegExp[] = [
	/(^|\/)__(?:tests?|mocks|fixtures|testfixtures)__\//,
	/(^|\/)(?:examples|examples-utils|example-helpers|stories|test-helpers|test-utils|mocks)\//,
	/(^|\/)[^/]+-(?:tests|test-helpers)\//,
	/(^|\/)(?:test|mocks)\.[jt]sx?$/,
	/\.(?:test|spec|mocks|example|examples)\.[jt]sx?$/,
	/\.vr(?:\.ap)?\.[jt]sx?$/,
];

const isNonShippingFile = (filename: string): boolean => {
	const normalised = filename.replace(/\\/g, '/');
	return NON_SHIPPING_PATTERNS.some((pattern) => pattern.test(normalised));
};

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow images inlined into source as data URIs',
			recommended: true,
		},
		messages: {
			dataUri: `Inline image data URI is not allowed. ${FIX_ADVICE} Inlined images are parsed with the JS bundle on every load, cannot be cached independently of the code, and are re-sent inside the SSR HTML.`,
		},
		schema: [],
	},
	create(context) {
		if (isNonShippingFile(context.filename)) {
			return {};
		}

		const report = (node: Rule.Node): void => {
			context.report({ node, messageId: 'dataUri' });
		};

		return {
			Literal(node) {
				if (typeof node.value !== 'string') {
					return;
				}
				const match = node.value.match(IMAGE_DATA_URI);
				if (!match) {
					return;
				}
				const isConcatenationPrefix = node.parent?.type === 'BinaryExpression';
				if (match[1].length > 0 || isConcatenationPrefix) {
					report(node);
				}
			},

			TemplateLiteral(node) {
				for (const quasi of node.quasis) {
					const value = quasi.value?.cooked ?? quasi.value?.raw;
					if (typeof value !== 'string') {
						continue;
					}
					const match = value.match(IMAGE_DATA_URI);
					if (!match) {
						continue;
					}
					if (match[1].length > 0 || !quasi.tail) {
						report(node);
						return;
					}
				}
			},
		};
	},
};

export default rule;
