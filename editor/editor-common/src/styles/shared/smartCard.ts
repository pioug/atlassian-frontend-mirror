// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import {
	akEditorDeleteBackground,
	akEditorDeleteBorder,
	akEditorSelectedNodeClassName,
	getSelectionStyles,
	SelectionStyle,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import { SmartCardSharedCssClassName } from './smart-card';

export const DATASOURCE_INNER_CONTAINER_CLASSNAME = 'datasourceView-content-inner-wrap';

export const FLOATING_TOOLBAR_LINKPICKER_CLASSNAME = 'card-floating-toolbar--link-picker';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const smartCardStyles = () => css`
	.${SmartCardSharedCssClassName.INLINE_CARD_CONTAINER} {
		max-width: calc(100% - 20px);
		vertical-align: top;
		word-break: break-all;
		${fg('editor_inline_comments_on_inline_nodes')
			? `.card-with-comment {
          background: ${token('color.background.accent.yellow.subtler')};
          border-bottom: 2px solid ${token('color.border.accent.yellow')};
          box-shadow: ${token('elevation.shadow.overlay')};
        }`
			: ''}
		.card {
			padding-left: ${token('space.025', '2px')};
			padding-right: ${token('space.025', '2px')};
			padding-top: 0.5em;
			padding-bottom: 0.5em;
			margin-bottom: -0.5em;

			.${SmartCardSharedCssClassName.LOADER_WRAPPER} > a:focus {
				${getSelectionStyles([SelectionStyle.BoxShadow])}
			}
		}

		${editorExperiment('platform_editor_controls', 'variant1') ||
		expValEqualsNoExposure('platform_editor_preview_panel_linking_exp', 'isEnabled', true)
			? `[data-inlinecard-button-overlay='icon-wrapper-line-height'] span {
				line-height: 0;
			}`
			: ''}

		${expValEqualsNoExposure('platform_editor_find_and_replace_improvements', 'isEnabled', true)
			? `
				&.${akEditorSelectedNodeClassName}:not(.search-match-block) .${SmartCardSharedCssClassName.LOADER_WRAPPER} > a {
				${getSelectionStyles([SelectionStyle.BoxShadow])}
			}`
			: `
				&.${akEditorSelectedNodeClassName} .${SmartCardSharedCssClassName.LOADER_WRAPPER} > a {
				${getSelectionStyles([SelectionStyle.BoxShadow])}
			}`}
		.${SmartCardSharedCssClassName.LOADER_WRAPPER} > a {
			/* EDM-1717: box-shadow Safari fix start */
			z-index: 1;
			position: relative;
			/* EDM-1717: box-shadow Safari fix end */
		}

		&.danger {
			.${SmartCardSharedCssClassName.LOADER_WRAPPER} > a {
				box-shadow: 0 0 0 1px ${token('color.border.danger', akEditorDeleteBorder)};
				/* EDM-1717: box-shadow Safari fix start */
				z-index: 2;
				/* EDM-1717: box-shadow Safari fix end */
			}
		}
	}

	.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER} {
		.${SmartCardSharedCssClassName.LOADER_WRAPPER} > div {
			cursor: pointer;

			a {
				cursor: auto;
			}
		}

		&.${akEditorSelectedNodeClassName} .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div {
			${getSelectionStyles([SelectionStyle.BoxShadow])}
			border-radius: ${token('border.radius.200', '8px')};
		}

		&.danger {
			.${SmartCardSharedCssClassName.LOADER_WRAPPER} > div {
				box-shadow: 0 0 0 1px ${token('color.border.danger', akEditorDeleteBorder)} !important;
			}
		}
	}

	.${SmartCardSharedCssClassName.DATASOURCE_CONTAINER}.${SmartCardSharedCssClassName.BLOCK_CARD_CONTAINER} {
		max-width: 100%;
		display: flex;
		justify-content: center;

		.${DATASOURCE_INNER_CONTAINER_CLASSNAME} {
			cursor: pointer;
			background-color: ${token('color.background.neutral.subtle')};
			border-radius: ${token('border.radius.200', '8px')};
			border: 1px solid ${token('color.border')};
			overflow: hidden;
		}

		&.${akEditorSelectedNodeClassName} {
			.${DATASOURCE_INNER_CONTAINER_CLASSNAME} {
				${getSelectionStyles([SelectionStyle.BoxShadow])}

				input::selection {
					background-color: ${token('color.background.selected.hovered')};
				}
				input::-moz-selection {
					background-color: ${token('color.background.selected.hovered')};
				}
			}
		}

		&.danger {
			.${DATASOURCE_INNER_CONTAINER_CLASSNAME} {
				box-shadow: 0 0 0 1px ${token('color.border.danger', akEditorDeleteBorder)};
			}
		}
	}

	.${SmartCardSharedCssClassName.EMBED_CARD_CONTAINER} {
		.${SmartCardSharedCssClassName.LOADER_WRAPPER} > div {
			cursor: pointer;
			a {
				cursor: auto;
			}
			&::after {
				transition: box-shadow 0s;
			}
		}

		${expValEqualsNoExposure('platform_editor_find_and_replace_improvements', 'isEnabled', true)
			? `
				&.${akEditorSelectedNodeClassName}:not(.search-match-block) .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after {
					${getSelectionStyles([SelectionStyle.BoxShadow])}
				}
			`
			: `
				&.${akEditorSelectedNodeClassName} .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after {
					${getSelectionStyles([SelectionStyle.BoxShadow])}
				}
			`}

		&.danger {
			.media-card-frame::after {
				box-shadow: 0 0 0 1px ${token('color.border.danger', akEditorDeleteBorder)} !important;
				background: ${token('color.background.danger', akEditorDeleteBackground)} !important;
			}
			.richMedia-resize-handle-right::after,
			.richMedia-resize-handle-left::after {
				background: ${token('color.border.danger', akEditorDeleteBorder)};
			}
		}
	}

	.${FLOATING_TOOLBAR_LINKPICKER_CLASSNAME} {
		padding: 0;
	}
`;
