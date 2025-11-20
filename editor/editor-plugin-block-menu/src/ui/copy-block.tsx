import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl, useIntl } from 'react-intl-next';

import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	type BlockMenuEventPayload,
} from '@atlaskit/editor-common/analytics';
import { copyHTMLToClipboard } from '@atlaskit/editor-common/clipboard';
import { toDOM, copyDomNode } from '@atlaskit/editor-common/copy-button';
import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment, DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { CellSelection } from '@atlaskit/editor-tables';
import { isTableSelected } from '@atlaskit/editor-tables/utils';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import CopyIcon from '@atlaskit/icon/core/copy';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

import { useBlockMenu } from './block-menu-provider';
import { BLOCK_MENU_ITEM_NAME } from './consts';

interface CopyBlockMenuItemProps {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
}

const toDOMFromFragment = (fragment: Fragment, schema: Schema): Node => {
	return DOMSerializer.fromSchema(schema).serializeFragment(fragment);
};

const CopyBlockMenuItem = ({ api }: CopyBlockMenuItemProps & WrappedComponentProps) => {
	const { formatMessage } = useIntl();
	const { onDropdownOpenChanged } = useBlockMenu();
	const copyHandler = (
		event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>,
	) => {
		api?.core.actions.execute(({ tr }) => {
			const payload: BlockMenuEventPayload = {
				action: ACTION.CLICKED,
				actionSubject: ACTION_SUBJECT.BLOCK_MENU_ITEM,
				attributes: {
					menuItemName: BLOCK_MENU_ITEM_NAME.COPY_CONTENT,
				},
				eventType: EVENT_TYPE.UI,
			};
			api?.analytics?.actions?.attachAnalyticsEvent(payload)(tr);
			return tr;
		});

		// prevent click event from bubbling up to the ancestor elements
		event.stopPropagation();
		// get the current selection
		const selection = api?.selection?.sharedState?.currentState()?.selection;

		if (selection) {
			const schema = selection.$from.doc.type.schema;
			// for texts and inline nodes
			if (selection instanceof TextSelection) {
				let fragment = selection?.content().content;

				if (!fragment) {
					return;
				}
				// if text is inside of a layout column, the selection contains the layoutSection and layoutColumn for some reason
				// But the layoutSection only contains the layoutColumn that the selected text is in, hence we can use the .firstChild
				if (fragment?.firstChild && fragment.firstChild.type.name === 'layoutSection') {
					const layoutSectionNode = fragment.firstChild;
					const layoutColumnNode = layoutSectionNode.firstChild;
					const layoutContent = layoutColumnNode?.firstChild;
					fragment = layoutContent?.content || Fragment.empty;
				}

				// if text is inside of an expand or extension, the selection contains an expand or extension for some reason
				// the expandNode or extensionNode always and only have one child, no matter how much contents are inside the expand or extension,
				// and the one child is the line that is being selected, so we can use the .firstChild again
				if (
					fragment?.firstChild &&
					(fragment.firstChild.type.name === 'expand' ||
						fragment.firstChild.type.name === 'bodiedExtension')
				) {
					const expandOrExtensionNode = fragment.firstChild;
					const actualNodeToCopy = expandOrExtensionNode.firstChild;
					fragment = Fragment.from(actualNodeToCopy) || Fragment.empty;
				}

				const domNode = toDOMFromFragment(fragment, schema);
				const div = document.createElement('div');
				div.appendChild(domNode);
				copyHTMLToClipboard(div);
			}

			// for table
			else if (isTableSelected(selection)) {
				const nodeType = schema.nodes.table;
				const tableNode = (selection as CellSelection).$anchorCell.node(-1);
				if (!tableNode) {
					return;
				}
				const domNode = toDOM(tableNode, schema);
				copyDomNode(domNode, nodeType, selection);
			}

			// for other nodes
			else if (selection instanceof NodeSelection) {
				const nodeType = selection.node.type;

				// code block is a special case where it is a block node but has inlineContent to true,
				// When nodeType.inlineContent is true, it will be treated as an inline node in the copyDomNode function,
				// but we want to treat it as a block node when copying, hence setting it to false here
				if (selection.node.type.name === 'codeBlock') {
					const codeBlockNodeType = { ...nodeType, inlineContent: false };
					const domNode = toDOM(selection.node, schema);
					copyDomNode(domNode, codeBlockNodeType as NodeType, selection);
				}
				// source sync block (bodiedSyncBlock) is also a special case
				// where we need to copy the content of the bodiedSyncBlock node
				else if (
					selection.node.type.name === 'bodiedSyncBlock' &&
					expValEquals('platform_synced_block', 'isEnabled', true)
				) {
					const bodiedSyncBlockNode = selection.node;
					const domNode = toDOMFromFragment(bodiedSyncBlockNode.content, schema);
					copyDomNode(domNode, bodiedSyncBlockNode.type, selection);
				}
				// for other nodes
				else {
					const domNode = toDOM(selection.node, schema);
					copyDomNode(domNode, nodeType, selection);
				}
			}

			// close the block menu after copying
			api?.core.actions.execute(api?.blockControls?.commands.toggleBlockMenu({ closeMenu: true }));

			onDropdownOpenChanged(false);
		}
	};

	return (
		<ToolbarDropdownItem elemBefore={<CopyIcon label="" />} onClick={copyHandler}>
			{formatMessage(blockMenuMessages.copyContent)}
		</ToolbarDropdownItem>
	);
};

export default injectIntl(CopyBlockMenuItem);
