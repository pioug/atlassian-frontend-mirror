/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import {
	transformMediaLinkMarks,
	transformNestedTablesIncomingDocument,
} from '@atlaskit/adf-utils/transforms';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '@atlaskit/editor-common/analytics';
import type { UnsupportedContentLevelsTracking } from '@atlaskit/editor-common/utils';
import {
	findAndTrackUnsupportedContentNodes,
	validateADFEntity,
} from '@atlaskit/editor-common/utils';
import type { ADFStage } from '@atlaskit/editor-common/validator';
import { getValidDocument } from '@atlaskit/editor-common/validator';
import { type Node as PMNode, type Schema } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';
import memoizeOne from 'memoize-one';
import { PLATFORM, type AnalyticsEventPayload } from './analytics/events';
import { trackUnsupportedContentLevels } from './analytics/unsupported-content';
import { type Serializer } from './serializer';
import { countNodes } from './ui/Renderer/count-nodes';
import { type RendererAppearance } from './ui/Renderer/types';

export interface RenderOutput<T> {
	pmDoc?: PMNode;
	result: T;
	stat: RenderOutputStat;
}

export interface RenderOutputStat {
	buildTreeTime?: number;
	nodesCount?: Record<string, number>;
	sanitizeTime: number;
	serializeTime?: number;
}

export interface ResultWithTime<T> {
	output: T;
	time: number;
}

const SUPPORTS_HIRES_TIMER_API = !!(
	typeof window !== 'undefined' &&
	window.performance &&
	performance.now
);

const withStopwatch = <T>(cb: () => T): ResultWithTime<T> => {
	const startTime = SUPPORTS_HIRES_TIMER_API ? performance.now() : Date.now();
	const output = cb();
	const endTime = SUPPORTS_HIRES_TIMER_API ? performance.now() : Date.now();
	const time = endTime - startTime;

	return { output, time };
};

type DispatchAnalyticsEvent = (event: AnalyticsEventPayload) => void;

const _validation = (
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	doc: any,
	schema: Schema,
	adfStage: ADFStage,
	useSpecBasedValidator: boolean,
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
	skipValidation?: boolean,
	validationOverrides?: { allowNestedTables?: boolean },
) => {
	let result;

	if (useSpecBasedValidator) {
		// link mark on mediaSingle is deprecated, need to move link mark to child media node
		// https://product-fabric.atlassian.net/browse/ED-14043
		const { transformedAdf, isTransformed } = transformMediaLinkMarks(doc);
		if (isTransformed && dispatchAnalyticsEvent) {
			dispatchAnalyticsEvent({
				action: ACTION.MEDIA_LINK_TRANSFORMED,
				actionSubject: ACTION_SUBJECT.RENDERER,
				eventType: EVENT_TYPE.OPERATIONAL,
			});
		}

		result = skipValidation
			? transformedAdf || doc
			: validateADFEntity(
					schema,
					transformedAdf || doc,
					dispatchAnalyticsEvent,
					validationOverrides,
				);
	} else {
		result = getValidDocument(doc, schema, adfStage);
	}

	if (!result) {
		return result;
	}

	// ProseMirror always require a child under doc
	if (result.type === 'doc' && useSpecBasedValidator) {
		if (Array.isArray(result.content) && result.content.length === 0) {
			result.content.push({
				type: 'paragraph',
				content: [],
			});
		}

		// Just making sure doc is always valid
		if (!result.version) {
			result.version = 1;
		}
	}

	// Convert nested-table extensions into nested tables
	try {
		const { transformedAdf, isTransformed } = transformNestedTablesIncomingDocument(result, {
			environment: 'renderer',
			disableNestedRendererTreatment: fg('platform_editor_nested_table_extension_comment_fix'),
		});

		if (isTransformed) {
			dispatchAnalyticsEvent?.({
				action: ACTION.NESTED_TABLE_TRANSFORMED,
				actionSubject: ACTION_SUBJECT.RENDERER,
				eventType: EVENT_TYPE.OPERATIONAL,
			});

			result = transformedAdf;
		}
	} catch (e) {
		dispatchAnalyticsEvent?.({
			action: ACTION.INVALID_PROSEMIRROR_DOCUMENT,
			actionSubject: ACTION_SUBJECT.RENDERER,
			eventType: EVENT_TYPE.OPERATIONAL,
			attributes: {
				platform: PLATFORM.WEB,
				errorStack: `${e instanceof Error && e.name === 'NodeNestingTransformError' ? 'NodeNestingTransformError - Failed to encode one or more nested tables' : undefined}`,
			},
		});
	}

	return result;
};

const memoValidation = memoizeOne(_validation, (newArgs, lastArgs) => {
	type ValidationArgsType = [
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		doc: any,
		schema: Schema,
		stage: ADFStage,
		useSpecValidator: boolean,
		DispatchAnalyticsEvent?: DispatchAnalyticsEvent | undefined,
		skipValidation?: boolean | undefined,
		validationOverrides?: { allowNestedTables?: boolean },
	];

	const [
		newDoc,
		newSchema,
		newADFStage,
		newUseSpecValidator,
		/* ignoring dispatchAnalyticsEvent */,
		newSkipValidation,
		newValidationOverrides,
	]: ValidationArgsType = newArgs;
	const [
		oldDoc,
		oldSchema,
		oldADFStage,
		oldUseSpecValidator,
		/* ignoring dispatchAnalyticsEvent */,
		oldSkipValidation,
		oldValidationOverrides,
	]: ValidationArgsType = lastArgs;

	return (
		areDocsEqual(newDoc, oldDoc) &&
		newSchema === oldSchema &&
		newADFStage === oldADFStage &&
		newUseSpecValidator === oldUseSpecValidator &&
		newSkipValidation === oldSkipValidation &&
		newValidationOverrides === oldValidationOverrides
	);
});

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const areDocsEqual = (docA: any, docB: any) => {
	if (docA === docB) {
		return true;
	}

	if (typeof docA === 'string' && typeof docB === 'string') {
		return docA === docB;
	}

	// PMNode
	if (docA.type && docA.toJSON && docB.type && docB.toJSON) {
		return JSON.stringify(docA.toJSON()) === JSON.stringify(docB.toJSON());
	}

	// Object
	return JSON.stringify(docA) === JSON.stringify(docB);
};

const _serializeFragment = <T>(serializer: Serializer<T>, doc: PMNode): T | null => {
	return serializer.serializeFragment(doc.content);
};
const memoSerializeFragment = memoizeOne(_serializeFragment, (newArgs, lastArgs) => {
	const [newSerializer, newDoc] = newArgs;
	const [oldSerializer, oldDoc] = lastArgs;

	return newSerializer === oldSerializer && areDocsEqual(newDoc, oldDoc);
});

const _createNodeAndCheck = (
	schema: Schema,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	doc: any,
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
): PMNode => {
	const pmNode = schema.nodeFromJSON(doc);
	try {
		pmNode.check();
	} catch (err) {
		if (dispatchAnalyticsEvent) {
			dispatchAnalyticsEvent({
				action: ACTION.INVALID_PROSEMIRROR_DOCUMENT,
				actionSubject: ACTION_SUBJECT.RENDERER,
				attributes: {
					platform: PLATFORM.WEB,
					errorStack: err instanceof Error ? err.message : String(err),
				},
				eventType: EVENT_TYPE.OPERATIONAL,
			});
		}
	}
	return pmNode;
};
const memoCreateNodeAndCheck = memoizeOne(_createNodeAndCheck, (newArgs, lastArgs) => {
	// ignore dispatchAnalyticsEvent
	const [newSchema, newDoc] = newArgs;
	const [oldSchema, oldDoc] = lastArgs;

	return newSchema === oldSchema && areDocsEqual(newDoc, oldDoc);
});

export const renderDocument = <T>(
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	doc: any,
	serializer: Serializer<T>,
	schema: Schema = defaultSchema,
	adfStage: ADFStage = 'final',
	useSpecBasedValidator: boolean = false,
	rendererId: string = 'noid',
	dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
	unsupportedContentLevelsTracking?: UnsupportedContentLevelsTracking,
	appearance?: RendererAppearance,
	includeNodesCountInStats?: boolean,
	skipValidation?: boolean,
	validationOverrides?: { allowNestedTables?: boolean },
): RenderOutput<T | null> => {
	const stat: RenderOutputStat = { sanitizeTime: 0 };

	// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
	if (fg('platform_editor_renderer_rm_usespecbasedvalidator')) {
		useSpecBasedValidator = true;
	}

	const { output: validDoc, time: sanitizeTime } = withStopwatch(() => {
		return memoValidation(
			doc,
			schema,
			adfStage,
			useSpecBasedValidator,
			dispatchAnalyticsEvent,
			skipValidation,
			validationOverrides,
		);
	});

	// save sanitize time to stats
	stat.sanitizeTime = sanitizeTime;

	if (!validDoc) {
		return { stat, result: null };
	}

	const { output: node, time: buildTreeTime } = withStopwatch<PMNode>(() => {
		return memoCreateNodeAndCheck(schema, validDoc, dispatchAnalyticsEvent);
	});

	// save build tree time to stats
	stat.buildTreeTime = buildTreeTime;

	const { output: result, time: serializeTime } = withStopwatch<T | null>(() => {
		return memoSerializeFragment(serializer, node) as T | null;
	});

	// save serialize tree time to stats
	stat.serializeTime = serializeTime;

	if (dispatchAnalyticsEvent && useSpecBasedValidator) {
		findAndTrackUnsupportedContentNodes(node, schema, dispatchAnalyticsEvent);

		if (unsupportedContentLevelsTracking?.enabled) {
			const documentData = { doc: validDoc, appearance, rendererId };
			trackUnsupportedContentLevels(
				documentData,
				unsupportedContentLevelsTracking,
				dispatchAnalyticsEvent,
			);
		}
	}

	if (includeNodesCountInStats) {
		stat.nodesCount = countNodes(doc);
	}

	return { result, stat, pmDoc: node };
};
