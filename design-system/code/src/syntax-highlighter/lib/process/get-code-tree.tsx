import { fg } from '@atlaskit/platform-feature-flags';

import { type AstGenerator, type RefractorNode } from '../../types';

/**
 * When the language is 'markdown', refractor's grammar parses fenced code blocks
 * using embedded sub-language grammars (e.g. ```python triggers Python parsing).
 * This embedded parsing can silently drop HTML/JSX tag tokens (e.g. <div>, </span>)
 * because the sub-language grammar tokenizes and discards them.
 *
 * To prevent content loss while still providing markdown syntax highlighting,
 * we temporarily remove the 'code-block' sub-grammar from the markdown token's
 * inside object during highlighting, then restore it afterward.
 *
 * After the safe highlight we walk the AST to find fenced code blocks and
 * re-highlight their content with the sub-language so that tokens (keywords,
 * strings, etc.) are properly classified. This restores the full
 * `token code-block language-{lang}` class structure that consumers expect.
 */

type RefractorLike = {
	languages?: {
		markdown?: {
			code?: Array<{ inside?: { 'code-block'?: unknown } }>;
		};
	};
	registered?: (lang: string) => boolean;
} & NonNullable<AstGenerator>;

/**
 * Extract the plain text content from a list of RefractorNodes.
 */
function extractText(nodes: RefractorNode[]): string {
	return nodes
		.map((n) => {
			if (n.type === 'text') {
				return n.value;
			}
			return n.children ? extractText(n.children) : '';
		})
		.join('');
}

/**
 * Walk the safe-highlighted AST and, for every fenced code block (a `token code`
 * span), replace the raw text child with a properly highlighted `token code-block
 * language-{lang}` span so that inner tokens carry the correct classes.
 */
function rehighlightFencedBlocks(
	nodes: RefractorNode[],
	astGenerator: NonNullable<AstGenerator>,
): RefractorNode[] {
	const refractorLike = astGenerator as RefractorLike;

	return nodes.map((node) => {
		if (node.type !== 'element') {
			return node;
		}

		const classes = node.properties?.className ?? [];
		const isCodeToken = classes.includes('token') && classes.includes('code');

		if (!isCodeToken || !node.children) {
			return {
				...node,
				children: rehighlightFencedBlocks(node.children ?? [], astGenerator),
			};
		}

		// Find the code-language child to determine which sub-language to use.
		const langNode = node.children.find(
			(c) => c.type === 'element' && c.properties?.className?.includes('code-language'),
		);
		const subLang =
			langNode && langNode.type === 'element' ? extractText(langNode.children ?? []).trim() : null;

		// Find the raw text child that holds the fenced block content (after the
		// opening ``` line and before the closing ```).
		const children = node.children.map((child) => {
			// This is the raw code content
			// eslint-disable-next-line @repo/internal/react/no-children-properties-access
			const rawContent = 'value' in child ? child.value : undefined;
			if (!subLang || !rawContent) {
				return child;
			}

			// Only re-highlight when the sub-language is registered with refractor to
			// avoid an uncaught exception.
			const isRegistered =
				typeof refractorLike.registered === 'function'
					? refractorLike.registered(subLang)
					: Boolean((refractorLike.languages as Record<string, unknown>)?.[subLang]);

			if (!isRegistered) {
				return child;
			}

			let highlighted: RefractorNode[];
			try {
				highlighted = astGenerator.highlight(rawContent, subLang);
			} catch {
				return child;
			}

			// Wrap in a `token code-block language-{lang}` span to match what the
			// normal (non-safe) markdown highlight would produce.
			const codeBlockNode: RefractorNode = {
				type: 'element',
				tagName: 'span',
				properties: {
					className: ['token', 'code-block', `language-${subLang}`],
				},
				children: highlighted,
			};
			return codeBlockNode;
		});

		return { ...node, children };
	});
}

function highlightMarkdownSafely(
	code: string,
	astGenerator: NonNullable<AstGenerator>,
): RefractorNode[] {
	const refractorLike = astGenerator as RefractorLike;
	const markdownCodeToken = refractorLike.languages?.markdown?.code;
	const fencedToken = Array.isArray(markdownCodeToken) ? markdownCodeToken[1] : undefined;
	const originalInside = fencedToken?.inside;
	const canDisableEmbeddedCodeBlock = originalInside && 'code-block' in originalInside;

	if (canDisableEmbeddedCodeBlock) {
		const patchedInside = { ...originalInside };
		delete patchedInside['code-block'];
		fencedToken.inside = patchedInside;
	}

	let result: RefractorNode[];
	try {
		result = astGenerator.highlight(code, 'markdown');
	} finally {
		if (canDisableEmbeddedCodeBlock) {
			fencedToken.inside = originalInside;
		}
	}

	// Re-highlight inner fenced code blocks so tokens carry proper classes.
	return rehighlightFencedBlocks(result!, astGenerator);
}

export default function getCodeTree(
	language: string,
	code: string,
	astGenerator?: AstGenerator,
): RefractorNode[] {
	if (language === 'text' || !astGenerator) {
		return [{ type: 'text', value: code }];
	}

	try {
		if (language === 'markdown' && fg('platform-code-highlight-markdown-safe')) {
			return highlightMarkdownSafely(code, astGenerator);
		}
		return astGenerator.highlight(code, language);
	} catch {
		return [{ type: 'text', value: code }];
	}
}
