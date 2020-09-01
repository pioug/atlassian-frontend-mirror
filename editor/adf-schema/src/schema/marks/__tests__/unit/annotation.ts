import { AnnotationTypes, buildDataAttributes } from '../../annotation';

describe('marks/annotations', () => {
  describe('#buildDataAttributes', () => {
    it('should return an object with the data attributes', () => {
      const result = buildDataAttributes({
        id: '999',
        annotationType: AnnotationTypes.INLINE_COMMENT,
      });

      expect(result).toEqual({
        'data-mark-type': 'annotation',
        'data-mark-annotation-type': 'inlineComment',
        'data-id': '999',
      });
    });
  });
});
