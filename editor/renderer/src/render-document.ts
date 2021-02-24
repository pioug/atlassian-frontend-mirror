import { Serializer } from './serializer';
import { defaultSchema } from '@atlaskit/adf-schema';
import { getValidDocument, ADFStage } from '@atlaskit/editor-common/validator';
import {
  validateADFEntity,
  findAndTrackUnsupportedContentNodes,
  getUnsupportedContentLevelData,
  UnsupportedContentLevelsTracking,
} from '@atlaskit/editor-common';
import { Node as PMNode, Schema } from 'prosemirror-model';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from './analytics/enums';
import { AnalyticsEventPayload, PLATFORM } from './analytics/events';

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

export const renderDocument = <T>(
  doc: any,
  serializer: Serializer<T>,
  schema: Schema = defaultSchema,
  adfStage: ADFStage = 'final',
  useSpecBasedValidator: boolean = false,
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
  unsupportedContentLevelsTracking?: UnsupportedContentLevelsTracking,
): RenderOutput<T | null> => {
  const stat: RenderOutputStat = { sanitizeTime: 0 };

  const { output: validDoc, time: sanitizeTime } = withStopwatch(() => {
    if (useSpecBasedValidator) {
      return validateADFEntity(schema, doc, dispatchAnalyticsEvent);
    }
    return getValidDocument(doc, schema, adfStage);
  });

  // save sanitize time to stats
  stat.sanitizeTime = sanitizeTime;

  if (!validDoc) {
    return { stat, result: null };
  }

  // ProseMirror always require a child under doc
  if (validDoc.type === 'doc' && useSpecBasedValidator) {
    if (Array.isArray(validDoc.content) && validDoc.content.length === 0) {
      validDoc.content.push({
        type: 'paragraph',
        content: [],
      });
    }
    // Just making sure doc is always valid
    if (!validDoc.version) {
      validDoc.version = 1;
    }
  }

  const { output: node, time: buildTreeTime } = withStopwatch<PMNode>(() => {
    const pmNode = schema.nodeFromJSON(validDoc);
    pmNode.check();
    return pmNode;
  });

  // save build tree time to stats
  stat.buildTreeTime = buildTreeTime;

  const { output: result, time: serializeTime } = withStopwatch<T | null>(() =>
    serializer.serializeFragment(node.content),
  );

  // save serialize tree time to stats
  stat.serializeTime = serializeTime;

  if (dispatchAnalyticsEvent && useSpecBasedValidator) {
    findAndTrackUnsupportedContentNodes(node, schema, dispatchAnalyticsEvent);

    if (unsupportedContentLevelsTracking?.enabled) {
      try {
        const {
          severity,
          percentage,
          counts: { supportedNodes, unsupportedNodes },
        } = getUnsupportedContentLevelData(
          validDoc,
          unsupportedContentLevelsTracking?.thresholds,
        );
        dispatchAnalyticsEvent({
          action: ACTION.UNSUPPORTED_CONTENT_LEVELS_TRACKING_SUCCEEDED,
          actionSubject: ACTION_SUBJECT.RENDERER,
          attributes: {
            platform: PLATFORM.WEB,
            unsupportedContentLevelSeverity: severity,
            unsupportedContentLevelPercentage: percentage,
            unsupportedNodesCount: unsupportedNodes,
            supportedNodesCount: supportedNodes,
          },
          eventType: EVENT_TYPE.OPERATIONAL,
        });
      } catch (err) {
        dispatchAnalyticsEvent({
          action: ACTION.UNSUPPORTED_CONTENT_LEVELS_TRACKING_ERRORED,
          actionSubject: ACTION_SUBJECT.RENDERER,
          attributes: {
            platform: PLATFORM.WEB,
            error: err?.toString(),
          },
          eventType: EVENT_TYPE.OPERATIONAL,
        });
      }
    }
  }

  return { result, stat, pmDoc: node };
};
