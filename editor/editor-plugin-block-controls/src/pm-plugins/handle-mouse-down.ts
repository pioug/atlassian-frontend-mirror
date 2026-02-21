import { DRAG_HANDLE_SELECTOR } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { BlockControlsPlugin } from '../blockControlsPluginType';

export const handleMouseDown =
	(api?: ExtractInjectionAPI<BlockControlsPlugin>) =>
	(view: EditorView, event: MouseEvent): boolean => {
		if (!(event.target instanceof HTMLElement)) {
			return false;
		}

		if (!view.editable) {
			const targetPos = view.posAtDOM(event.target, 0);
			// always fetch top level position for mouseDown to avoid drag handle positions being incorrect
			const rootPos = view.state.doc.resolve(targetPos).before(1);
			const rootNode = view.state.doc.nodeAt(rootPos);

			if (!rootNode) {
				return false;
			}

			if (expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true)) {
				const anchorName = api?.core.actions.getAnchorIdForNode(rootNode, rootPos);

				// don't show the handles if we can't find an anchor
				if (!anchorName) {
					return false;
				}

				api?.core.actions.execute(
					api?.blockControls.commands.showDragHandleAt(
						rootPos,
						anchorName,
						rootNode.type.name ?? '',
						undefined,
						rootPos,
						anchorName,
						rootNode.type.name ?? '',
					),
				);
			} else {
				api?.core.actions.execute(
					api?.blockControls.commands.showDragHandleAt(
						rootPos,
						'',
						rootNode.type.name ?? '',
						undefined,
						rootPos,
						'',
						rootNode.type.name ?? '',
					),
				);
			}
		} else {
			const isDragHandle =
				event.target.closest(
					expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
						? DRAG_HANDLE_SELECTOR
						: '[data-editor-block-ctrl-drag-handle]',
				) !== null;

			api?.core.actions.execute(({ tr }) => {
				api?.blockControls.commands.setSelectedViaDragHandle(isDragHandle)({ tr });
				/**
				 * When block menu is enabled, reset intent back to 'default' as editor-plugin-block-menu sets the user intent to 'blockMenuOpen', and setting here
				 * causes flickering as this runs before editor-plugin-block-menu.
				 */
				if (expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)) {
					// if target is drag handle, block menu will be opened
					if (!isDragHandle) {
						api?.userIntent?.commands.setCurrentUserIntent('default')({ tr });
					}
				} else {
					api.userIntent?.commands.setCurrentUserIntent(
						isDragHandle ? 'dragHandleSelected' : 'default',
					)({ tr });
				}
				return tr;
			});
		}

		return false;
	};
