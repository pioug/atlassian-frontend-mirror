import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { ACTION, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { browser } from '@atlaskit/editor-common/browser';
import {
	copyHTMLToClipboard,
	copyHTMLToClipboardPolyfill,
	getAnalyticsPayload,
} from '@atlaskit/editor-common/clipboard';
import { getSelectedNodeOrNodeParentByNodeType, toDOM } from '@atlaskit/editor-common/copy-button';
import type { ExtractInjectionAPI, Command, CommandDispatch } from '@atlaskit/editor-common/types';
import type { HoverDecorationHandler } from '@atlaskit/editor-plugin-decorations';
import type { MarkType, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';

import type { CopyButtonPlugin } from '../copyButtonPluginType';

import { copyButtonPluginKey } from './plugin-key';

export function createToolbarCopyCommandForMark(
	markType: MarkType,
	editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): Command {
	function command(state: EditorState, dispatch: CommandDispatch | undefined) {
		const textNode = state.tr.selection.$head.parent.maybeChild(state.tr.selection.$head.index());

		if (!textNode) {
			return false;
		}

		if (dispatch) {
			// As calling copyHTMLToClipboard causes side effects -- we only run this when
			// dispatch is provided -- as otherwise the consumer is only testing to see if
			// the action is availble.
			const domNode = toDOM(textNode, state.schema);
			if (domNode) {
				const div = document.createElement('div');
				const p = document.createElement('p');
				div.appendChild(p);
				p.appendChild(domNode);
				// The "1 1" refers to the start and end depth of the slice
				// since we're copying the text inside a paragraph, it will always be 1 1
				// https://github.com/ProseMirror/prosemirror-view/blob/master/src/clipboard.ts#L32
				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				(div.firstChild as HTMLElement).setAttribute('data-pm-slice', '1 1 []');

				// If we're copying a hyperlink, we'd copy the url as the fallback plain text
				// Ignored via go/ees005
				// eslint-disable-next-line @atlaskit/editor/no-as-casting
				const linkUrl = (domNode as HTMLElement).getAttribute('href');

				copyHTMLToClipboard(div, markType.name === 'link' && linkUrl ? linkUrl : undefined);
			}

			const copyToClipboardTr = state.tr;
			copyToClipboardTr.setMeta(copyButtonPluginKey, { copied: true });

			const analyticsPayload = getAnalyticsPayload(state, ACTION.COPIED);
			if (analyticsPayload && editorAnalyticsApi) {
				analyticsPayload.attributes.inputMethod = INPUT_METHOD.FLOATING_TB;
				analyticsPayload.attributes.markType = markType.name;
				editorAnalyticsApi?.attachAnalyticsEvent?.(analyticsPayload)(copyToClipboardTr);
			}

			dispatch(copyToClipboardTr);
		}

		return true;
	}

	return command;
}

export function getProvideMarkVisualFeedbackForCopyButtonCommand(markType: MarkType) {
	function provideMarkVisualFeedbackForCopyButtonCommand(
		state: EditorState,
		dispatch: CommandDispatch | undefined,
	) {
		const tr = state.tr;
		tr.setMeta(copyButtonPluginKey, { showSelection: true, markType });

		if (dispatch) {
			dispatch(tr);
		}

		return true;
	}
	return provideMarkVisualFeedbackForCopyButtonCommand;
}

export function removeMarkVisualFeedbackForCopyButtonCommand(
	state: EditorState,
	dispatch: CommandDispatch | undefined,
) {
	const tr = state.tr;
	tr.setMeta(copyButtonPluginKey, { removeSelection: true });

	const copyButtonState = copyButtonPluginKey.getState(state);
	if (copyButtonState?.copied) {
		tr.setMeta(copyButtonPluginKey, { copied: false });
	}

	if (dispatch) {
		dispatch(tr);
	}

	return true;
}

export const createToolbarCopyCommandForNode =
	(
		nodeType: NodeType | Array<NodeType>,
		editorAnalyticsApi: EditorAnalyticsAPI | undefined,
		api: ExtractInjectionAPI<CopyButtonPlugin> | undefined,
		onClickMessage?: string,
	): Command =>
	(state, dispatch) => {
		const { tr, schema } = state;

		// This command should only be triggered by the Copy button in the floating toolbar
		// which is only visible when selection is inside the target node
		const contentNodeWithPos = getSelectedNodeOrNodeParentByNodeType({
			nodeType,
			selection: tr.selection,
		});
		if (!contentNodeWithPos) {
			return false;
		}

		const copyToClipboardTr = tr;
		copyToClipboardTr.setMeta(copyButtonPluginKey, { copied: true });

		const analyticsPayload = getAnalyticsPayload(state, ACTION.COPIED);
		if (analyticsPayload && editorAnalyticsApi) {
			analyticsPayload.attributes.inputMethod = INPUT_METHOD.FLOATING_TB;
			analyticsPayload.attributes.nodeType = contentNodeWithPos.node.type.name;
			editorAnalyticsApi?.attachAnalyticsEvent?.(analyticsPayload)(copyToClipboardTr);
		}
		if (dispatch) {
			// As calling copyHTMLToClipboard causes side effects -- we only run this when
			// dispatch is provided -- as otherwise the consumer is only testing to see if
			// the action is availble.
			const domNode = toDOM(contentNodeWithPos.node, schema);
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
					state.selection instanceof NodeSelection &&
					(state.selection.node.type === state.schema.nodes.extension ||
						state.selection.node.type === state.schema.nodes.mediaSingle)
				) {
					copyHTMLToClipboardPolyfill(div);
				} else {
					copyHTMLToClipboard(div);
				}
			}
			copyToClipboardTr.setMeta('scrollIntoView', false);
			dispatch(copyToClipboardTr);
		}

		/**
		 * A11y-10275 This prop api drilled from the plugin all the way down to the usage
		 * because it's the safest way to ensure accessibilityUtils is available and not
		 * undefined.
		 *
		 * see thread https://atlassian.slack.com/archives/C02CDUS3SUS/p1744256326459569
		 */
		if (onClickMessage && fg('editor_a11y_aria_announcement_for_copied_status')) {
			api?.accessibilityUtils?.actions.ariaNotify(onClickMessage, { priority: 'important' });
		}

		return true;
	};

export const resetCopiedState =
	(
		nodeType: NodeType | Array<NodeType>,
		hoverDecoration: HoverDecorationHandler | undefined,
		onMouseLeave?: Command,
	): Command =>
	(state, dispatch) => {
		let customTr = state.tr;

		// Avoid multipe dispatch
		// https://product-fabric.atlassian.net/wiki/spaces/E/pages/2241659456/All+about+dispatch+and+why+there+shouldn+t+be+multiple#How-do-I-avoid-them%3F
		const customDispatch = (tr: Transaction) => {
			customTr = tr;
		};

		onMouseLeave
			? onMouseLeave(state, customDispatch)
			: hoverDecoration?.(nodeType, false)(state, customDispatch);

		const copyButtonState = copyButtonPluginKey.getState(state);
		if (copyButtonState?.copied) {
			customTr.setMeta(copyButtonPluginKey, { copied: false });
		}

		if (dispatch) {
			dispatch(customTr);
		}

		return true;
	};
