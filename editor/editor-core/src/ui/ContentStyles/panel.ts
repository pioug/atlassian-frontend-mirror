// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { PanelSharedCssClassName, panelSharedStyles } from '@atlaskit/editor-common/panel';
import {
	akEditorDeleteBackground,
	akEditorDeleteBackgroundWithOpacity,
	akEditorDeleteBorder,
	akEditorDeleteIconColor,
	akEditorSelectedBorderSize,
	akEditorSelectedNodeClassName,
	getSelectionStyles,
	SelectionStyle,
} from '@atlaskit/editor-shared-styles';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Needs manual remediation due to mixin usage
export const panelStyles = () => css`
	.ProseMirror {
		.${PanelSharedCssClassName.prefix} {
			cursor: pointer;

			/* Danger when top level node */
			&.danger {
				box-shadow: 0 0 0 ${akEditorSelectedBorderSize}px ${akEditorDeleteBorder};
				background-color: ${token('color.background.danger', akEditorDeleteBackground)} !important;

				.${PanelSharedCssClassName.icon} {
					color: ${token('color.icon.danger', akEditorDeleteIconColor)} !important;
				}
			}
		}

		.${PanelSharedCssClassName.content} {
			cursor: text;
		}

		/* Danger when nested node */
		.danger .${PanelSharedCssClassName.prefix} {
			&[data-panel-type] {
				background-color: ${token('color.blanket.danger', akEditorDeleteBackgroundWithOpacity)};

				.${PanelSharedCssClassName.icon} {
					color: ${token('color.icon.danger', akEditorDeleteIconColor)};
				}
			}
		}

		${panelSharedStyles()};
	}

	.${PanelSharedCssClassName.prefix}.${akEditorSelectedNodeClassName}:not(.danger) {
		${getSelectionStyles([SelectionStyle.BoxShadow, SelectionStyle.Blanket])}
	}

	${editorExperiment('nested-dnd', true) &&
	`.ak-editor-content-area.appearance-full-page .ProseMirror .ak-editor-panel .${PanelSharedCssClassName.icon} {
			padding-right: ${token('space.150', '12px')};
		}`};

	/* Don't want extra padding for inline editor (nested) */
	${editorExperiment('nested-dnd', true) &&
	`.ak-editor-content-area .ak-editor-content-area .ProseMirror .ak-editor-panel .${PanelSharedCssClassName.icon} {
		padding-right: ${token('space.100', '8px')};
	}`};
`;
