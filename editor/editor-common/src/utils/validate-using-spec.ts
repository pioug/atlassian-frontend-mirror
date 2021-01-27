import { Schema } from 'prosemirror-model';

import {
  ADFEntity,
  ErrorCallbackOptions,
  ValidationError,
  ValidationErrorMap,
  validator,
} from '@atlaskit/adf-utils';

export const UNSUPPORTED_NODE_ATTRIBUTE = 'unsupportedNodeAttribute';

import { ACTION_SUBJECT_ID, UnsupportedContentPayload } from './analytics';
import { fireUnsupportedEvent } from './track-unsupported-content';

type DispatchAnalyticsEvent = (event: UnsupportedContentPayload) => void;

const errorCallbackFor = (
  marks: any,
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
) => {
  return (
    entity: ADFEntity,
    error: ValidationError,
    options: ErrorCallbackOptions,
  ) => {
    return validationErrorHandler(
      entity,
      error,
      options,
      marks,
      dispatchAnalyticsEvent,
    );
  };
};

export const validationErrorHandler = (
  entity: ADFEntity,
  error: ValidationError,
  options: ErrorCallbackOptions,
  marks: string[],
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
) => {
  if (entity && entity.type === UNSUPPORTED_NODE_ATTRIBUTE) {
    return entity;
  }

  if (options.isMark) {
    return wrapWithUnsupported(error.meta as ADFEntity, 'mark');
  }

  if (options.isNodeAttribute) {
    const entityType = entity && entity.type ? entity.type : undefined;
    return {
      type: UNSUPPORTED_NODE_ATTRIBUTE,
      attrs: {
        type: { nodeType: entityType },
        unsupported: error.meta,
      },
    };
  }

  if (entity && marks.indexOf(entity.type) > -1) {
    return;
  }

  /**
   * There's a inconsistency between ProseMirror and ADF.
   * `content` is actually optional in ProseMirror.
   * And, also empty `text` node is not valid.
   */
  if (error.code === 'MISSING_PROPERTIES' && entity.type === 'paragraph') {
    return { type: 'paragraph', content: [] };
  }

  // TODO: We can repair missing content like `panel` without a `paragraph`.
  if (error.code === 'INVALID_CONTENT_LENGTH') {
    if (error.meta) {
      const meta = error.meta as ValidationErrorMap['INVALID_CONTENT_LENGTH'];
      if (
        options.allowUnsupportedBlock &&
        meta.type === 'maximum' &&
        entity.content
      ) {
        entity.content = entity.content
          .filter((x): x is ADFEntity => !!x)
          .map((child, index) => {
            return index >= meta.requiredLength
              ? wrapWithUnsupported(child)
              : child;
          });
      } else {
        // Can't fix it by wrapping
        if (dispatchAnalyticsEvent) {
          trackValidationError(dispatchAnalyticsEvent, error, entity);
        }
      }
    } else {
      // Can't fix it by wrapping
      if (dispatchAnalyticsEvent) {
        trackValidationError(dispatchAnalyticsEvent, error, entity);
      }
    }

    return entity;
  }
  if (options.allowUnsupportedBlock) {
    return wrapWithUnsupported(entity);
  }

  if (options.allowUnsupportedInline) {
    return wrapWithUnsupported(entity, 'inline');
  }

  if (dispatchAnalyticsEvent) {
    trackValidationError(dispatchAnalyticsEvent, error, entity);
  }
  return entity;
};

function trackValidationError(
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
  error: ValidationError,
  entity: ADFEntity,
) {
  if (!dispatchAnalyticsEvent) {
    return;
  }
  fireUnsupportedEvent(
    dispatchAnalyticsEvent,
    ACTION_SUBJECT_ID.UNSUPPORTED_ERROR,
    entity,
    error.code,
  );
}

export const validateADFEntity = (
  schema: Schema,
  node: ADFEntity,
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
): ADFEntity => {
  const nodes = Object.keys(schema.nodes);
  const marks = Object.keys(schema.marks);
  const validate = validator(nodes, marks, { allowPrivateAttributes: true });
  const emptyDoc: ADFEntity = { type: 'doc', content: [] };

  const { entity = emptyDoc } = validate(
    node,
    errorCallbackFor(marks, dispatchAnalyticsEvent),
  );

  return entity;
};

export function wrapWithUnsupported(
  originalValue: ADFEntity,
  type: 'block' | 'inline' | 'mark' = 'block',
) {
  let unsupportedNodeType: string;
  switch (type) {
    case 'inline':
      unsupportedNodeType = 'unsupportedInline';
      break;

    case 'mark':
      unsupportedNodeType = 'unsupportedMark';
      break;

    default:
      unsupportedNodeType = 'unsupportedBlock';
  }

  return {
    type: unsupportedNodeType,
    attrs: { originalValue },
  };
}
