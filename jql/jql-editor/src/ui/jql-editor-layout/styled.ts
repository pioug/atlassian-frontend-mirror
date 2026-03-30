// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, keyframes } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { fg } from '@atlaskit/platform-feature-flags';
import { layers } from '@atlaskit/theme/constants';
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

// eslint-disable-next-line @atlaskit/design-system/no-styled-tagged-template-expression, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const EditorMain = styled.div`
	/* CSS reset */
	font-family: ${token('font.family.body')};
	font-size: 14px;
	flex-grow: 1;

	/* These styles and animations are derived from @atlaskit/tooltip */

	.${TOOLTIP_CLASSNAME} {
		background-color: ${token('color.background.neutral.bold')};
		color: ${token('color.text.inverse')};
		border-radius: ${token('radius.small', '3px')};
		box-sizing: border-box;
		font: ${token('font.body.small')};
		line-height: 1.3;
		max-width: 240px;
		padding: ${token('space.025')} ${token('space.075')};
		word-wrap: break-word;
		overflow-wrap: break-word;
		z-index: ${layers.tooltip()};
		pointer-events: none;
		position: absolute;
		visibility: hidden;

		/* Horizontally center and vertically position above the target element */
		transform: translate(-50%, calc(-100% - ${token('space.200')}));

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
const rowHeight = 8 * 2.75;
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
		backgroundColor: token('color.background.input'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border.input'),
		borderRadius: token('radius.medium', '3px'),
		padding: token('border.width'),
		boxSizing: 'border-box',
		color: token('color.text'),
		display: 'flex',
		overflow: 'auto',
		transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	(props) =>
		props.editorViewIsInvalid &&
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		css({
			borderColor: token('color.border.danger'),
			boxShadow: `inset 0 0 0 ${token('border.width')} ${token('color.border.danger')}`,
		}),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-dynamic-styles -- Ignored via go/DSP-18766
	(props) =>
		props.editorViewHasFocus
			? // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css({
					backgroundColor: token('elevation.surface'),
					borderColor: token('color.border.focused'),
					boxShadow: `inset 0 0 0 ${token('border.width')} ${token('color.border.focused')}`,
				})
			: // eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css({
					'&:hover': {
						backgroundColor: token('color.background.input.hovered'),
					},
				}),
);

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const ReadOnlyEditorViewContainer = styled(EditorViewContainer)({
	backgroundColor: token('color.background.disabled'),
	color: token('color.text.disabled'),
	pointerEvents: 'none',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const LineNumberToolbar = styled.div<{ lineNumbersVisible: boolean }>(
	{
		backgroundColor: token('color.background.neutral'),
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
	defaultRows?: number;
	expandedRows: number;
	isCompact: boolean;
	lineNumbersVisible: boolean;
}>`
	counter-reset: lineNumber;
	flex-grow: 1;

	transition:
		height 250ms cubic-bezier(0.15, 1, 0.3, 1),
		max-height 250ms cubic-bezier(0.15, 1, 0.3, 1);
	max-height: ${(props) =>
		rowHeight * props.defaultMaxRows + getEditorInputVerticalPadding(props.isCompact) * 2}px;
	line-height: ${rowHeight / 14};
	${(props) =>
		props.defaultRows && fg('list_lovability_improving_filters')
			? 'height: ' +
				(rowHeight * props.defaultRows + getEditorInputVerticalPadding(props.isCompact) * 2) +
				'px;'
			: ''}
	${(props) =>
		props.defaultRows && fg('list_lovability_improving_filters')
			? 'min-height: ' +
				(rowHeight * props.defaultRows + getEditorInputVerticalPadding(props.isCompact) * 2) +
				'px;'
			: ''}
	font-family: ${token('font.family.code')};
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
		color: ${token('color.text')};
		padding: ${(props) => getEditorInputVerticalPadding(props.isCompact)}px
			${editorInputHorizontalPadding}px;

		&:focus {
			outline: none;
		}

		.mark-token-keyword {
			color: ${token('color.text.accent.purple')};
		}

		.mark-token-field {
			color: ${token('color.text.accent.blue')};
		}

		.mark-token-operator {
			color: ${token('color.text.accent.green')};
		}

		.mark-token-error {
			color: ${token('color.text.danger')};
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
			color: ${token('color.text.subtlest')};
			font-size: 10px;
			line-height: ${rowHeight / 10};
			padding: 0 ${token('space.100')} 0 ${token('space.025')};
			position: absolute;
			box-sizing: border-box;
			/* Shift the line number tag 100% (plus 8px padding) to the left to position it inside the LineNumberToolbar */
			transform: translateX(calc(-100% - ${token('space.100')}));

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
	isCompact: boolean;
	isSearch: boolean;
	isVisualRefresh?: boolean;
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
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: 'normal',
	position: 'sticky',
	top: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	height: `${rowHeight + 2 * getEditorInputVerticalPadding(props.isCompact)}px`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	gap: props.isVisualRefresh ? token('space.025') : 'unset',
}));
