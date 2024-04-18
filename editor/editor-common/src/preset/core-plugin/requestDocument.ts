import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { Transformer } from '../../types';

import type {
  DefaultTransformerResultCallback,
  InferTransformerResultCallback,
} from './types';

const transformer = new JSONTransformer();
export function toJSON(node: PMNode): JSONDocNode {
  return transformer.encode(node);
}

/**
 * This throttles the callback with requestIdleCallback.
 */
function createThrottleSchedule<
  GenericTransformer extends Transformer<any> = Transformer<JSONDocNode>,
>(callback: typeof returnDocumentRequest<GenericTransformer>) {
  let frameId: number | undefined;
  let lastArgs:
    | Parameters<typeof returnDocumentRequest<GenericTransformer>>
    | undefined;

  const wrapperFn = (
    ...args: Parameters<typeof returnDocumentRequest<GenericTransformer>>
  ) => {
    lastArgs = args;
    if (frameId) {
      return;
    }

    // If `requestIdleCallback` doesn't exist - fallback to `requestAnimationFrame`
    const delayFunction =
      globalThis.requestIdleCallback ?? globalThis.requestAnimationFrame;

    frameId = delayFunction(
      () => {
        frameId = undefined;
        if (lastArgs) {
          callback(...lastArgs);
        }
      },
      { timeout: 100 },
    );
  };

  return wrapperFn;
}

export const scheduleDocumentRequest = createThrottleSchedule(
  returnDocumentRequest,
);

function returnDocumentRequest<
  GenericTransformer extends Transformer<any> | undefined,
>(
  editorView: EditorView | null,
  callback: GenericTransformer extends undefined
    ? DefaultTransformerResultCallback
    : InferTransformerResultCallback<GenericTransformer>,
  transformer?: GenericTransformer,
) {
  const { doc, schema } = editorView?.state ?? {};
  if (!doc || !schema) {
    return undefined;
  }
  const json = toJSON(doc);

  if (typeof transformer === 'undefined') {
    callback(json);
  } else {
    const nodeSanitized = PMNode.fromJSON(schema, json);
    callback(transformer.encode(nodeSanitized));
  }
}
