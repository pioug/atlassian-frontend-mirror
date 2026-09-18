import type { INPUT_METHOD, EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { getNodeCopiedAnalyticsPayload } from '@atlaskit/editor-common/clipboard';
import {
	copyDomNode,
	getSelectedNodeOrNodeParentByNodeType,
	toDOM,
} from '@atlaskit/editor-common/copy-button';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
export const copyNode =
	(
		nodeType: NodeType | Array<NodeType>,
		editorAnalyticsApi?: EditorAnalyticsAPI | undefined,
		inputMethod?: INPUT_METHOD,
	) =>
	({ tr }: { tr: Transaction }): Transaction => {
		// const { tr, schema } = state;

		// This command should only be triggered by the Copy button in the floating toolbar
		// which is only visible when selection is inside the target node
		const contentNodeWithPos = getSelectedNodeOrNodeParentByNodeType({
			nodeType,
			selection: tr.selection,
		});
		if (!contentNodeWithPos) {
			return tr;
		}
		const schema = tr.doc.type.schema;
		const copyToClipboardTr = tr;

		const domNode = toDOM(contentNodeWithPos.node, schema);
		copyDomNode(domNode, contentNodeWithPos.node.type, tr.selection);

		if (editorAnalyticsApi) {
			const analyticsPayload = getNodeCopiedAnalyticsPayload(contentNodeWithPos.node, inputMethod);
			editorAnalyticsApi.attachAnalyticsEvent(analyticsPayload)(copyToClipboardTr);
		}

		copyToClipboardTr.setMeta('scrollIntoView', false);
		return copyToClipboardTr;
	};
