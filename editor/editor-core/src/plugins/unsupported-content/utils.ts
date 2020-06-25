import { Schema, Node as PMNode } from 'prosemirror-model';
import {
  DispatchAnalyticsEvent,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  ACTION,
  EVENT_TYPE,
  AnalyticsEventPayload,
} from '../analytics';

function concatAncestorHierarchy(node: PMNode, ancestoryHierarchy?: string) {
  const { name } = node.type;
  // Space concatenator used to reduce analytics payload size
  return ancestoryHierarchy ? `${ancestoryHierarchy} ${name}` : name;
}

export const findAndTrackUnsupportedContentNodes = (
  node: PMNode,
  schema: Schema,
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
  ancestorHierarchy = '',
): void => {
  const { type: nodeType } = node;
  const { unsupportedInline, unsupportedBlock } = schema.nodes;
  if (nodeType === unsupportedInline || nodeType === unsupportedBlock) {
    const { originalValue } = node.attrs || {};
    const { type } = (originalValue || {}) as { type?: string };
    const unsupportedNode = {
      type: type || '',
      ancestry: ancestorHierarchy,
      parentType: ancestorHierarchy.split(' ').pop() || '',
    };
    const actionSubjectId =
      nodeType === unsupportedInline
        ? ACTION_SUBJECT_ID.UNSUPPORTED_INLINE
        : ACTION_SUBJECT_ID.UNSUPPORTED_BLOCK;
    const payload: AnalyticsEventPayload = {
      action: ACTION.UNSUPPORTED_CONTENT_ENCOUNTERED,
      actionSubject: ACTION_SUBJECT.DOCUMENT,
      actionSubjectId,
      attributes: {
        unsupportedNode,
      },
      eventType: EVENT_TYPE.TRACK,
    };
    // Track the encounter
    dispatchAnalyticsEvent(payload);
  } else {
    // Recursive check for nested content
    node.content.forEach(childNode =>
      findAndTrackUnsupportedContentNodes(
        childNode,
        schema,
        dispatchAnalyticsEvent,
        concatAncestorHierarchy(node, ancestorHierarchy),
      ),
    );
  }
};
