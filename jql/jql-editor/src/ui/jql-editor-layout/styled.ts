// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, keyframes } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import {
	B200,
	B300,
	G300,
	N0,
	N10,
	N100,
	N30,
	N700,
	N800,
	N900,
	P400,
	R400,
} from '@atlaskit/theme/colors';
import {
	codeFontFamily,
	fontFamily,
	fontSize,
	// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
	gridSize,
	layers,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import {
	TOOLTIP_CLASSNAME,
	TOOLTIP_ENTER_CLASSNAME,
	TOOLTIP_EXIT_CLASSNAME,
} from '../../plugins/validation-tooltip/constants';

const fadeIn = keyframes({
	from: {
		opacity: 0,
	},
	to: {
		opacity: 1,
	},
});

const fadeOut = keyframes({
	from: {
		visibility: 'visible',
		opacity: 1,
	},
	to: {
		opacity: 0,
	},
});

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-keyframes -- Ignored via go/DSP-18766
export const EditorMain = styled.div`
	/* CSS reset */
	font-family: ${fontFamily()};
	font-size: ${fontSize()}px;
	flex-grow: 1;

	/* These styles and animations are derived from @atlaskit/tooltip */

	.${TOOLTIP_CLASSNAME} {
		background-color: ${token('color.background.neutral.bold', N800)};
		color: ${token('color.text.inverse', N0)};
		border-radius: ${token('border.radius.100', '3px')};
		box-sizing: border-box;
		font-size: 12px;
		line-height: 1.3;
		max-width: 240px;
		padding: ${token('space.025', '2px')} ${token('space.075', '6px')};
		word-wrap: break-word;
		overflow-wrap: break-word;
		z-index: ${layers.tooltip()};
		pointer-events: none;
		position: absolute;
		visibility: hidden;

		/* Horizontally center and vertically position above the target element */
		transform: translate(-50%, calc(-100% - ${token('space.200', '16px')}));

		&.${TOOLTIP_ENTER_CLASSNAME} {
			animation: ${fadeIn} 350ms cubic-bezier(0.15, 1, 0.3, 1);
			visibility: visible;
		}

		&.${TOOLTIP_EXIT_CLASSNAME} {
			animation: ${fadeOut} 350ms cubic-bezier(0.15, 1, 0.3, 1);
		}
	}
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const EditorFooter = styled.div({
	display: 'flex',
	justifyContent: 'space-between',
	minHeight: '20px',
});

// Height (in px) for a single row in the editor
const rowHeight = gridSize() * 2.75;
// Vertical padding for the editor input
const getEditorInputVerticalPadding = (isCompact: boolean) => (isCompact ? 3 : 7);
const editorInputHorizontalPadding = 6;

type EditorViewContainerProps = {
	editorViewHasFocus?: boolean;
	editorViewIsInvalid?: boolean;
};
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const EditorViewContainer = styled.div<EditorViewContainerProps>(
	{
		backgroundColor: token('color.background.input', N10),
		borderStyle: 'solid',
		borderWidth: token('border.width', '1px'),
		borderColor: token('color.border.input', N100),
		borderRadius: token('border.radius.100', '3px'),
		padding: token('border.width', '1px'),
		boxSizing: 'border-box',
		color: token('color.text', N900),
		display: 'flex',
		overflow: 'auto',
		transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	(props) =>
		props.editorViewIsInvalid &&
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		css({
			borderColor: token('color.border.danger', R400),
			boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${token(
				'color.border.danger',
				R400,
			)}`,
		}),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	(props) =>
		props.editorViewHasFocus
			? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css({
					backgroundColor: token('elevation.surface', N0),
					borderColor: token('color.border.focused', B200),
					boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${token(
						'color.border.focused',
						B200,
					)}`,
				})
			: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css({
					'&:hover': {
						backgroundColor: token('color.background.input.hovered', N30),
					},
				}),
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ReadOnlyEditorViewContainer = styled(EditorViewContainer)({
	backgroundColor: token('color.background.disabled', N30),
	color: token('color.text.disabled', N100),
	pointerEvents: 'none',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const LineNumberToolbar = styled.div<{ lineNumbersVisible: boolean }>(
	{
		backgroundColor: token('color.background.neutral', N30),
		flexShrink: 0,
		width: '30px',
		position: 'sticky',
		top: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	(props) =>
		!props.lineNumbersVisible &&
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		css({
			display: 'none',
		}),
);

/**
 * The main div which the Prosemirror editor will be rendered into.
 */
// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const EditorView = styled.div<{
	defaultMaxRows: number;
	expandedRows: number;
	lineNumbersVisible: boolean;
	isCompact: boolean;
}>`
	counter-reset: lineNumber;
	flex-grow: 1;

	transition:
		height 250ms cubic-bezier(0.15, 1, 0.3, 1),
		max-height 250ms cubic-bezier(0.15, 1, 0.3, 1);
	max-height: ${(props) =>
		rowHeight * props.defaultMaxRows + getEditorInputVerticalPadding(props.isCompact) * 2}px;

	line-height: ${rowHeight / fontSize()};
	font-family: ${codeFontFamily()};
	word-break: break-word;
	overflow-wrap: anywhere;
	white-space: pre-wrap;

	&[data-expanded] {
		height: ${(props) =>
			rowHeight * props.expandedRows + getEditorInputVerticalPadding(props.isCompact) * 2}px;
		max-height: ${(props) =>
			rowHeight * props.expandedRows + getEditorInputVerticalPadding(props.isCompact) * 2}px;
	}

	.ProseMirror {
		color: ${token('color.text', N700)};
		padding: ${(props) => getEditorInputVerticalPadding(props.isCompact)}px
			${editorInputHorizontalPadding}px;

		&:focus {
			outline: none;
		}

		.mark-token-keyword {
			color: ${token('color.text.accent.purple', P400)};
		}

		.mark-token-field {
			color: ${token('color.text.accent.blue', B300)};
		}

		.mark-token-operator {
			color: ${token('color.text.accent.green', G300)};
		}

		.mark-token-error {
			color: ${token('color.text.danger', R400)};
			text-decoration: wavy underline;
			text-decoration-thickness: 1px;
			text-decoration-skip-ink: none;
		}
	}

	p {
		margin: 0;
		counter-increment: lineNumber;
		position: relative;

		/* Show the current line number before each paragraph block. */

		&::before {
			content: counter(lineNumber);
			color: ${token('color.text.subtlest', N100)};
			font-size: 10px;
			line-height: ${rowHeight / 10};
			padding: 0 ${token('space.100', '8px')} 0 ${token('space.025', '2px')};
			position: absolute;
			box-sizing: border-box;
			/* Shift the line number tag 100% (plus 8px padding) to the left to position it inside the LineNumberToolbar */
			transform: translateX(calc(-100% - ${token('space.100', '8px')}));

			/* We can fit 3 digits before ellipses. This is not very responsive but saves us having to add expensive width
        recalculation logic to the LineNumberToolbar for a scenario that *should* never happen. */
			max-width: 30px;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;

			${(props) =>
				!props.lineNumbersVisible &&
				// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
				css`
					display: none;
				`}
		}
	}
`;

// FIXME: convert-props-syntax rule doesn't catch this
// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ReadOnlyEditorView = styled(EditorView)`
	/* We need to replicate padding from the inner prosemirror element in our read only state. That means we also need
  recompute max height excluding the child padding. */
	padding: ${(props) => getEditorInputVerticalPadding(props.isCompact)}px
		${editorInputHorizontalPadding}px;
	max-height: ${(props) => rowHeight * props.defaultMaxRows}px;

	> p {
		/* Prevent collapsing empty paragraphs */
		min-height: ${rowHeight}px;
	}
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const EditorControls = styled.div<{
	isSearch: boolean;
	isCompact: boolean;
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
}>((props) => ({
	alignItems: 'center',
	display: 'flex',
	flexShrink: 0,
	marginLeft: 'auto',
	marginRight: `${
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		props.isSearch
			? getEditorInputVerticalPadding(props.isCompact) - 1 // the search button needs the same vertical & horizontal spacing
			: editorInputHorizontalPadding - 3
	}px`,
	lineHeight: 'normal',
	position: 'sticky',
	top: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: `${rowHeight + 2 * getEditorInputVerticalPadding(props.isCompact)}px`,
}));
