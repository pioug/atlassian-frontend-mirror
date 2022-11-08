import { calculateConditionalButtons } from '../../scrolling-tabs/scrolling-tabs';

describe('scrolling tabs', () => {
  describe('calculateConditionalButtons', () => {
    let container: HTMLElement;

    beforeAll(() => {
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
        configurable: true,
        value: 320,
      });

      Object.defineProperty(HTMLElement.prototype, 'scrollLeft', {
        configurable: true,
        value: 0,
      });

      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
        configurable: true,
        value: 1066,
      });

      container = document.createElement('div');
    });

    it('should show forward button if scrolling is available and scroll is at initial position', () => {
      expect(calculateConditionalButtons(container, false)).toEqual({
        back: false,
        forward: true,
      });
    });

    it('should show back button if scrolling is available, but scroll is at final position', () => {
      Object.defineProperty(HTMLElement.prototype, 'scrollLeft', {
        configurable: true,
        value: 1066,
      });
      expect(calculateConditionalButtons(container, false)).toEqual({
        back: true,
        forward: false,
      });
    });

    it('should show back and forward buttons if scrolling is available and at a position between initial and final', () => {
      Object.defineProperty(HTMLElement.prototype, 'scrollLeft', {
        configurable: true,
        value: 100,
      });
      expect(calculateConditionalButtons(container, false)).toEqual({
        back: true,
        forward: true,
      });
    });

    it('should show no buttons if no container is available', () => {
      expect(calculateConditionalButtons(null, false)).toEqual({
        back: false,
        forward: false,
      });
    });

    it('should show no buttons if option to hide buttons is set', () => {
      expect(calculateConditionalButtons(container, true)).toEqual({
        back: false,
        forward: false,
      });
    });
  });
});
