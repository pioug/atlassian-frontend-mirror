import { containsClassName } from '../../../utils/dom';

describe('@atlaskit/editore-core/utils/dom', () => {
  describe('#containsClassName', () => {
    describe('when the element does contains classList', () => {
      it('should returns true for exist className', () => {
        const div = document.createElement('div');

        div.classList.add('opa');

        expect(containsClassName(div, 'opa')).toBeTruthy();
      });

      it('should returns false for non exist className', () => {
        const div = document.createElement('div');

        expect(containsClassName(div, 'opa')).toBeFalsy();
      });
    });

    describe('when the element does not contains classList', () => {
      const fakeSVG = {
        className: {
          baseVal: 'opa',
        },
      } as SVGElement;

      it('should returns true for exist className', () => {
        expect(containsClassName(fakeSVG, 'opa')).toBeTruthy();
      });

      it('should returns false for non exist className', () => {
        expect(containsClassName(fakeSVG, 'non-opa')).toBeFalsy();
      });
    });
  });
});
