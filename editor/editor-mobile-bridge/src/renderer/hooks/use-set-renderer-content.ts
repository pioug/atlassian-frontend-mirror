import { useLayoutEffect, useState } from 'react';

import {
  EmitterEvents,
  eventDispatcher as mobileBridgeEventDispatcher,
} from '../dispatcher';
import { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { getEmptyADF } from '@atlaskit/adf-utils/empty-adf';
import { Serialized } from '../../types';
import type { DocNode } from '@atlaskit/adf-schema';

function parseContent(
  content: Serialized<JSONDocNode>,
): JSONDocNode | undefined {
  if (typeof content === 'string') {
    try {
      return JSON.parse(content) as JSONDocNode;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
    return;
  }
  return content;
}

export function useRendererContent(
  initialDocument: string | JSONDocNode,
): DocNode {
  const [document, setDocument] = useState<JSONDocNode>(() => {
    const content = parseContent(initialDocument);
    if (content) {
      return content;
    }
    return getEmptyADF() as DocNode;
  });

  useLayoutEffect(() => {
    const updateDocument = (payload?: { content: string | JSONDocNode }) => {
      if (!payload) {
        return;
      }

      const content = parseContent(payload.content);
      if (content) {
        setDocument(content);
      }
    };

    mobileBridgeEventDispatcher.on(
      EmitterEvents.SET_RENDERER_CONTENT,
      updateDocument,
    );

    return () => {
      mobileBridgeEventDispatcher.off(
        EmitterEvents.SET_RENDERER_CONTENT,
        updateDocument,
      );
    };
  }, []);

  return document as DocNode;
}
