// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import {
	BreakoutCssClassName,
	expandClassNames,
	sharedExpandStyles,
} from '@atlaskit/editor-common/styles';
import {
	akEditorSelectedNodeClassName,
	akLayoutGutterOffset,
	getSelectionStyles,
	SelectionStyle,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { N100A, N40A, N50A, R300, R50 } from '@atlaskit/theme/colors';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

const EXPAND_SELECTED_BACKGROUND = token(
	'color.background.neutral.subtle',
	'rgba(255, 255, 255, 0.6)',
);

const EXPAND_ICON_COLOR = () =>
	css({
		color: token('color.icon.subtle', N100A),
	});

const DANGER_STATE_BACKGROUND_COLOR = token('color.background.danger', R50);

const DANGER_STATE_BORDER_COLOR = token('color.border.danger', R300);

const firstNodeWithNotMarginTop = () =>
	editorExperiment('nested-dnd', true)
		? // eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression
			css`
				> :nth-child(1 of :not(style, .ProseMirror-gapcursor, .ProseMirror-widget, span)) {
					margin-top: 0;
				}

				> div.ak-editor-expand[data-node-type='nestedExpand'] {
					margin-top: ${token('space.050', '0.25rem')};
				}
			`
		: '';

/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Needs manual remediation
export const expandStyles = () => css`
	.${expandClassNames.icon} > div {
		display: flex;
	}

	.${expandClassNames.prefix} {
		${sharedExpandStyles.containerStyles({ expanded: false, focused: false })()}

		cursor: pointer;
		box-sizing: border-box;

		td > & {
			margin-top: 0;
		}

		.${expandClassNames.iconContainer} svg {
			${EXPAND_ICON_COLOR()};
			transform: rotate(90deg);
		}

		&.${akEditorSelectedNodeClassName}:not(.danger) {
			${getSelectionStyles([SelectionStyle.Blanket, SelectionStyle.Border])}
		}

		&.danger {
			background: ${DANGER_STATE_BACKGROUND_COLOR};
			border-color: ${DANGER_STATE_BORDER_COLOR};
		}
	}

	.ProseMirror
		> .${expandClassNames.type('expand')},
		.${BreakoutCssClassName.BREAKOUT_MARK_DOM}
		> .${expandClassNames.type('expand')} {
		margin-left: -${akLayoutGutterOffset + (editorExperiment('nested-dnd', true) ? 8 : 0)}px;
		margin-right: -${akLayoutGutterOffset + (editorExperiment('nested-dnd', true) ? 8 : 0)}px;
	}

	.${expandClassNames.content} {
		${sharedExpandStyles.contentStyles({ expanded: false, focused: false })()}
		cursor: text;
		padding-top: 0px;
		${fg('platform_editor_drag_and_drop_expand_style_fix') && `overflow-x: clip;`}
	}

	.${expandClassNames.titleInput} {
		${sharedExpandStyles.titleInputStyles()}
	}

	.${expandClassNames.titleContainer} {
		${sharedExpandStyles.titleContainerStyles()};
		align-items: center;
		overflow: visible;
	}

	.${expandClassNames.expanded} {
		background: ${EXPAND_SELECTED_BACKGROUND};
		border-color: ${token('color.border', N40A)};

		.${expandClassNames.content} {
			padding-top: ${token('space.100', '8px')};

			${firstNodeWithNotMarginTop()}
		}
	}

	.${expandClassNames.inputContainer} {
		width: 100%;
	}

	/* stylelint-disable property-no-unknown, value-keyword-case */
	.${expandClassNames.prefix}:(.${expandClassNames.expanded}) {
		.expand-content-wrapper {
			height: auto;
		}
	}
	/* stylelint-enable property-no-unknown, value-keyword-case */

	.${expandClassNames.prefix}:not(.${expandClassNames.expanded}) {
		.ak-editor-expand__content {
			position: absolute;
			height: 1px;
			width: 1px;
			overflow: hidden;
			clip: rect(1px, 1px, 1px, 1px);
			white-space: nowrap;
		}

		.${expandClassNames.iconContainer} svg {
			${EXPAND_ICON_COLOR()};
			transform: rotate(0deg);
		}

		&:not(.${akEditorSelectedNodeClassName}):not(.danger) {
			background: transparent;
			border-color: transparent;

			&:hover {
				border-color: ${token('color.border', N50A)};
				background: ${EXPAND_SELECTED_BACKGROUND};
			}
		}
	}
`;
