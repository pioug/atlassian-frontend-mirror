import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import {
	getContentPropertyIdFromAri,
	getPageIdFromAri,
} from '../ui/extensions/synced-block/utils/ari';
import {
	getContentProperty,
	updateContentProperty,
} from '../ui/extensions/synced-block/utils/content-property';
import {
	parseSyncedBlockContentPropertyValue,
	stringifySyncedBlockContentPropertyValue,
} from '../ui/extensions/synced-block/utils/synced-block';

const transformer = new JSONTransformer();
const toJSON = (node: PMNode) => transformer.encodeNode(node);

const getCacheKey = ({
	sourceDocumentAri,
	contentAri,
	contentPropertyKey,
}: {
	contentAri: string;
	contentPropertyKey: string;
	sourceDocumentAri: string;
}) => `${sourceDocumentAri}-${contentAri}-${contentPropertyKey}`;

type RequestState = {
	isSending: boolean;
	pendingValue: string | null;
	timeout: NodeJS.Timeout | null;
};

export class SyncClient {
	private requestMap = new Map<string, RequestState>();

	constructor() {
		this.requestMap = new Map();
	}

	private getRequestState(key: string): RequestState | undefined {
		return this.requestMap.get(key);
	}

	private setRequestState(key: string, state: RequestState) {
		this.requestMap.set(key, state);
	}

	private async sendRequest({
		sourceDocumentAri,
		contentAri,
		contentPropertyKey,
		value,
	}: {
		contentAri: string;
		contentPropertyKey: string;
		sourceDocumentAri: string;
		value: string;
	}) {
		const pageId = getPageIdFromAri(sourceDocumentAri);
		const contentPropertyId = getContentPropertyIdFromAri(contentAri);

		try {
			const contentProperty = await getContentProperty({ pageId, contentPropertyId });

			const updatedValue = stringifySyncedBlockContentPropertyValue({
				...parseSyncedBlockContentPropertyValue(contentProperty.value),
				...JSON.parse(value),
			});

			await updateContentProperty({
				pageId,
				key: contentPropertyKey,
				value: updatedValue,
				signal: undefined,
			});
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('Failed to update content property:', error);
		}
	}

	public syncContent({
		sourceDocumentAri,
		contentAri,
		contentPropertyKey,
		node,
	}: {
		contentAri: string;
		contentPropertyKey: string;
		node: PMNode;
		sourceDocumentAri: string;
	}) {
		const nodeAdf = toJSON(node);

		const key = getCacheKey({ sourceDocumentAri, contentAri, contentPropertyKey });
		const value = stringifySyncedBlockContentPropertyValue({ adf: nodeAdf });

		const requestState = this.getRequestState(key) || {
			timeout: null,
			pendingValue: null,
			isSending: false,
		};

		requestState.pendingValue = value;

		if (requestState.isSending) {
			return;
		}

		if (requestState.timeout) {
			clearTimeout(requestState.timeout);
		}

		const send = async () => {
			if (requestState.isSending) {
				return;
			}

			requestState.isSending = true;

			try {
				await this.sendRequest({
					sourceDocumentAri,
					contentAri,
					contentPropertyKey,
					value: requestState.pendingValue || '',
				});
				requestState.pendingValue = null;
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error('Failed to send synced block content:', error);
			} finally {
				requestState.isSending = false;
			}
		};

		requestState.timeout = setTimeout(send, 1000);
		this.setRequestState(key, requestState);
	}
}
