import { codeBlock, codeBlockWithLocalId } from '@atlaskit/adf-schema';
import { areCodeBlockLineNumbersHidden } from '@atlaskit/editor-common/code-block';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';
import type { NodeSpec, DOMOutputSpec, Node } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { token } from '@atlaskit/tokens';

interface Config {
	allowCodeFolding: boolean;
}

const codeBlockClassNames = {
	container: CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER,
	start: CodeBlockSharedCssClassName.CODEBLOCK_START,
	end: CodeBlockSharedCssClassName.CODEBLOCK_END,
	contentWrapper: CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER,
	contentWrapped: CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPED,
	content: CodeBlockSharedCssClassName.CODEBLOCK_CONTENT,
};

const MATCH_NEWLINES = new RegExp('\n', 'gu');

const getFontSize = () =>
	expValEquals('confluence_compact_text_format', 'isEnabled', true) ||
	(expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
		fg('platform_editor_content_mode_button_mvp'))
		? '0.875em'
		: '0.875rem';

const getGutterBaseStyle = () => ({
	backgroundColor: token('color.background.neutral'),
	position: 'relative',
	flexShrink: 0,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontSize: getFontSize(),
	boxSizing: 'content-box',
});

const getGutterPadding = (allowCodeFolding: boolean) =>
	allowCodeFolding
		? `${token('space.100')} ${token('space.250')} ${token('space.100')} ${token('space.075')}`
		: token('space.100');

const getGuttersWithLineNumbers = (content: string, config: Config): DOMOutputSpec => [
	'div',
	{
		// Based on packages/editor/editor-common/src/styles/shared/code-block.ts
		// But we can't reuse that class as it adds a ::before that intefers with this approach
		style: convertToInlineCss({
			...getGutterBaseStyle(),
			width: 'var(--lineNumberGutterWidth, 2rem)',
			/* top and bottom | left and right */
			padding: getGutterPadding(config.allowCodeFolding),
		}),
		contenteditable: 'false',
	},
	[
		'div',
		{
			class: 'code-block-gutter-pseudo-element',
			style: convertToInlineCss({
				textAlign: 'right',
				color: token('color.text.subtlest'),
				fontFamily: token('font.family.code'),
				whiteSpace: 'pre-wrap',
			}),
			'data-label': content,
		},
	],
];

const getFoldOnlyGutter = (): DOMOutputSpec => [
	'div',
	{
		style: convertToInlineCss({
			...getGutterBaseStyle(),
			padding: `${token('space.100')} ${token('space.150')} ${token('space.100')} ${token('space.100')}`,
		}),
		contenteditable: 'false',
	},
];

const getGutters = (content: string, config: Config, hideLineNumbers: boolean): DOMOutputSpec[] => {
	if (!hideLineNumbers) {
		return [getGuttersWithLineNumbers(content, config)];
	}

	if (config.allowCodeFolding) {
		return [getFoldOnlyGutter()];
	}

	return [];
};

// Based on: `packages/editor/editor-plugin-code-block/src/nodeviews/code-block.ts`
const toDOM = (node: Node, formattedAriaLabel: string, config: Config): DOMOutputSpec => {
	let totalLineCount = 1;

	node.forEach((node) => {
		const text = node.text;
		if (text) {
			totalLineCount += (node.text.match(MATCH_NEWLINES) || []).length;
		}
	});

	const hideLineNumbers = areCodeBlockLineNumbersHidden(node);
	const maxDigits = totalLineCount.toString().length;

	const content = node.textContent
		.split('\n')
		.map((_, i) => i + 1)
		.join('\n');
	const gutters = getGutters(content, config, hideLineNumbers);
	const isCodeBlockWrapped =
		expValEqualsNoExposure('platform_editor_code_block_q4_lovability', 'isEnabled', true) &&
		node.attrs.wrap === true;
	const className = [
		codeBlockClassNames.container,
		isCodeBlockWrapped ? codeBlockClassNames.contentWrapped : undefined,
	]
		.filter(Boolean)
		.join(' ');

	return [
		'pre',
		{
			class: className,
			style: `--lineNumberGutterWidth:${maxDigits}ch;`,
			'data-language': node.attrs.language || '',
			...(expValEqualsNoExposure('platform_editor_code_block_q4_lovability', 'isEnabled', true) && {
				'data-wrap': node.attrs.wrap ? 'true' : 'false',
				...(hideLineNumbers && { 'data-hide-line-numbers': 'true' }),
			}),
		},
		['div', { class: codeBlockClassNames.start, contenteditable: 'false' }],
		[
			'div',
			{
				class: codeBlockClassNames.contentWrapper,
			},
			...gutters,
			[
				'div',
				{
					class: codeBlockClassNames.content,
				},
				[
					'code',
					{
						'data-language': node.attrs.language || '',
						spellcheck: 'false',
						'data-testid': 'code-block--code',
						'aria-label': formattedAriaLabel,
						...(fg('platform_editor_adf_with_localid') && { 'data-local-id': node.attrs.localId }),
					},
					0,
				],
			],
		],
		['div', { class: codeBlockClassNames.end, contenteditable: 'false' }],
	];
};

export const codeBlockNodeWithFixedToDOM = (config: Config): NodeSpec => {
	return {
		...(expValEquals('platform_editor_code_block_q4_lovability', 'isEnabled', true)
			? codeBlock
			: fg('platform_editor_adf_with_localid')
				? codeBlockWithLocalId
				: codeBlock),
		toDOM: (node) => toDOM(node, '', config),
	};
};
