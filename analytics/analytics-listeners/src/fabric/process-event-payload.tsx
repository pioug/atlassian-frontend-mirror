import {
  DEFAULT_SOURCE,
  GasPayload,
  GasScreenEventPayload,
} from '@atlaskit/analytics-gas-types';
import {
  ELEMENTS_CONTEXT,
  EDITOR_CONTEXT,
} from '@atlaskit/analytics-namespaced-context';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import merge from 'lodash/merge';
import { ELEMENTS_TAG } from './FabricElementsListener';
import { EDITOR_TAG } from './FabricEditorListener';

const extractFieldsFromContext = (fieldsToPick: string[]) => (
  contexts: Record<string, any>[],
) =>
  contexts
    .map((ctx) =>
      fieldsToPick.reduce(
        (result, key) =>
          ctx[key] ? merge(result, { [key]: ctx[key] }) : result,
        {},
      ),
    )
    .reduce((result, item) => merge(result, item), {});

const fieldExtractor = (contextKey: string) =>
  extractFieldsFromContext([
    'source',
    'objectType',
    'objectId',
    'containerType',
    'containerId',
    contextKey,
  ]);

const getContextKey = (tag: string): string => {
  switch (tag) {
    case ELEMENTS_TAG:
      return ELEMENTS_CONTEXT;
    case EDITOR_TAG:
      return EDITOR_CONTEXT;
    default:
      return '';
  }
};

const updatePayloadWithContext = (
  primaryTag: string,
  event: UIAnalyticsEvent,
): GasPayload | GasScreenEventPayload => {
  if (event.context.length === 0) {
    return { source: DEFAULT_SOURCE, ...event.payload } as
      | GasPayload
      | GasScreenEventPayload;
  }

  const contextKey = getContextKey(primaryTag) || 'attributes';
  const {
    [contextKey]: attributes,
    ...fields
  }: Record<string, any> = fieldExtractor(contextKey)(event.context);

  if (attributes) {
    event.payload.attributes = merge(
      attributes,
      event.payload.attributes || {},
    );
  }
  return { source: DEFAULT_SOURCE, ...fields, ...event.payload } as
    | GasPayload
    | GasScreenEventPayload;
};

const addTags = (tags: string[], originalTags: string[] = []): string[] => {
  const mergedTags = new Set([...originalTags, ...tags]);
  return Array.from(mergedTags);
};

/**
 * The primary tag is used for matching the analytics event payload
 * with its context.
 */
function getPrimaryTag(tags: string | string[]) {
  if (typeof tags === 'string') {
    return tags;
  }
  if (!tags.length) {
    throw new Error(
      'Empty tags string array. Unable to match analytics event payload with context',
    );
  }
  return tags[0];
}

export const processEventPayload = (
  event: UIAnalyticsEvent,
  tags: string | string[],
): GasPayload | GasScreenEventPayload => {
  const primaryTag = getPrimaryTag(tags);
  const tagsArray = typeof tags === 'string' ? [tags] : tags;
  return {
    ...updatePayloadWithContext(primaryTag, event),
    tags: addTags(tagsArray, event.payload.tags),
  };
};
