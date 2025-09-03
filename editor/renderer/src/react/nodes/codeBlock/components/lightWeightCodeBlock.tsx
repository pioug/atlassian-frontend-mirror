/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, useMemo } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import {
	akEditorTableCellMinWidth,
	blockNodesVerticalMargin,
	overflowShadow,
} from '@atlaskit/editor-shared-styles';
import { CodeBlockSharedCssClassName } from '@atlaskit/editor-common/styles';

import { useBidiWarnings } from '../../../hooks/use-bidi-warnings';
import { RendererCssClassName } from '../../../../consts';
import type { Props as CodeBlockProps } from '../codeBlock';
import { token } from '@atlaskit/tokens';

const codeBlockSharedStyles = css({
	[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPED}
		> .${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER}
		> .${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT}`]: {
		marginRight: token('space.100', '8px'),
		code: {
			display: 'block',
			wordBreak: 'break-word',
			whiteSpace: 'pre-wrap',
		},
	},

	[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER}
		> .${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT}`]: {
		display: 'flex',
		flex: 1,
		code: {
			flexGrow: 1,
			whiteSpace: 'pre',
		},
	},

	[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER}`]: {
		position: 'relative',
		backgroundColor: token('elevation.surface.raised'),
		borderRadius: token('radius.small', '3px'),
		margin: `${blockNodesVerticalMargin} 0 0 0`,
		fontFamily: token('font.family.code'),
		minWidth: `${akEditorTableCellMinWidth}px`,
		cursor: 'pointer',
		clear: 'both',
		'--ds--code--bg-color': 'transparent',

		'.code-block-gutter-pseudo-element::before': {
			content: '"attr(data-label)"',
		},

		/* This is necessary to allow for arrow key navigation in/out of code blocks in Firefox. */
		whiteSpace: 'normal',

		[`.${CodeBlockSharedCssClassName.CODEBLOCK_START}`]: {
			position: 'absolute',
			visibility: 'hidden',
			height: '1.5rem',
			top: '0px',
			left: '0px',
		},

		[`${CodeBlockSharedCssClassName.CODEBLOCK_END}`]: {
			position: 'absolute',
			visibility: 'hidden',
			height: '1.5rem',
			bottom: '0px',
			right: '0px',
		},

		[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER}`]: {
			position: 'relative',
			backgroundColor: token('color.background.neutral'),
			display: 'flex',
			borderRadius: token('radius.small', '3px'),
			width: '100%',
			counterReset: 'line',
			overflowX: 'auto',

			backgroundImage: 'var(--ak-renderer-codeblock-content-wrapper-bg-img)',
			backgroundRepeat: 'no-repeat',
			backgroundAttachment: 'local, local, local, local, scroll, scroll, scroll, scroll',
			backgroundSize: `${token('space.300', '24px')} 100%,
				${token('space.300', '24px')} 100%,
				${token('space.100', '8px')} 100%,
				${token('space.100', '8px')} 100%,
				${token('space.100', '8px')} 100%,
				1px 100%,
				${token('space.100', '8px')} 100%,
				1px 100%`,
			backgroundPosition: `0 0,
				0 0,
				100% 0,
				100% 0,
				100% 0,
				100% 0,
				0 0,
				0 0`,

			/* Be careful if refactoring this; it is needed to keep arrow key navigation in Firefox consistent with other browsers. */
			overflowY: 'hidden',
		},

		[`.${CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER}`]: {
			backgroundColor: token('color.background.neutral'),
			position: 'relative',
			width: 'var(--lineNumberGutterWidth, 2rem)',
			padding: token('space.100', '8px'),
			flexShrink: 0,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: `${14 / 16}rem`,
			boxSizing: 'content-box',
		},

		// This is a fix of marker of list item with code block.
		// The list item marker in Chrome is aligned by the baseline of the text,
		// that's why we need to add a text (content: "1") to the line number gutter to align
		// the list item marker with the text.
		// Without it, the list item marker will be aligned by the bottom of the code block.
		[`.${CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER}::before`]: {
			content: '"1"',
			visibility: 'hidden',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: `${14 / 16}rem`,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: '1.5rem',
		},

		[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTENT}`]: {
			code: {
				tabSize: 4,
				cursor: 'text',
				color: token('color.text'),
				borderRadius: token('radius.small', '3px'),
				margin: token('space.100', '8px'),
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				fontSize: `${14 / 16}rem`,
				// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
				lineHeight: '1.5rem',
			},
		},

		[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER_LINE_NUMBER_WIDGET}`]: {
			pointerEvents: 'none',
			userSelect: 'none',
			width: 'var(--lineNumberGutterWidth, 2rem)',
			left: 0,
			position: 'absolute',
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			fontSize: `${14 / 16}rem`,
			padding: `0px ${token('space.100', '8px')}`,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: '1.5rem',
			textAlign: 'right',
			color: token('color.text.subtlest', '#505F79'),
			boxSizing: 'content-box',
		},
	},
});

const lightWeightCodeBlockStyles = css({
	[`.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER}`]: {
		cursor: 'text',
	},
});

export const LightWeightCodeBlockCssClassName = {
	CONTAINER: 'light-weight-code-block',
};

/**
 * @private
 * @deprecated styles are moved to RendererStyleContainer
 */
export const getLightWeightCodeBlockStylesForRootRendererStyleSheet = () => {
	// We overwrite the rule that clears margin-top for first nested codeblocks, as
	// our lightweight codeblock dom structure will always nest the codeblock inside
	// an extra container div which would constantly be targeted. Now, top-level
	// lightweight codeblock containers will not be targeted.
	// NOTE: This must be added after other .code-block styles in the root
	// Renderer stylesheet.
	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
	return css`
		.${RendererCssClassName.DOCUMENT}
			> .${LightWeightCodeBlockCssClassName.CONTAINER}
			.${CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER} {
			margin-top: ${blockNodesVerticalMargin};
		}
	`;
};

const LightWeightCodeBlock = forwardRef(
	(
		{
			text,
			codeBidiWarningTooltipEnabled = true,
			className,
		}: Pick<CodeBlockProps, 'text' | 'codeBidiWarningTooltipEnabled' | 'className'>,
		ref: React.Ref<HTMLDivElement>,
	) => {
		const textRows = useMemo(() => (text ?? '').split('\n'), [text]);
		const { renderBidiWarnings } = useBidiWarnings({
			enableWarningTooltip: codeBidiWarningTooltipEnabled,
		});
		const classNames = [LightWeightCodeBlockCssClassName.CONTAINER, className].join(' ');
		const codeBlockBackgroundImage = overflowShadow({
			leftCoverWidth: token('space.300', '24px'),
		});

		return (
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={classNames}
				ref={ref}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				css={[codeBlockSharedStyles, lightWeightCodeBlockStyles]}
				style={
					{
						'--ak-renderer-codeblock-content-wrapper-bg-img': codeBlockBackgroundImage,
					} as React.CSSProperties
				}
			>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766  */}
				<div className={CodeBlockSharedCssClassName.CODEBLOCK_CONTAINER}>
					<div
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className={CodeBlockSharedCssClassName.CODEBLOCK_CONTENT_WRAPPER}
					>
						<div
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={CodeBlockSharedCssClassName.CODEBLOCK_LINE_NUMBER_GUTTER}
						>
							{textRows.map((_, index) => (
								// Ignored via go/ees005
								// eslint-disable-next-line react/no-array-index-key
								<span key={index} />
							))}
						</div>
						{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766 */}
						<div className={CodeBlockSharedCssClassName.CODEBLOCK_CONTENT}>
							{/* eslint-disable-next-line @atlaskit/design-system/no-html-code */}
							<code>{renderBidiWarnings(text)}</code>
						</div>
					</div>
				</div>
			</div>
		);
	},
);

export default LightWeightCodeBlock;
