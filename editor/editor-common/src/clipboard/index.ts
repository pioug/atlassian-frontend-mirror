// Ignored via go/ees005
// eslint-disable-next-line import/no-namespace
import * as clipboard from 'clipboard-polyfill';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';

import type {
	AnalyticsEventPayload,
	INPUT_METHOD,
	SelectCellAEP,
	SelectNodeAEP,
	SelectRangeAEP,
} from '../analytics';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../analytics';
import {
	getAllSelectionAnalyticsPayload,
	getCellSelectionAnalyticsPayload,
	getNodeSelectionAnalyticsPayload,
	getRangeSelectionAnalyticsPayload,
} from '../selection';

const isClipboardApiSupported = () =>
	!!navigator.clipboard && typeof navigator.clipboard.writeText === 'function';

const isIEClipboardApiSupported = () =>
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(window as any).clipboardData && typeof (window as any).clipboardData.setData === 'function';

const isExtensionNode = (node?: string) => {
	if (
		node === 'extension' ||
		node === 'bodiedExtension' ||
		node === 'inlineExtension' ||
		node === 'multiBodiedExtension'
	) {
		return true;
	}
	return false;
};

export const copyToClipboard = async (textToCopy: string) => {
	if (isClipboardApiSupported()) {
		try {
			await navigator.clipboard.writeText(textToCopy);
		} catch (error) {
			throw new Error('Clipboard api is not supported');
		}
	} else if (isIEClipboardApiSupported()) {
		try {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			await (window as any).clipboardData.setData('text', textToCopy);
		} catch (error) {
			throw new Error('IE clipboard api is not supported');
		}
	} else {
		throw new Error('Clipboard api is not supported');
	}
};

export const copyHTMLToClipboard = async (elementToCopy: HTMLElement, plainTextToCopy?: string) => {
	// @ts-ignore
	if (isClipboardApiSupported() && typeof ClipboardItem !== 'undefined') {
		try {
			const data = new ClipboardItem({
				'text/plain': new Blob([plainTextToCopy || elementToCopy.innerText], {
					type: 'text/plain',
				}),
				'text/html': new Blob([elementToCopy.innerHTML], {
					type: 'text/html',
				}),
			});
			// @ts-ignore
			await navigator.clipboard.write([data]);
		} catch (error) {
			throw new Error('Clipboard api is not supported');
		}
	} else if (!!document && typeof document === 'object') {
		try {
			// ED-17083 extension copy seems have issue with ClipboardItem API
			// Hence of use of this polyfill
			copyHTMLToClipboardPolyfill(elementToCopy, plainTextToCopy);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error);
		}
	}
};

// At the time of development, Firefox doesn't support ClipboardItem API
// Hence of use of this polyfill
export const copyHTMLToClipboardPolyfill = async (
	elementToCopy: HTMLElement,
	plainTextToCopy?: string,
) => {
	const dt = new clipboard.ClipboardItem({
		'text/html': new Blob([elementToCopy.innerHTML], { type: 'text/html' }),
		'text/plain': new Blob([plainTextToCopy || elementToCopy.innerText], { type: 'text/plain' }),
	});
	await clipboard.write([dt]);
};

export const getAnalyticsPayload = (
	state: EditorState,
	action: ACTION.CUT | ACTION.COPIED,
): AnalyticsEventPayload | undefined => {
	const { selection, doc } = state;
	const selectionAnalyticsPayload =
		getNodeSelectionAnalyticsPayload(selection) ||
		getRangeSelectionAnalyticsPayload(selection, doc) ||
		getAllSelectionAnalyticsPayload(selection) ||
		getCellSelectionAnalyticsPayload(state);

	if (selectionAnalyticsPayload) {
		const { actionSubjectId: selectionActionSubjectId } = selectionAnalyticsPayload;

		const node = (selectionAnalyticsPayload as SelectNodeAEP).attributes?.node;
		const content: string[] = [];
		let extensionType: string | undefined;
		let extensionKey: string | undefined;
		switch (selectionActionSubjectId) {
			case ACTION_SUBJECT_ID.NODE:
				if (node) {
					content.push(node);
					if (isExtensionNode(node)) {
						extensionType = (selection as NodeSelection).node.attrs.extensionType;
						extensionKey = (selection as NodeSelection).node.attrs.extensionKey;
					}
				}
				break;
			case ACTION_SUBJECT_ID.RANGE:
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				content.push(...(selectionAnalyticsPayload as SelectRangeAEP).attributes!.nodes);
				break;
			case ACTION_SUBJECT_ID.ALL:
				content.push('all');
				break;
			case ACTION_SUBJECT_ID.CELL: {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const { selectedCells } = (selectionAnalyticsPayload as SelectCellAEP).attributes!;
				content.push(...Array(selectedCells).fill('tableCell'));
				break;
			}
		}

		if (isExtensionNode(node)) {
			return {
				eventType: EVENT_TYPE.TRACK,
				action,
				actionSubject: ACTION_SUBJECT.DOCUMENT,
				attributes: {
					content,
					extensionKey,
					extensionType,
				},
			};
		}

		return {
			eventType: EVENT_TYPE.TRACK,
			action,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			attributes: {
				content,
			},
		};
	}

	if (selection instanceof TextSelection && selection.$cursor) {
		return {
			eventType: EVENT_TYPE.TRACK,
			action,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			attributes: {
				content: ['caret'],
			},
		};
	}
};

export const getNodeCopiedAnalyticsPayload = (
	node: PMNode,
	inputMethod?: INPUT_METHOD,
): AnalyticsEventPayload => {
	const nodeType = node.type.name;
	let extensionType: string | undefined;
	let extensionKey: string | undefined;

	if (isExtensionNode(nodeType)) {
		extensionType = node.attrs.extensionType;
		extensionKey = node.attrs.extensionKey;
	}

	const payload: AnalyticsEventPayload = {
		eventType: EVENT_TYPE.TRACK,
		action: ACTION.COPIED,
		actionSubject: ACTION_SUBJECT.DOCUMENT,
		attributes: {
			content: [nodeType],
			inputMethod,
			nodeType,
			...(extensionType ? { extensionType } : {}),
			...(extensionKey ? { extensionKey } : {}),
		},
	};

	return payload;
};
