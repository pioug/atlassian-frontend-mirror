import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { ACTION, ACTION_SUBJECT, EVENT_TYPE, type FireAnalyticsCallback } from '../../analytics';
import type {
	DefaultTransformerResultCallback,
	InferTransformerResultCallback,
	Transformer,
} from '../../types';

const transformer = new JSONTransformer();
export function toJSON(node: PMNode): JSONDocNode {
	return transformer.encode(node);
}

/**
 * This throttles the callback with requestIdleCallback.
 */
export function createThrottleSchedule<
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	GenericTransformer extends Transformer<any> = Transformer<JSONDocNode>,
>(callback: typeof returnDocumentRequest<GenericTransformer>) {
	let frameId: number | undefined;
	let lastArgs: Parameters<typeof returnDocumentRequest<GenericTransformer>> | undefined;
	const delayedCallbacks: Parameters<typeof returnDocumentRequest<GenericTransformer>>[] = [];

	const wrapperFn = (...args: Parameters<typeof returnDocumentRequest<GenericTransformer>>) => {
		const lastArgsBefore = lastArgs;
		lastArgs = args;
		if (frameId) {
			if (lastArgsBefore) {
				const [_v, _c, _t, _f, alwaysFire] = lastArgsBefore;
				if (alwaysFire) {
					delayedCallbacks.push(lastArgsBefore);
				}
			}
			return;
		}

		// If `requestIdleCallback` doesn't exist - fallback to `requestAnimationFrame`
		const delayFunction = globalThis.requestIdleCallback ?? globalThis.requestAnimationFrame;

		frameId = delayFunction(
			() => {
				frameId = undefined;
				if (lastArgs) {
					delayedCallbacks.forEach((savedArgs) => {
						callback(...savedArgs);
					});
					callback(...lastArgs);
				}
			},
			{ timeout: 100 },
		);
	};

	return wrapperFn;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function returnDocumentRequest<GenericTransformer extends Transformer<any> | undefined>(
	editorView: EditorView | null,
	callback: GenericTransformer extends undefined
		? DefaultTransformerResultCallback
		: InferTransformerResultCallback<GenericTransformer>,
	transformer?: GenericTransformer,
	fireAnalyticsEvent?: FireAnalyticsCallback,
	// eslint-disable-next-line no-unused-vars
	_alwaysFire?: boolean,
) {
	const { doc, schema } = editorView?.state ?? {};
	if (!doc || !schema) {
		return undefined;
	}

	try {
		const json = toJSON(doc);

		if (typeof transformer === 'undefined') {
			callback(json);
		} else {
			const nodeSanitized = PMNode.fromJSON(schema, json);
			callback(transformer.encode(nodeSanitized));
		}
	} catch (e) {
		fireAnalyticsEvent?.({
			payload: {
				action: ACTION.DOCUMENT_PROCESSING_ERROR,
				actionSubject: ACTION_SUBJECT.EDITOR,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: {
					errorMessage: `${
						e instanceof Error && e.name === 'NodeNestingTransformError'
							? 'NodeNestingTransformError - Failed to transform one or more nested tables'
							: undefined
					}`,
				},
			},
		});
		throw e;
	}
}

export function returnDocumentRequestNoThrowError<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	GenericTransformer extends Transformer<any> | undefined,
>(
	editorView: EditorView | null,
	callback: GenericTransformer extends undefined
		? DefaultTransformerResultCallback
		: InferTransformerResultCallback<GenericTransformer>,
	transformer?: GenericTransformer,
	fireAnalyticsEvent?: FireAnalyticsCallback,
	_alwaysFire?: boolean,
) {
	try {
		return returnDocumentRequest(
			editorView,
			callback,
			transformer,
			fireAnalyticsEvent,
			_alwaysFire,
		);
		// eslint-disable-next-line no-unused-vars
	} catch (_) {
		callback(undefined);
	}
}
