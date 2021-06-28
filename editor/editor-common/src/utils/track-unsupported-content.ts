import { Node as PMNode, Schema } from 'prosemirror-model';

import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  UnsupportedContentPayload,
  UnsupportedContentTooltipPayload,
} from './analytics';

const whitelistedAttributes = [
  'align',
  'annotationType',
  'extensionKey',
  'extensionType',
  'layout',
  'type',
  'localId',
  'mode',
  'language',
  'timestamp',
  'state',
  'originalWidth',
  'originalHeight',
  'height',
  'width',
  'shortName',
  'level',
  'userType',
  'order',
  'panelType',
  'color',
  'style',
  'isNumberColumnEnabled',
  'colspan',
  'rowspan',
  'colwidth',
  'background',
];

type DispatchAnalyticsEvent = (payload: UnsupportedContentPayload) => void;

function concatAncestorHierarchy(node: PMNode, ancestoryHierarchy?: string) {
  const { name } = node.type;
  // Space concatenator used to reduce analytics payload size
  return ancestoryHierarchy ? `${ancestoryHierarchy} ${name}` : name;
}

const sanitizeMarks = (marks: { [key: string]: any }[] = []) => {
  let sanitizedMarks: { [key: string]: any }[] = [];
  marks.forEach((mark) => {
    if (mark.attrs) {
      const attrs = sanitizeAttributes(mark.attrs);
      sanitizedMarks.push({ ...mark, attrs });
    } else {
      sanitizedMarks.push({ ...mark });
    }
  });
  return sanitizedMarks;
};

const sanitizeAttributes = (attrs: {} = {}) => {
  let sanitizedAttrs: { [key: string]: any } = Object.assign({}, attrs);
  Object.keys(attrs)
    .filter((key) => !whitelistedAttributes.includes(key))
    .forEach((key) => {
      sanitizedAttrs[key] !== null
        ? (sanitizedAttrs[key] = '')
        : (sanitizedAttrs[key] = 'null');
    });
  return sanitizedAttrs;
};

type DispatchAnalyticsEventTooltip = (
  payload: UnsupportedContentTooltipPayload,
) => void;

const trackUnsupportedContentTooltipActionFor = (
  action: UnsupportedContentTooltipPayload['action'],
  dispatchAnalyticsEvent: DispatchAnalyticsEventTooltip,
  unsupportedContentType: UnsupportedContentTooltipPayload['actionSubjectId'],
  originalNodeType?: string,
) => {
  dispatchAnalyticsEvent({
    action: action,
    actionSubjectId: unsupportedContentType,
    actionSubject: ACTION_SUBJECT.TOOLTIP,
    eventType: EVENT_TYPE.UI,
    attributes: {
      unsupportedNodeType: originalNodeType,
    },
  });
};

export const findAndTrackUnsupportedContentNodes = (
  node: PMNode,
  schema: Schema,
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
  ancestorHierarchy = '',
): void => {
  const { type: nodeType, marks: nodeMarks } = node;
  const { unsupportedMark, unsupportedNodeAttribute } = schema.marks;
  const { unsupportedInline, unsupportedBlock } = schema.nodes;
  const parentType = ancestorHierarchy.split(' ').pop() || '';
  if (nodeMarks.length) {
    nodeMarks.forEach((mark) => {
      if (mark.type === unsupportedMark) {
        const { originalValue } = mark.attrs || {};
        const sanitizedAttrs = sanitizeAttributes(originalValue.attrs) || {};
        const { type } = (originalValue || {}) as { type?: string };
        const unsupportedNode = {
          type: type || '',
          ancestry: ancestorHierarchy,
          parentType: parentType,
          marks: [],
          attrs: sanitizedAttrs || {},
        };
        fireUnsupportedEvent(
          dispatchAnalyticsEvent,
          ACTION_SUBJECT_ID.UNSUPPORTED_MARK,
          unsupportedNode,
        );
      } else if (mark.type === unsupportedNodeAttribute) {
        const { unsupported } = mark.attrs || {};
        const sanitizedAttrs = sanitizeAttributes(unsupported) || {};
        const unsupportedNodeAttribute = {
          type: nodeType.name || '',
          ancestry: ancestorHierarchy,
          parentType: parentType,
          marks: [],
          attrs: sanitizedAttrs || {},
        };
        fireUnsupportedEvent(
          dispatchAnalyticsEvent,
          ACTION_SUBJECT_ID.UNSUPPORTED_NODE_ATTRIBUTE,
          unsupportedNodeAttribute,
        );
      }
    });
  }
  if (nodeType === unsupportedInline || nodeType === unsupportedBlock) {
    const { originalValue } = node.attrs || {};
    const { marks } = originalValue || [];
    const { attrs } = originalValue || {};
    const { type } = (originalValue || {}) as { type?: string };
    const unsupportedNode = {
      type: type || '',
      ancestry: ancestorHierarchy,
      parentType: parentType,
      marks: sanitizeMarks(marks) || [],
      attrs: sanitizeAttributes(attrs) || {},
    };
    const actionSubjectId =
      nodeType === unsupportedInline
        ? ACTION_SUBJECT_ID.UNSUPPORTED_INLINE
        : ACTION_SUBJECT_ID.UNSUPPORTED_BLOCK;
    fireUnsupportedEvent(
      dispatchAnalyticsEvent,
      actionSubjectId,
      unsupportedNode,
    );
  } else {
    // Recursive check for nested content
    node.content.forEach((childNode) =>
      findAndTrackUnsupportedContentNodes(
        childNode,
        schema,
        dispatchAnalyticsEvent,
        concatAncestorHierarchy(node, ancestorHierarchy),
      ),
    );
  }
};

export const fireUnsupportedEvent = (
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
  actionSubjectId: ACTION_SUBJECT_ID,
  unsupportedNode: {} = {},
  errorCode?: string,
) => {
  let attrs: {
    unsupportedNode: Record<string, any>;
    errorCode?: String;
  } = {
    unsupportedNode: unsupportedNode,
  };
  if (errorCode) {
    attrs.errorCode = errorCode;
  }
  const payload: UnsupportedContentPayload = {
    action: ACTION.UNSUPPORTED_CONTENT_ENCOUNTERED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId,
    attributes: attrs,
    eventType: EVENT_TYPE.TRACK,
  };
  dispatchAnalyticsEvent(payload);
};

export const trackUnsupportedContentTooltipDisplayedFor = (
  dispatchAnalyticsEvent: DispatchAnalyticsEventTooltip,
  unsupportedContentType: UnsupportedContentTooltipPayload['actionSubjectId'],
  originalNodeType?: string,
) => {
  trackUnsupportedContentTooltipActionFor(
    ACTION.UNSUPPORTED_TOOLTIP_VIEWED,
    dispatchAnalyticsEvent,
    unsupportedContentType,
    originalNodeType,
  );
};
