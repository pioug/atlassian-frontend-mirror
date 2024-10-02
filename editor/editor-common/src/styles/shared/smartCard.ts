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
import { N0, N40 } from '@atlaskit/theme/colors';
import { N60A, Y300, Y75 } from '@atlaskit/theme/colors';
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
          background: ${token('color.background.accent.yellow.subtler', Y75)};
          border-bottom: 2px solid ${token('color.border.accent.yellow', Y300)};
          box-shadow: ${token(
						'elevation.shadow.overlay',
						`1px 2px 3px ${N60A}, -1px 2px 3px ${N60A}`,
					)};
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

		&.${akEditorSelectedNodeClassName} .${SmartCardSharedCssClassName.LOADER_WRAPPER} > a {
			${getSelectionStyles([SelectionStyle.BoxShadow])}
		}
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
			cursor: ${
				// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-registration
				fg('linking_platform_smart_links_in_live_pages') ? 'text' : 'pointer'
			};

			a {
				cursor: ${
					// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-registration
					fg('linking_platform_smart_links_in_live_pages') ? 'pointer' : 'auto'
				};
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
			background-color: ${token('color.background.neutral.subtle', N0)};
			border-radius: ${token('border.radius.200', '8px')};
			border: 1px solid ${token('color.border', N40)};
		}

		&.${akEditorSelectedNodeClassName} {
			.${DATASOURCE_INNER_CONTAINER_CLASSNAME} {
				${getSelectionStyles([SelectionStyle.BoxShadow])}

				${fg('platform-datasources-enable-two-way-sync')
					? `
					input::selection {
						background-color: ${token('color.background.selected.hovered')};
					}
					input::-moz-selection {
						background-color: ${token('color.background.selected.hovered')};
					}
				`
					: ''}
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
				cursor: ${
					// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-registration
					fg('linking_platform_smart_links_in_live_pages') ? 'pointer' : 'auto'
				};
			}
			&::after {
				transition: box-shadow 0s;
			}
		}

		&.${akEditorSelectedNodeClassName} .${SmartCardSharedCssClassName.LOADER_WRAPPER} > div::after {
			${getSelectionStyles([SelectionStyle.BoxShadow])}
		}

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
