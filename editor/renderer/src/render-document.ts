import memoizeOne from 'memoize-one';
import { Serializer } from './serializer';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { getValidDocument } from '@atlaskit/editor-common/validator';
import type { ADFStage } from '@atlaskit/editor-common/validator';
import {
  validateADFEntity,
  findAndTrackUnsupportedContentNodes,
} from '@atlaskit/editor-common/utils';
import type { UnsupportedContentLevelsTracking } from '@atlaskit/editor-common/utils';
import { Node as PMNode, Schema } from 'prosemirror-model';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from './analytics/enums';
import { AnalyticsEventPayload, PLATFORM } from './analytics/events';
import { trackUnsupportedContentLevels } from './analytics/unsupported-content';
import { RendererAppearance } from './ui/Renderer/types';
import { transformMediaLinkMarks } from '@atlaskit/adf-utils/transforms';

export interface RenderOutput<T> {
  result: T;
  stat: RenderOutputStat;
  pmDoc?: PMNode;
}

export interface RenderOutputStat {
  buildTreeTime?: number;
  sanitizeTime: number;
  serializeTime?: number;
}

export interface ResultWithTime<T> {
  output: T;
  time: number;
}

const SUPPORTS_HIRES_TIMER_API = !!(window.performance && performance.now);

const withStopwatch = <T>(cb: () => T): ResultWithTime<T> => {
  const startTime = SUPPORTS_HIRES_TIMER_API ? performance.now() : Date.now();
  const output = cb();
  const endTime = SUPPORTS_HIRES_TIMER_API ? performance.now() : Date.now();
  const time = endTime - startTime;

  return { output, time };
};

type DispatchAnalyticsEvent = (event: AnalyticsEventPayload) => void;

const _validation = (
  doc: any,
  schema: Schema,
  adfStage: ADFStage,
  useSpecBasedValidator: boolean,
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
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

    result = validateADFEntity(
      schema,
      transformedAdf || doc,
      dispatchAnalyticsEvent,
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

  return result;
};
const memoValidation = memoizeOne(_validation, (newArgs, lastArgs) => {
  const [newDoc, newSchema, newADFStage, newUseSpecValidator] = newArgs;
  const [oldDoc, oldSchema, oldADFStage, oldUseSpecValidator] = lastArgs;

  // we're ignoring changes to dispatchAnalyticsEvent in this check
  const result =
    areDocsEqual(newDoc, oldDoc) &&
    newSchema === oldSchema &&
    newADFStage === oldADFStage &&
    newUseSpecValidator === oldUseSpecValidator;

  return result;
});

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

const _serializeFragment = <T>(
  serializer: Serializer<T>,
  doc: PMNode,
): T | null => {
  return serializer.serializeFragment(doc.content);
};
const memoSerializeFragment = memoizeOne(
  _serializeFragment,
  (newArgs, lastArgs) => {
    const [newSerializer, newDoc] = newArgs;
    const [oldSerializer, oldDoc] = lastArgs;

    return newSerializer === oldSerializer && areDocsEqual(newDoc, oldDoc);
  },
);

const _createNodeAndCheck = (
  schema: Schema,
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
const memoCreateNodeAndCheck = memoizeOne(
  _createNodeAndCheck,
  (newArgs, lastArgs) => {
    // ignore dispatchAnalyticsEvent
    const [newSchema, newDoc] = newArgs;
    const [oldSchema, oldDoc] = lastArgs;

    return newSchema === oldSchema && areDocsEqual(newDoc, oldDoc);
  },
);

export const renderDocument = <T>(
  doc: any,
  serializer: Serializer<T>,
  schema: Schema = defaultSchema,
  adfStage: ADFStage = 'final',
  useSpecBasedValidator: boolean = false,
  rendererId: string = 'noid',
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
  unsupportedContentLevelsTracking?: UnsupportedContentLevelsTracking,
  appearance?: RendererAppearance,
): RenderOutput<T | null> => {
  const stat: RenderOutputStat = { sanitizeTime: 0 };

  const { output: validDoc, time: sanitizeTime } = withStopwatch(() => {
    return memoValidation(
      doc,
      schema,
      adfStage,
      useSpecBasedValidator,
      dispatchAnalyticsEvent,
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

  const { output: result, time: serializeTime } = withStopwatch<T | null>(
    () => {
      return memoSerializeFragment(serializer, node) as T | null;
    },
  );

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

  return { result, stat, pmDoc: node };
};
