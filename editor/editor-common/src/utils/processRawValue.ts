import {
	transformDedupeMarks,
	transformIndentationMarks,
	transformInvalidMediaContent,
	transformMediaLinkMarks,
	transformNestedTablesIncomingDocument,
	transformNodesMissingContent,
	transformTextLinkCodeMarks,
} from '@atlaskit/adf-utils/transforms';
import type { ADFEntity, ADFEntityMark } from '@atlaskit/adf-utils/types';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { Fragment, Node, type Schema } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

import type { DispatchAnalyticsEvent } from '../analytics';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../analytics';
import type { ProviderFactory } from '../provider-factory';
import type { ReplaceRawValue, Transformer } from '../types';

import { sanitizeNodeForPrivacy } from './filter/privacy-filter';
import { findAndTrackUnsupportedContentNodes } from './track-unsupported-content';
import { validateADFEntity } from './validate-using-spec';

interface NodeType {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

const transformNestedTablesWithAnalytics = (
	node: ADFEntity,
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
): { transformedAdf: ADFEntity; isTransformed: boolean } => {
	try {
		const { transformedAdf, isTransformed } = transformNestedTablesIncomingDocument(node);

		if (isTransformed && dispatchAnalyticsEvent) {
			dispatchAnalyticsEvent({
				action: ACTION.NESTED_TABLE_TRANSFORMED,
				actionSubject: ACTION_SUBJECT.EDITOR,
				eventType: EVENT_TYPE.OPERATIONAL,
			});

			return { transformedAdf, isTransformed };
		}
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error('Failed to transform one or more nested tables in the document');
		if (dispatchAnalyticsEvent) {
			dispatchAnalyticsEvent({
				action: ACTION.DOCUMENT_PROCESSING_ERROR,
				actionSubject: ACTION_SUBJECT.EDITOR,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: {
					errorMessage: `${e instanceof Error && e.name === 'NodeNestingTransformError' ? 'NodeNestingTransformError - Failed to transform one or more nested tables' : undefined}`,
				},
			});
		}
	}

	return { transformedAdf: node, isTransformed: false };
};

export function processRawValueWithoutValidation(
	schema: Schema,
	value?: ReplaceRawValue,
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
) {
	if (!value) {
		return;
	}

	let node: NodeType | ADFEntity;

	if (typeof value === 'string') {
		try {
			node = JSON.parse(value);
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(`Error processing value: ${value} isn't a valid JSON`);
			return;
		}
	} else {
		node = value;
	}

	if (fg('platform_editor_use_nested_table_pm_nodes')) {
		// Convert nested-table extensions into nested tables
		const { transformedAdf } = transformNestedTablesWithAnalytics(
			node as ADFEntity,
			dispatchAnalyticsEvent,
		);

		return Node.fromJSON(schema, transformedAdf);
	} else {
		return Node.fromJSON(schema, node);
	}
}

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/max-params
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
		console.error(`Error processing value: ${node} is an array, but it must be an object.`);
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
		let { transformedAdf, isTransformed } = transformMediaLinkMarks(node as ADFEntity);

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
		({ transformedAdf, isTransformed } = transformTextLinkCodeMarks(transformedAdf as ADFEntity));

		if (isTransformed && dispatchAnalyticsEvent) {
			dispatchAnalyticsEvent({
				action: ACTION.TEXT_LINK_MARK_TRANSFORMED,
				actionSubject: ACTION_SUBJECT.EDITOR,
				eventType: EVENT_TYPE.OPERATIONAL,
			});
		}

		let discardedMarks: ADFEntityMark[] = [];
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

		({ transformedAdf, isTransformed } = transformNodesMissingContent(transformedAdf as ADFEntity));

		if (isTransformed && dispatchAnalyticsEvent) {
			dispatchAnalyticsEvent({
				action: ACTION.NODES_MISSING_CONTENT_TRANSFORMED,
				actionSubject: ACTION_SUBJECT.EDITOR,
				eventType: EVENT_TYPE.OPERATIONAL,
			});
		}

		({ transformedAdf, isTransformed } = transformIndentationMarks(transformedAdf as ADFEntity));

		if (isTransformed && dispatchAnalyticsEvent) {
			dispatchAnalyticsEvent({
				action: ACTION.INDENTATION_MARKS_TRANSFORMED,
				actionSubject: ACTION_SUBJECT.EDITOR,
				eventType: EVENT_TYPE.OPERATIONAL,
			});
		}

		({ transformedAdf, isTransformed } = transformInvalidMediaContent(transformedAdf as ADFEntity));

		if (isTransformed && dispatchAnalyticsEvent) {
			dispatchAnalyticsEvent({
				action: ACTION.INVALID_MEDIA_CONTENT_TRANSFORMED,
				actionSubject: ACTION_SUBJECT.EDITOR,
				eventType: EVENT_TYPE.OPERATIONAL,
			});
		}

		if (fg('platform_editor_use_nested_table_pm_nodes')) {
			// Convert nested-table extensions into nested tables
			({ transformedAdf } = transformNestedTablesWithAnalytics(
				transformedAdf as ADFEntity,
				dispatchAnalyticsEvent,
			));
		}

		if (dispatchAnalyticsEvent && fg('platform_editor_advanced_layouts_post_fix_patch_3')) {
			const hasSingleColumnLayout = transformedAdf.content?.some(
				(node) => node && node.type === 'layoutSection' && node.content?.length === 1,
			);

			if (hasSingleColumnLayout) {
				dispatchAnalyticsEvent({
					action: ACTION.SINGLE_COL_LAYOUT_DETECTED,
					actionSubject: ACTION_SUBJECT.EDITOR,
					eventType: EVENT_TYPE.OPERATIONAL,
				});
			}
		}

		const entity: ADFEntity = validateADFEntity(
			schema,
			transformedAdf || (node as ADFEntity),
			dispatchAnalyticsEvent,
		);

		const newEntity = maySanitizePrivateContent(
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
			findAndTrackUnsupportedContentNodes(parsedDoc, schema, dispatchAnalyticsEvent);
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
			`Error processing document:\n${e instanceof Error ? e.message : String(e)}\n\n`,
			JSON.stringify(node),
		);

		if (isProseMirrorSchemaCheckError(e)) {
			throw e;
		}

		return;
	}
}

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/max-params
export function processRawFragmentValue(
	schema: Schema,
	value?: ReplaceRawValue[],
	providerFactory?: ProviderFactory,
	sanitizePrivateContent?: boolean,
	contentTransformer?: Transformer<string>,
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
): Fragment | undefined {
	if (!value) {
		return;
	}

	const adfEntities = value
		.map((item) =>
			processRawValue(
				schema,
				item,
				providerFactory,
				sanitizePrivateContent,
				contentTransformer,
				dispatchAnalyticsEvent,
			),
		)
		.filter((item) => Boolean(item)) as Node[];

	if (adfEntities.length === 0) {
		return;
	}

	return Fragment.from(adfEntities);
}

function isProseMirrorSchemaCheckError(error: unknown): boolean {
	return (
		error instanceof RangeError &&
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		(!!error.message.match(/^Invalid collection of marks for node/) ||
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
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
