import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl, useIntl } from 'react-intl-next';

import { messages } from '@atlaskit/editor-common/block-menu';
import { copyHTMLToClipboard } from '@atlaskit/editor-common/clipboard';
import { toDOM, copyDomNode } from '@atlaskit/editor-common/copy-button';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment, DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { CellSelection } from '@atlaskit/editor-tables';
import { isTableSelected } from '@atlaskit/editor-tables/utils';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import CopyIcon from '@atlaskit/icon/core/copy';

import type { BlockMenuPlugin } from '../blockMenuPluginType';

interface CopyBlockMenuItemProps {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
}

const toDOMFromFragment = (fragment: Fragment, schema: Schema): Node => {
	return DOMSerializer.fromSchema(schema).serializeFragment(fragment);
};

const CopyBlockMenuItem = ({ api }: CopyBlockMenuItemProps & WrappedComponentProps) => {
	const { formatMessage } = useIntl();

	const copyHandler = (
		event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>,
	) => {
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

				const domNode = toDOMFromFragment(fragment, schema);
				const div = document.createElement('div');
				div.appendChild(domNode);
				copyHTMLToClipboard(div);
			}

			// for table
			if (isTableSelected(selection)) {
				const nodeType = schema.nodes.table;
				const tableNode = (selection as CellSelection).$anchorCell.node(-1);
				if (!tableNode) {
					return;
				}
				const domNode = toDOM(tableNode, schema);
				copyDomNode(domNode, nodeType, selection);
			}

			// for other nodes
			if (selection instanceof NodeSelection) {
				const nodeType = selection.node.type;
				const domNode = toDOM(selection.node, schema);
				copyDomNode(domNode, nodeType, selection);
			}

			// close the block menu after copying
			api?.core.actions.execute(api?.blockControls?.commands.toggleBlockMenu({ closeMenu: true }));
			api?.core.actions.focus();
		}
	};

	return (
		<ToolbarDropdownItem elemBefore={<CopyIcon label="" />} onClick={(e) => copyHandler(e)}>
			{formatMessage(messages.copyBlock)}
		</ToolbarDropdownItem>
	);
};

export default injectIntl(CopyBlockMenuItem);
