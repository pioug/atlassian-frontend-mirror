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
};

export const codeBlockSharedStyles = () => css`
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
	}
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
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
