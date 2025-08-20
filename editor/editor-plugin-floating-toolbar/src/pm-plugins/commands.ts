import { type INPUT_METHOD, type EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { browser } from '@atlaskit/editor-common/browser';
import {
	copyHTMLToClipboard,
	copyHTMLToClipboardPolyfill,
	getNodeCopiedAnalyticsPayload,
} from '@atlaskit/editor-common/clipboard';
import {
	copyDomNode,
	getSelectedNodeOrNodeParentByNodeType,
	toDOM,
} from '@atlaskit/editor-common/copy-button';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, type Transaction } from '@atlaskit/editor-prosemirror/state';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

export const copyNode =
	(
		nodeType: NodeType | Array<NodeType>,
		editorAnalyticsApi?: EditorAnalyticsAPI | undefined,
		inputMethod?: INPUT_METHOD,
	) =>
	({ tr }: { tr: Transaction }) => {
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
		if (expValEqualsNoExposure('platform_editor_block_menu', 'isEnabled', true)) {
			copyDomNode(domNode, contentNodeWithPos.node.type, tr.selection);
		} else {
			if (domNode) {
				const div = document.createElement('div');
				div.appendChild(domNode);

				// if copying inline content
				if (contentNodeWithPos.node.type.inlineContent) {
					// The "1 1" refers to the start and end depth of the slice
					// since we're copying the text inside a paragraph, it will always be 1 1
					// https://github.com/ProseMirror/prosemirror-view/blob/master/src/clipboard.ts#L32
					// Ignored via go/ees005
					// eslint-disable-next-line @atlaskit/editor/no-as-casting
					(div.firstChild as HTMLElement).setAttribute('data-pm-slice', '1 1 []');
				} else {
					// The "0 0" refers to the start and end depth of the slice
					// since we're copying the block node only, it will always be 0 0
					// https://github.com/ProseMirror/prosemirror-view/blob/master/src/clipboard.ts#L32
					// Ignored via go/ees005
					// eslint-disable-next-line @atlaskit/editor/no-as-casting
					(div.firstChild as HTMLElement).setAttribute('data-pm-slice', '0 0 []');
				}
				// ED-17083 safari seems have bugs for extension copy because exntension do not have a child text(innerText) and it will not recognized as html in clipboard, this could be merge into one if this extension fixed children issue or safari fix the copy bug
				// MEX-2528 safari has a bug related to the mediaSingle node with border or link. The image tag within the clipboard is not recognized as HTML when using the ClipboardItem API. To address this, we have to switch to ClipboardPolyfill
				if (
					browser.safari &&
					tr.selection instanceof NodeSelection &&
					(tr.selection.node.type === schema.nodes.extension ||
						tr.selection.node.type === schema.nodes.mediaSingle)
				) {
					copyHTMLToClipboardPolyfill(div);
				} else {
					copyHTMLToClipboard(div);
				}
			}
		}

		if (editorAnalyticsApi) {
			const analyticsPayload = getNodeCopiedAnalyticsPayload(contentNodeWithPos.node, inputMethod);
			editorAnalyticsApi.attachAnalyticsEvent(analyticsPayload)(copyToClipboardTr);
		}

		copyToClipboardTr.setMeta('scrollIntoView', false);
		return copyToClipboardTr;
	};
