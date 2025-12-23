import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';

import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../analytics';

import type {
	UnsupportedContentPayload,
	UnsupportedContentTooltipPayload,
} from './unsupportedContent/types';

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

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sanitizeMarks = (marks: { [key: string]: any }[] = []) => {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const sanitizedMarks: { [key: string]: any }[] = [];
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

const sanitizeAttributes = (attrs: Object = {}) => {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const sanitizedAttrs: { [key: string]: any } = Object.assign({}, attrs);
	Object.keys(attrs)
		.filter((key) => !whitelistedAttributes.includes(key))
		.forEach((key) => {
			sanitizedAttrs[key] !== null ? (sanitizedAttrs[key] = '') : (sanitizedAttrs[key] = 'null');
		});
	return sanitizedAttrs;
};

type DispatchAnalyticsEventTooltip = (payload: UnsupportedContentTooltipPayload) => void;

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
				const { type } = (originalValue || {}) as { type?: string };
				const unsupportedNode = {
					type: type || '',
					ancestry: ancestorHierarchy,
					parentType: parentType,
					marks: [],
					attrs: originalValue.attrs || {},
				};
				fireUnsupportedEvent(
					dispatchAnalyticsEvent,
					ACTION_SUBJECT_ID.UNSUPPORTED_MARK,
					unsupportedNode,
				);
			} else if (mark.type === unsupportedNodeAttribute) {
				const { unsupported } = mark.attrs || {};
				const unsupportedNodeAttribute = {
					type: nodeType.name || '',
					ancestry: ancestorHierarchy,
					parentType: parentType,
					marks: [],
					attrs: unsupported || {},
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
			marks: marks || [],
			attrs: attrs || {},
		};
		const actionSubjectId =
			nodeType === unsupportedInline
				? ACTION_SUBJECT_ID.UNSUPPORTED_INLINE
				: ACTION_SUBJECT_ID.UNSUPPORTED_BLOCK;
		fireUnsupportedEvent(dispatchAnalyticsEvent, actionSubjectId, unsupportedNode);
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

interface UnsupportedNode {
	ancestry: string;
	attrs: {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	};
	marks: {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	}[];
	parentType: string;
	type: string;
}

export const fireUnsupportedEvent = (
	dispatchAnalyticsEvent: DispatchAnalyticsEvent,
	actionSubjectId: ACTION_SUBJECT_ID,
	unsupportedNode: UnsupportedNode,
	errorCode?: string,
): void => {
	const sanitizedAttrs = sanitizeAttributes(unsupportedNode.attrs);
	const sanitizedMarks = sanitizeMarks(unsupportedNode.marks);
	const sanitizedUnsupportedNode = {
		type: unsupportedNode.type,
		ancestry: unsupportedNode.ancestry,
		parentType: unsupportedNode.parentType,
		attrs: sanitizedAttrs,
		marks: sanitizedMarks,
	};
	const payload: UnsupportedContentPayload = {
		action: ACTION.UNSUPPORTED_CONTENT_ENCOUNTERED,
		actionSubject: ACTION_SUBJECT.DOCUMENT,
		actionSubjectId,
		attributes: {
			unsupportedNode: sanitizedUnsupportedNode,
			...(!!errorCode && { errorCode }),
		},
		eventType: EVENT_TYPE.TRACK,
	};
	dispatchAnalyticsEvent(payload);
};

export const trackUnsupportedContentTooltipDisplayedFor = (
	dispatchAnalyticsEvent: DispatchAnalyticsEventTooltip,
	unsupportedContentType: UnsupportedContentTooltipPayload['actionSubjectId'],
	originalNodeType?: string,
): void => {
	trackUnsupportedContentTooltipActionFor(
		ACTION.UNSUPPORTED_TOOLTIP_VIEWED,
		dispatchAnalyticsEvent,
		unsupportedContentType,
		originalNodeType,
	);
};
