import { Schema, Node as PMNode } from 'prosemirror-model';
import {
  AnnotationTypes,
  AnnotationMarkStates,
  annotation,
} from '@atlaskit/adf-schema';
import { AnnotationState } from '@atlaskit/editor-common';
import {
  Deferred,
  cleanAnnotations,
  getAnnotationDeferred,
  resolveAnnotationPromises,
  getAllAnnotationMarks,
} from '../../annotations';

describe('Utils: Annotations', () => {
  beforeEach(() => {
    cleanAnnotations();
  });

  describe('#getAnnotationDeferred', () => {
    describe('when there is a new annotation id', () => {
      it('should return a new deffered', () => {
        const result = getAnnotationDeferred('sss');

        expect(result).toBeDefined();
      });
    });

    describe('when there is an existed annotation id', () => {
      it('should return the same one', () => {
        const sameId = 'sameId';
        const resultOne = getAnnotationDeferred(sameId);
        const resultTwo = getAnnotationDeferred(sameId);

        expect(resultOne).toEqual(resultTwo);
      });
    });
  });

  describe('#resolveAnnotationPromises', () => {
    const sameId = 'sameId';
    let deferredPromise: Deferred<AnnotationMarkStates>;

    beforeEach(() => {
      deferredPromise = getAnnotationDeferred(sameId);
    });

    describe('when there is no data to resolve', () => {
      it('should do nothing', done => {
        resolveAnnotationPromises([]);

        process.nextTick(() => {
          expect(deferredPromise.isFulfilled).toBeFalsy();
          done();
        });
      });
    });

    describe('when there is data', () => {
      it('should resolve the promise', async () => {
        const data: AnnotationState<
          AnnotationTypes.INLINE_COMMENT,
          AnnotationMarkStates
        > = {
          annotationType: AnnotationTypes.INLINE_COMMENT,
          id: sameId,
          state: AnnotationMarkStates.ACTIVE,
        };
        resolveAnnotationPromises([data]);

        const result = await deferredPromise.promise;

        expect(deferredPromise.isFulfilled).toBeTruthy();
        expect(result).toEqual(AnnotationMarkStates.ACTIVE);
      });
    });
  });

  describe('#getAllAnnotationMarks', () => {
    const annotationsId: string[] = ['id_1', 'id_2', 'id_3'];
    const mySchema = new Schema({
      nodes: {
        doc: {
          content: 'block+',
        },

        text: {
          group: 'inline',
        },

        paragraph: {
          content: 'inline*',
          group: 'block',
          marks: 'annotation',
        },
      },

      marks: {
        annotation,
      },
    });

    const myDoc = {
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

    it('should return all annotation ids from a prosemirror node', () => {
      const result = getAllAnnotationMarks(
        mySchema,
        PMNode.fromJSON(mySchema, myDoc),
      );

      expect(result).toEqual({
        [AnnotationTypes.INLINE_COMMENT]: annotationsId,
      });
    });
  });
});
