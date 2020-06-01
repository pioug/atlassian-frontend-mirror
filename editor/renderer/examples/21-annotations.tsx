import React from 'react';
import RendererDemo from './helper/RendererDemo';
import { AnnotationState } from '@atlaskit/editor-common';
import {
  AnnotationTypes,
  AnnotationMarkStates,
  AnnotationId,
} from '@atlaskit/adf-schema';

const idsAndStates: Array<[AnnotationId, AnnotationMarkStates]> = [
  ['18983b72-dd27-41f4-9171-a4f2e180ca83', AnnotationMarkStates.ACTIVE],
  ['18983b72-dd27-41f4-9171-a4f2e180secon', AnnotationMarkStates.RESOLVED],
];

const data = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'some unresolved comment',
          marks: [
            {
              type: 'annotation',
              attrs: {
                annotationType: 'inlineComment',
                id: idsAndStates[0][0],
              },
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'a resolved comment ',
          marks: [
            {
              type: 'annotation',
              attrs: {
                annotationType: 'inlineComment',
                id: idsAndStates[1][0],
              },
            },
          ],
        },
      ],
    },
  ],
};

function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

const annotationProvider = {
  [AnnotationTypes.INLINE_COMMENT]: {
    getState: async (
      ids: AnnotationId[],
    ): Promise<
      AnnotationState<AnnotationTypes.INLINE_COMMENT, AnnotationMarkStates>[]
    > => {
      const result = ids
        .map(id => {
          const idAndState = idsAndStates.find(x => x[0] === id);

          if (idAndState) {
            return {
              id,
              annotationType: AnnotationTypes.INLINE_COMMENT,
              state: idAndState[1],
            };
          }
        })
        .filter(nonNullable);

      return result;
    },
  },
};

export default function Example() {
  return (
    <RendererDemo
      appearance="full-page"
      serializer="react"
      document={data}
      annotationProvider={annotationProvider}
      allowAnnotations
    />
  );
}
