import { Serializer } from './serializer';
import { defaultSchema } from '@atlaskit/adf-schema';
import {
  getValidDocument,
  getValidNode,
  ADNode,
  ADFStage,
} from '@atlaskit/editor-common/validator';
import { Node as PMNode, Schema, Fragment } from 'prosemirror-model';

export interface RenderOutput<T> {
  result: T;
  stat: RenderOutputStat;
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

const SUPPORTS_HIRES_TIMER_API = window.performance && performance.now;

const withStopwatch = <T>(cb: () => T): ResultWithTime<T> => {
  const startTime = SUPPORTS_HIRES_TIMER_API ? performance.now() : Date.now();
  const output = cb();
  const endTime = SUPPORTS_HIRES_TIMER_API ? performance.now() : Date.now();
  const time = endTime - startTime;

  return { output, time };
};

export const renderDocument = <T>(
  doc: any,
  serializer: Serializer<T>,
  schema: Schema = defaultSchema,
  adfStage: ADFStage = 'final',
): RenderOutput<T | null> => {
  const stat: RenderOutputStat = { sanitizeTime: 0 };

  const { output: validDoc, time: sanitizeTime } = withStopwatch(() =>
    getValidDocument(doc, schema, adfStage),
  );

  // save sanitize time to stats
  stat.sanitizeTime = sanitizeTime;

  if (!validDoc) {
    return { stat, result: null };
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

  return { result, stat };
};

export const renderNodes = <T>(
  nodes: ADNode[],
  serializer: Serializer<T>,
  schema: Schema = defaultSchema,
  target?: any,
  adfStage: ADFStage = 'final',
): T | null => {
  const validNodes = nodes.map(n => getValidNode(n, schema, adfStage));

  const pmFragment = Fragment.fromJSON(schema, validNodes);

  return serializer.serializeFragment(pmFragment, {}, target, 'node-0');
};
