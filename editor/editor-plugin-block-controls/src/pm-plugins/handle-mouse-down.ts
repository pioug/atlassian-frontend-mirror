import { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { BlockControlsPlugin } from '../blockControlsPluginType';

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
		} else if (fg('platform_editor_controls_patch_5')) {
			const isDragHandle = event.target.closest('[data-editor-block-ctrl-drag-handle]') !== null;
			api?.core.actions.execute(api?.blockControls.commands.setSelectedViaDragHandle(isDragHandle));
		}

		return false;
	};
