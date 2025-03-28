import commonMessages from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI, FloatingToolbarHandler } from '@atlaskit/editor-common/types';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import DeleteIcon from '@atlaskit/icon/core/migration/delete--editor-remove';

import type { ExpandPlugin } from '../types';

import { deleteExpand } from './commands';
import { findParentExpandNode } from './utils';

export const getToolbarConfig =
	(api: ExtractInjectionAPI<ExpandPlugin> | undefined): FloatingToolbarHandler =>
	(state, { formatMessage }) => {
		const { hoverDecoration } = api?.decorations?.actions ?? {};
		const editorAnalyticsAPI = api?.analytics?.actions;
		const selectedExpandNode = findParentExpandNode(state);

		if (selectedExpandNode) {
			const { nestedExpand, expand } = state.schema.nodes;
			return {
				title: 'Expand toolbar',
				getDomRef: (view) =>
					// Ignored via go/ees005
					// eslint-disable-next-line @atlaskit/editor/no-as-casting
					findDomRefAtPos(selectedExpandNode.pos, view.domAtPos.bind(view)) as HTMLElement,
				nodeType: [nestedExpand, expand],
				offset: [0, 6],
				items: [
					{
						type: 'copy-button',
						items: [
							{
								state,
								formatMessage,
								nodeType: [nestedExpand, expand],
							},
						],
					},
					{
						type: 'separator',
					},
					{
						id: 'editor.expand.delete',
						type: 'button',
						appearance: 'danger',
						focusEditoronEnter: true,
						icon: DeleteIcon,
						onClick: deleteExpand(editorAnalyticsAPI),
						onMouseEnter: hoverDecoration?.([nestedExpand, expand], true),
						onMouseLeave: hoverDecoration?.([nestedExpand, expand], false),
						onFocus: hoverDecoration?.([nestedExpand, expand], true),
						onBlur: hoverDecoration?.([nestedExpand, expand], false),
						title: formatMessage(commonMessages.remove),
						tabIndex: null,
					},
				],
			};
		}
		return;
	};
