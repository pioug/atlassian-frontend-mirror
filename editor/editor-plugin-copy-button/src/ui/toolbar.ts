import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import commonMessages from '@atlaskit/editor-common/messages';
import type {
	Command,
	FloatingToolbarButton,
	FloatingToolbarItem,
	FloatingToolbarSeparator,
	MarkOptions,
	NodeOptions,
} from '@atlaskit/editor-common/types';
import type { HoverDecorationHandler } from '@atlaskit/editor-plugin-decorations';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import CopyIcon from '@atlaskit/icon/core/migration/copy';

import {
	createToolbarCopyCommandForMark,
	createToolbarCopyCommandForNode,
	getProvideMarkVisualFeedbackForCopyButtonCommand,
	removeMarkVisualFeedbackForCopyButtonCommand,
	resetCopiedState,
} from '../pm-plugins/commands';
import { copyButtonPluginKey } from '../pm-plugins/plugin-key';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSeparator(item: any): item is FloatingToolbarSeparator {
	return item?.type === 'separator';
}

function isNodeOptions(options: MarkOptions | NodeOptions): options is NodeOptions {
	return 'nodeType' in options && options.nodeType !== undefined;
}

export function getCopyButtonConfig(
	options: MarkOptions | NodeOptions,
	hoverDecoration: HoverDecorationHandler | undefined,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): FloatingToolbarButton<Command> {
	const { state, formatMessage, onMouseEnter, onMouseLeave, onFocus, onBlur } = options;
	const copyButtonState = copyButtonPluginKey.getState(state);

	let buttonActionHandlers;

	if (isNodeOptions(options)) {
		buttonActionHandlers = {
			onClick: createToolbarCopyCommandForNode(options.nodeType, editorAnalyticsApi),

			// Note for future changes: these two handlers should perform
			// the same action.
			onMouseEnter:
				onMouseEnter || hoverDecoration?.(options.nodeType, true, 'ak-editor-selected-node'),
			onFocus: onFocus || hoverDecoration?.(options.nodeType, true, 'ak-editor-selected-node'),

			// Note for future changes: these two handlers should perform
			// the same action.
			onMouseLeave: resetCopiedState(options.nodeType, hoverDecoration, onMouseLeave),
			onBlur: resetCopiedState(options.nodeType, hoverDecoration, onBlur),
		};
	} else {
		buttonActionHandlers = {
			onClick: createToolbarCopyCommandForMark(options.markType, editorAnalyticsApi),

			onMouseEnter: getProvideMarkVisualFeedbackForCopyButtonCommand(options.markType),
			onFocus: getProvideMarkVisualFeedbackForCopyButtonCommand(options.markType),

			onMouseLeave: removeMarkVisualFeedbackForCopyButtonCommand,
			onBlur: removeMarkVisualFeedbackForCopyButtonCommand,
		};
	}

	return {
		id: 'editor.floatingToolbar.copy',
		type: 'button',
		appearance: 'subtle',
		icon: CopyIcon,
		title: formatMessage(
			copyButtonState?.copied ? commonMessages.copiedToClipboard : commonMessages.copyToClipboard,
		),

		...buttonActionHandlers,

		hideTooltipOnClick: false,
		tabIndex: null,
	};
}

/**
 * Process floatingToolbar items for copyButton
 */
export const processCopyButtonItems =
	(editorAnalyticsApi?: EditorAnalyticsAPI | undefined) => (state: EditorState) => {
		return (
			items: Array<FloatingToolbarItem<Command>>,
			hoverDecoration: HoverDecorationHandler | undefined,
		): Array<FloatingToolbarItem<Command>> =>
			items.flatMap((item) => {
				switch (item.type) {
					case 'copy-button':
						if (item?.hidden) {
							return [];
						}
						return item?.items.map((copyButtonItem) =>
							isSeparator(copyButtonItem)
								? copyButtonItem
								: getCopyButtonConfig(copyButtonItem, hoverDecoration, editorAnalyticsApi),
						);
					default:
						return [item];
				}
			});
	};
