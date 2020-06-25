import { MarkSpec } from 'prosemirror-model';

/**
 * @name annotation_mark
 */
export interface AnnotationMarkDefinition {
  type: 'annotation';
  attrs: AnnotationMarkAttributes;
}

export interface AnnotationMarkAttributes {
  id: AnnotationId;
  annotationType: AnnotationTypes;
}

export type AnnotationId = string;
export enum AnnotationTypes {
  INLINE_COMMENT = 'inlineComment',
}
export enum AnnotationMarkStates {
  RESOLVED = 'resolved',
  ACTIVE = 'active',
}

type AnnotationMarkState = { state?: AnnotationMarkStates | undefined | null };

type SerializedDataAnnotationAttributes = {
  'data-mark-type': string;
  'data-mark-annotation-type': AnnotationTypes;
  'data-id': AnnotationId;
  'data-mark-annotation-state'?: AnnotationMarkStates;
};

export function buildDataAtributes({
  id,
  annotationType,
  state,
}: AnnotationMarkAttributes &
  AnnotationMarkState): SerializedDataAnnotationAttributes {
  const data = {
    'data-mark-type': 'annotation',
    'data-mark-annotation-type': annotationType,
    'data-id': id,
  };

  if (state) {
    return {
      ...data,
      'data-mark-annotation-state': state,
    };
  }

  return data;
}

export const annotation: MarkSpec = {
  inclusive: false,
  group: 'annotation',
  excludes: '',
  attrs: {
    id: {
      default: '',
    },
    annotationType: {
      default: AnnotationTypes.INLINE_COMMENT,
    },
  },
  parseDOM: [
    {
      tag: 'span[data-mark-type="annotation"]',
      skip: true,
    },
  ],
  toDOM(node) {
    /*
      Data attributes on the DOM node are a temporary means of
      incrementally switching over to the Annotation mark. Once renderer
      provides native support for inline comments the data attributes on the
      DOM nodes will be removed.
    */
    return [
      'span',
      {
        // Prettier will remove the quotes around class. This would cause some browsers
        // to not add this attribute properly, as its a reserved word.
        // prettier-ignore
        'class': 'fabric-editor-annotation',
        ...buildDataAtributes({
          id: node.attrs.id as AnnotationId,
          annotationType: node.attrs.annotationType as AnnotationTypes,
        }),
      } as any,
      0,
    ];
  },
};
