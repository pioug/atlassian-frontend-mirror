import { DRAG_HANDLE_SELECTOR } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import type { BlockControlsPlugin } from '../blockControlsPluginType';

export const handleMouseDown =
	(api?: ExtractInjectionAPI<BlockControlsPlugin>) => (view: EditorView, event: MouseEvent) => {
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
		} else {
			const isDragHandle =
				event.target.closest(
					expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)
						? DRAG_HANDLE_SELECTOR
						: '[data-editor-block-ctrl-drag-handle]',
				) !== null;
			api?.core.actions.execute(api?.blockControls.commands.setSelectedViaDragHandle(isDragHandle));
		}

		return false;
	};
