import { Schema } from 'prosemirror-model';

import { ADFEntity, ValidationError, validator } from '@atlaskit/adf-utils';

const errorCallbackFor = (marks: any) => {
  return (
    entity: ADFEntity,
    error: ValidationError,
    options: {
      isMark?: any;
      allowUnsupportedBlock?: boolean | undefined;
      allowUnsupportedInline?: boolean | undefined;
    },
  ) => {
    return validationErrorHandler(entity, error, options, marks);
  };
};

export const validationErrorHandler = (
  entity: ADFEntity,
  error: ValidationError,
  options: {
    isMark?: any;
    allowUnsupportedBlock?: boolean | undefined;
    allowUnsupportedInline?: boolean | undefined;
  },
  marks: string[],
) => {
  // TODO - add analytics
  // to be done in ED-9483

  if (options.isMark) {
    return wrapWithUnsupported(error.meta as ADFEntity, 'mark');
  }

  if (marks.indexOf(entity.type) > -1) {
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

  // Can't fix it by wrapping
  // TODO: We can repair missing content like `panel` without a `paragraph`.
  if (error.code === 'INVALID_CONTENT_LENGTH') {
    return entity;
  }

  if (options.allowUnsupportedBlock) {
    return wrapWithUnsupported(entity);
  }

  if (options.allowUnsupportedInline) {
    return wrapWithUnsupported(entity, 'inline');
  }

  return entity;
};

export const validateADFEntity = (
  schema: Schema,
  node: ADFEntity,
): ADFEntity => {
  const nodes = Object.keys(schema.nodes);
  const marks = Object.keys(schema.marks);
  const validate = validator(nodes, marks, { allowPrivateAttributes: true });
  const emptyDoc: ADFEntity = { type: 'doc', content: [] };

  const { entity = emptyDoc } = validate(node, errorCallbackFor(marks));

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
