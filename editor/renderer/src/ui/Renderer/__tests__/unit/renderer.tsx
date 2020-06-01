import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import {
  AnnotationMarkStates,
  AnnotationTypes,
  AnnotationId,
} from '@atlaskit/adf-schema';
import { AnnotationState } from '@atlaskit/editor-common';
import { Renderer } from '../../';

describe('Renderer', () => {
  const annotationsId: string[] = ['id_1', 'id_2', 'id_3'];
  const adf = {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'rodrigo',
            marks: [
              {
                type: 'annotation',
                attrs: {
                  id: annotationsId[0],
                },
              },
            ],
          },
          {
            type: 'text',
            text: ' banana ',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'melao ',
          },
          {
            type: 'text',
            text: 'bola',
            marks: [
              {
                type: 'annotation',
                attrs: {
                  id: annotationsId[1],
                },
              },
              {
                type: 'annotation',
                attrs: {
                  id: annotationsId[2],
                },
              },
            ],
          },
        ],
      },
    ],
  };

  describe('annotationProvider', () => {
    it('should call the provider with ids inside of the document', () => {
      const myMock = jest.fn();
      const annotationProvider = {
        [AnnotationTypes.INLINE_COMMENT]: {
          getState: async (
            ids: AnnotationId[],
          ): Promise<
            AnnotationState<
              AnnotationTypes.INLINE_COMMENT,
              AnnotationMarkStates
            >[]
          > => {
            myMock(ids);
            return ids.map(id => ({
              id,
              annotationType: AnnotationTypes.INLINE_COMMENT,
              state: AnnotationMarkStates.ACTIVE,
            }));
          },
        },
      };

      act(() => {
        mount(
          <Renderer
            annotationProvider={annotationProvider}
            document={adf}
            allowAnnotations
          />,
        );
      });

      expect(myMock).toHaveBeenCalledWith(annotationsId);
    });
  });
});
