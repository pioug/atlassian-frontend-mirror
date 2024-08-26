/* eslint-disable @atlaskit/design-system/no-css-tagged-template-expression -- Should be safe to autofix, but ignoring for now */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import {
	akEditorCodeFontFamily,
	akEditorLineHeight,
	akEditorTableCellMinWidth,
	blockNodesVerticalMargin,
	overflowShadow,
	relativeFontSizeToBase16,
} from '@atlaskit/editor-shared-styles';
import { N20, N30, N400, N800 } from '@atlaskit/theme/colors';
import { fontSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

export const CodeBlockSharedCssClassName = {
	CODEBLOCK_CONTAINER: 'code-block',
	CODEBLOCK_START: 'code-block--start',
	CODEBLOCK_END: 'code-block--end',
	CODEBLOCK_CONTENT_WRAPPER: 'code-block-content-wrapper',
	CODEBLOCK_LINE_NUMBER_GUTTER: 'line-number-gutter',
	CODEBLOCK_CONTENT: 'code-content',
	DS_CODEBLOCK: '[data-ds--code--code-block]',

	// Feature Gate editor_support_code_block_wrapping:
	CODEBLOCK_CONTENT_WRAPPER_FG: 'code-block-content-wrapper--fg',
	CODEBLOCK_CONTENT_FG: 'code-content--fg',
	CODEBLOCK_CONTENT_FG_WRAPPED: 'code-content--fg-wrapped',
	CODEBLOCK_CONTAINER_LINE_NUMBER_WIDGET: 'code-content__line-number--wrapped',
	CODEBLOCK_LINE_NUMBER_GUTTER_FG: 'line-number-gutter--fg',
};

export const codeBlockSharedStyles = () => css`
	.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_FG_WRAPPED}
		> .${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER_FG}
		> .${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_FG} {
		margin-right: ${token('space.100', '8px')};

		code {
			display: block;
			word-break: break-word;
			white-space: pre-wrap;
		}
	}

	.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER_FG}
		> .${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_FG} {
		display: flex;
		flex: 1;

		code {
			flex-grow: 1;

			white-space: pre;
		}
	}

	.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER} {
		position: relative;
		background-color: ${token('elevation.surface.raised', 'transparent')};
		border-radius: ${token('border.radius', '3px')};
		margin: ${blockNodesVerticalMargin} 0 0 0;
		font-family: ${akEditorCodeFontFamily};
		min-width: ${akEditorTableCellMinWidth}px;
		cursor: pointer;

		--ds--code--bg-color: transparent;

		/* This is necessary to allow for arrow key navigation in/out of code blocks in Firefox. */
		white-space: normal;

		.${CodeBlockSharedCssClassName.CODEBLOCK_START} {
			position: absolute;
			visibility: hidden;
			height: 1.5rem;
			top: 0px;
			left: 0px;
		}

		.${CodeBlockSharedCssClassName.CODEBLOCK_END} {
			position: absolute;
			visibility: hidden;
			height: 1.5rem;
			bottom: 0px;
			right: 0px;
		}

		.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER} {
			background-color: ${token('color.background.neutral', N20)};
			display: flex;
			border-radius: ${token('border.radius', '3px')};
			width: 100%;
			counter-reset: line;
			overflow-x: auto;

			background-image: ${overflowShadow({
				leftCoverWidth: token('space.300', '24px'),
			})};

			background-repeat: no-repeat;
			background-attachment: local, local, local, local, scroll, scroll, scroll, scroll;
			background-size:
				${token('space.300', '24px')} 100%,
				${token('space.300', '24px')} 100%,
				${token('space.100', '8px')} 100%,
				${token('space.100', '8px')} 100%,
				${token('space.100', '8px')} 100%,
				1px 100%,
				${token('space.100', '8px')} 100%,
				1px 100%;
			background-position:
				0 0,
				0 0,
				100% 0,
				100% 0,
				100% 0,
				100% 0,
				0 0,
				0 0;

			/* Be careful if refactoring this; it is needed to keep arrow key navigation in Firefox consistent with other browsers. */
			overflow-y: hidden;
		}

		.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER_FG} {
			// relative position set so number gutter remains absolute on horizontal scroll.
			position: relative;
		}

		.${CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER} {
			flex-shrink: 0;
			text-align: right;
			background-color: ${token('color.background.neutral', N30)};
			padding: ${token('space.100', '8px')};
			position: relative;

			span {
				display: block;
				line-height: 0;
				font-size: 0;

				::before {
					display: inline-block;
					content: counter(line);
					counter-increment: line;
					color: ${token('color.text.subtlest', N400)};
					font-size: ${relativeFontSizeToBase16(fontSize())};
					line-height: 1.5rem;
				}
			}
		}

		.${CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER_FG} {
			background-color: ${token('color.background.neutral', N30)};
			position: relative;
			width: var(--lineNumberGutterWidth, 2rem);
			padding: 0px ${token('space.100', '8px')};
			flex-shrink: 0;
			font-size: ${relativeFontSizeToBase16(fontSize())};
			box-sizing: content-box;
		}

		.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT} {
			display: flex;
			flex: 1;

			code {
				flex-grow: 1;
				tab-size: 4;
				cursor: text;
				color: ${token('color.text', N800)};
				border-radius: ${token('border.radius', '3px')};
				margin: ${token('space.100', '8px')};
				white-space: pre;
				font-size: ${relativeFontSizeToBase16(fontSize())};
				line-height: 1.5rem;
			}
		}

		.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_FG} {
			code {
				tab-size: 4;
				cursor: text;
				color: ${token('color.text', N800)};
				border-radius: ${token('border.radius', '3px')};
				margin: ${token('space.100', '8px')};
				font-size: ${relativeFontSizeToBase16(fontSize())};
				line-height: 1.5rem;
			}
		}

		.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER_LINE_NUMBER_WIDGET} {
			pointer-events: none;
			user-select: none;
			width: var(--lineNumberGutterWidth, 2rem);
			left: 0;
			position: absolute;
			font-size: ${relativeFontSizeToBase16(fontSize())};
			padding: 0px ${token('space.100', '8px')};
			line-height: 1.5rem;
			text-align: right;
			color: ${token('color.text.subtlest', '#505F79')};
			box-sizing: content-box;
		}
	}
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const codeBlockInListSafariFix = css`
	::before {
		content: ' ';
		line-height: ${akEditorLineHeight};
	}

	> p:first-child,
	> .code-block:first-child,
	> .ProseMirror-gapcursor:first-child + .code-block {
		margin-top: -${akEditorLineHeight}em !important;
	}
`;
