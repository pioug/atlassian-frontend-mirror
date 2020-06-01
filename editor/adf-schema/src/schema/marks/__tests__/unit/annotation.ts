import { AnnotationTypes, buildDataAtributes } from '../../annotation';

describe('marks/annotations', () => {
  describe('#buildDataAtributes', () => {
    it('should return an object with the data attributes', () => {
      const result = buildDataAtributes({
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
