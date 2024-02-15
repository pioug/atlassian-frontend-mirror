import {
  transformDedupeMarks,
  transformIndentationMarks,
  transformInvalidMediaContent,
  transformMediaLinkMarks,
  transformNodesMissingContent,
  transformTextLinkCodeMarks,
} from '@atlaskit/adf-utils/transforms';
import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { ResolvedPos, Schema } from '@atlaskit/editor-prosemirror/model';
import { Node } from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  ReadonlyTransaction,
  TextSelection,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';

import type { DispatchAnalyticsEvent } from '../analytics';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../analytics';
import type { ProviderFactory } from '../provider-factory';
import type { ReplaceRawValue, Transformer } from '../types';

import { isEmptyParagraph } from './editor-core-utils';
import { sanitizeNodeForPrivacy } from './filter/privacy-filter';
import { findAndTrackUnsupportedContentNodes } from './track-unsupported-content';
import { validateADFEntity } from './validate-using-spec';

type ChangedFn = (
  node: Node,
  pos: number,
  parent: Node | null,
  index: number,
) => boolean | void;

export const getStepRange = (
  transaction: Transaction | ReadonlyTransaction,
): { from: number; to: number } | null => {
  let from = -1;
  let to = -1;

  transaction.mapping.maps.forEach((stepMap, index) => {
    stepMap.forEach((oldStart, oldEnd) => {
      const newStart = transaction.mapping.slice(index).map(oldStart, -1);
      const newEnd = transaction.mapping.slice(index).map(oldEnd);

      from = newStart < from || from === -1 ? newStart : from;
      to = newEnd > to || to === -1 ? newEnd : to;
    });
  });

  if (from !== -1) {
    return { from, to };
  }

  return null;
};

// Checks to see if the parent node is the document, ie not contained within another entity
export function hasDocAsParent($anchor: ResolvedPos): boolean {
  return $anchor.depth === 1;
}

/**
 * Checks if a node looks like an empty document
 */
export function isEmptyDocument(node: Node): boolean {
  const nodeChild = node.content.firstChild;
  if (node.childCount !== 1 || !nodeChild) {
    return false;
  }
  return isEmptyParagraph(nodeChild);
}

export function bracketTyped(state: EditorState) {
  const { selection } = state;
  const { $cursor, $anchor } = selection as TextSelection;

  if (!$cursor) {
    return false;
  }
  const node = $cursor.nodeBefore;

  if (!node) {
    return false;
  }

  if (node.type.name === 'text' && node.text === '{') {
    const paragraphNode = $anchor.node();
    return paragraphNode.marks.length === 0 && hasDocAsParent($anchor);
  }

  return false;
}

export function nodesBetweenChanged(
  tr: Transaction | ReadonlyTransaction,
  f: ChangedFn,
  startPos?: number,
) {
  const stepRange = getStepRange(tr);
  if (!stepRange) {
    return;
  }

  tr.doc.nodesBetween(stepRange.from, stepRange.to, f, startPos);
}

export function processRawValue(
  schema: Schema,
  value?: ReplaceRawValue,
  providerFactory?: ProviderFactory,
  sanitizePrivateContent?: boolean,
  contentTransformer?: Transformer<string>,
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
): Node | undefined {
  if (!value) {
    return;
  }
  interface NodeType {
    [key: string]: any;
  }

  let node: NodeType | ADFEntity;

  if (typeof value === 'string') {
    try {
      if (contentTransformer) {
        const doc = contentTransformer.parse(value);
        node = doc.toJSON();
      } else {
        node = JSON.parse(value);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Error processing value: ${value} isn't a valid JSON`);
      return;
    }
  } else {
    node = value;
  }

  if (Array.isArray(node)) {
    // eslint-disable-next-line no-console
    console.error(
      `Error processing value: ${node} is an array, but it must be an object.`,
    );
    return;
  }

  try {
    // ProseMirror always require a child under doc
    if (node.type === 'doc') {
      if (Array.isArray(node.content) && node.content.length === 0) {
        node.content.push({
          type: 'paragraph',
          content: [],
        });
      }
      // Just making sure doc is always valid
      if (!node.version) {
        node.version = 1;
      }
    }

    if (contentTransformer) {
      return Node.fromJSON(schema, node);
    }

    // link mark on mediaSingle is deprecated, need to move link mark to child media node
    // https://product-fabric.atlassian.net/browse/ED-14043
    let { transformedAdf, isTransformed } = transformMediaLinkMarks(
      node as ADFEntity,
    );

    if (isTransformed && dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        action: ACTION.MEDIA_LINK_TRANSFORMED,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL,
      });
    }

    // See: HOT-97965 https://product-fabric.atlassian.net/browse/ED-14400
    // We declared in code mark spec that links and marks should not co-exist on
    // text nodes. This util strips code marks from bad text nodes and preserves links.
    // Otherwise, prosemirror will try to repair the invalid document by stripping links
    // and preserving code marks during content changes.
    ({ transformedAdf, isTransformed } = transformTextLinkCodeMarks(
      transformedAdf as ADFEntity,
    ));

    if (isTransformed && dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        action: ACTION.TEXT_LINK_MARK_TRANSFORMED,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL,
      });
    }

    let discardedMarks = [];
    ({ transformedAdf, isTransformed, discardedMarks } = transformDedupeMarks(
      transformedAdf as ADFEntity,
    ));

    if (isTransformed && dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        action: ACTION.DEDUPE_MARKS_TRANSFORMED_V2,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          /** UGC WARNING
           *
           * DO NOT include the `mark` attributes inside, we map here to only
           * extract the mark type as that is the only non-UGC safe information
           * that we can add to event-attributes
           *
           */
          discardedMarkTypes: discardedMarks.map((mark) => mark.type),
        },
      });
    }

    ({ transformedAdf, isTransformed } = transformNodesMissingContent(
      transformedAdf as ADFEntity,
    ));

    if (isTransformed && dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        action: ACTION.NODES_MISSING_CONTENT_TRANSFORMED,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL,
      });
    }

    ({ transformedAdf, isTransformed } = transformIndentationMarks(
      transformedAdf as ADFEntity,
    ));

    if (isTransformed && dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        action: ACTION.INDENTATION_MARKS_TRANSFORMED,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL,
      });
    }

    ({ transformedAdf, isTransformed } = transformInvalidMediaContent(
      transformedAdf as ADFEntity,
    ));

    if (isTransformed && dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        action: ACTION.INVALID_MEDIA_CONTENT_TRANSFORMED,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL,
      });
    }

    const entity: ADFEntity = validateADFEntity(
      schema,
      transformedAdf || (node as ADFEntity),
      dispatchAnalyticsEvent,
    );

    let newEntity = maySanitizePrivateContent(
      entity as JSONDocNode,
      providerFactory,
      sanitizePrivateContent,
    );

    const parsedDoc = Node.fromJSON(schema, newEntity);

    // throws an error if the document is invalid
    try {
      parsedDoc.check();
    } catch (err) {
      if (dispatchAnalyticsEvent) {
        dispatchAnalyticsEvent({
          action: ACTION.INVALID_PROSEMIRROR_DOCUMENT,
          actionSubject: ACTION_SUBJECT.EDITOR,
          eventType: EVENT_TYPE.OPERATIONAL,
        });
      }
      throw err;
    }

    if (dispatchAnalyticsEvent) {
      findAndTrackUnsupportedContentNodes(
        parsedDoc,
        schema,
        dispatchAnalyticsEvent,
      );
    }

    return parsedDoc;
  } catch (e) {
    if (dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        action: ACTION.DOCUMENT_PROCESSING_ERROR,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL,
      });
    }

    // eslint-disable-next-line no-console
    console.error(
      `Error processing document:\n${
        e instanceof Error ? e.message : String(e)
      }\n\n`,
      JSON.stringify(node),
    );

    if (isProseMirrorSchemaCheckError(e)) {
      throw e;
    }

    return;
  }
}

function isProseMirrorSchemaCheckError(error: unknown): boolean {
  return (
    error instanceof RangeError &&
    (!!error.message.match(/^Invalid collection of marks for node/) ||
      !!error.message.match(/^Invalid content for node/))
  );
}

const maySanitizePrivateContent = (
  entity: JSONDocNode,
  providerFactory?: ProviderFactory,
  sanitizePrivateContent?: boolean,
): JSONDocNode => {
  if (sanitizePrivateContent && providerFactory) {
    return sanitizeNodeForPrivacy(entity, providerFactory);
  }
  return entity;
};

/**
 * Returns false if node contains only empty inline nodes and hardBreaks.
 */
export function hasVisibleContent(node: Node): boolean {
  const isInlineNodeHasVisibleContent = (inlineNode: Node) => {
    return inlineNode.isText
      ? !!inlineNode.textContent.trim()
      : inlineNode.type.name !== 'hardBreak';
  };

  if (node.isInline) {
    return isInlineNodeHasVisibleContent(node);
  } else if (node.isBlock && (node.isLeaf || node.isAtom)) {
    return true;
  } else if (!node.childCount) {
    return false;
  }

  for (let index = 0; index < node.childCount; index++) {
    const child = node.child(index);
    const invisibleNodeTypes = ['paragraph', 'text', 'hardBreak'];

    if (
      !invisibleNodeTypes.includes(child.type.name) ||
      hasVisibleContent(child)
    ) {
      return true;
    }
  }

  return false;
}

export const isSelectionEndOfParagraph = (state: EditorState): boolean =>
  state.selection.$to.parent.type === state.schema.nodes.paragraph &&
  state.selection.$to.pos === state.doc.resolve(state.selection.$to.pos).end();

function getChangedNodesIn({
  tr,
  doc,
}: {
  tr: ReadonlyTransaction | Transaction;
  doc: Node;
}): { node: Node; pos: number }[] {
  const nodes: { node: Node; pos: number }[] = [];
  const stepRange = getStepRange(tr);

  if (!stepRange) {
    return nodes;
  }

  const from = Math.min(doc.nodeSize - 2, stepRange.from);
  const to = Math.min(doc.nodeSize - 2, stepRange.to);

  doc.nodesBetween(from, to, (node, pos) => {
    nodes.push({ node, pos });
  });

  return nodes;
}

export function getChangedNodes(
  tr: ReadonlyTransaction | Transaction,
): { node: Node; pos: number }[] {
  return getChangedNodesIn({
    tr: tr,
    doc: tr.doc,
  });
}
