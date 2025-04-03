import { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { BlockControlsPlugin } from '../blockControlsPluginType';

export const handleMouseDown =
	(api?: ExtractInjectionAPI<BlockControlsPlugin>) => (view: EditorView, event: MouseEvent) => {
		if (view.editable) {
			return false;
		}

		if (event.target instanceof HTMLElement) {
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
		}

		return false;
	};
