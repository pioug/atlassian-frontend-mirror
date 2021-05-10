import { Serializer } from './serializer';
import { defaultSchema } from '@atlaskit/adf-schema';
import { getValidDocument, ADFStage } from '@atlaskit/editor-common/validator';
import {
  validateADFEntity,
  findAndTrackUnsupportedContentNodes,
  UnsupportedContentLevelsTracking,
} from '@atlaskit/editor-common';
import { Node as PMNode, Schema } from 'prosemirror-model';
import { AnalyticsEventPayload } from './analytics/events';
import { trackUnsupportedContentLevels } from './analytics/unsupported-content';
import { RendererAppearance } from './ui/Renderer/types';

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
  rendererId: string = 'noid',
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
  unsupportedContentLevelsTracking?: UnsupportedContentLevelsTracking,
  appearance?: RendererAppearance,
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
