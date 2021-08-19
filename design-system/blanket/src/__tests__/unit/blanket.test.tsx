import React from 'react';

import { cleanup, fireEvent, render } from '@testing-library/react';

import Blanket from '../../blanket';

afterEach(cleanup);

describe('ak-blanket', () => {
  describe('exports', () => {
    it('should export a base component', () => {
      expect(Blanket).toBeInstanceOf(Object);
    });
  });

  it('should be possible to create a component', () => {
    expect(render(<Blanket />)).not.toBe(undefined);
  });

  describe('props', () => {
    describe('isTinted', () => {
      it('should not get tint styling by default', () => {
        const { getByRole } = render(<Blanket />);
        const blanket = getByRole('presentation');

        expect(getComputedStyle(blanket).backgroundColor).toBe('transparent');
      });

      it('should get tint styling when prop set', () => {
        const { getByRole } = render(<Blanket isTinted={true} />);
        const blanket = getByRole('presentation');

        expect(getComputedStyle(blanket).backgroundColor).not.toBe(
          'transparent',
        );
      });

      it('should not get tint styling when prop set to false', () => {
        const { getByRole } = render(<Blanket isTinted={false} />);
        const blanket = getByRole('presentation');

        expect(getComputedStyle(blanket).backgroundColor).toBe('transparent');
      });
    });

    describe('shouldAllowClickThrough', () => {
      it('should have pointer-events initial by default', () => {
        const { getByRole } = render(<Blanket testId="blanket" />);
        const blanket = getByRole('presentation');

        expect(getComputedStyle(blanket).pointerEvents).toBe('initial');
      });
      it('should set correct pointer-events values for different shouldAllowClickThrough prop value', () => {
        const { getByRole, rerender } = render(
          <Blanket shouldAllowClickThrough={false} />,
        );
        const blanket = getByRole('presentation');

        expect(getComputedStyle(blanket).pointerEvents).toBe('initial');

        rerender(<Blanket shouldAllowClickThrough={true} />);

        expect(getComputedStyle(blanket).pointerEvents).toBe('none');
      });
      it('should trigger onBlanketClicked when shouldAllowClickThrough is false', () => {
        const onBlanketClicked = jest.fn();
        const { getByRole } = render(
          <Blanket
            shouldAllowClickThrough={false}
            onBlanketClicked={onBlanketClicked}
          />,
        );
        const blanket = getByRole('presentation');
        fireEvent.click(blanket);

        expect(onBlanketClicked).toHaveBeenCalled();
      });
      it('should not trigger onBlanketClicked when shouldAllowClickThrough is true', () => {
        const onBlanketClicked = jest.fn();
        const { getByRole } = render(
          <Blanket
            shouldAllowClickThrough={true}
            onBlanketClicked={onBlanketClicked}
          />,
        );
        const blanket = getByRole('presentation');
        fireEvent.click(blanket);

        expect(onBlanketClicked).not.toHaveBeenCalled();
      });
    });

    describe('onBlanketClicked', () => {
      it('should trigger when blanket clicked', () => {
        const onBlanketClicked = jest.fn();
        const { getByRole } = render(
          <Blanket onBlanketClicked={onBlanketClicked} />,
        );
        const blanket = getByRole('presentation');
        fireEvent.click(blanket);

        expect(onBlanketClicked).toHaveBeenCalled();
      });
    });

    describe('children', () => {
      it('should render children when the children prop is passed to blanket', () => {
        const { getByRole } = render(
          <Blanket>
            <p>blanket with children</p>
          </Blanket>,
        );
        const blanket = getByRole('presentation');

        expect(blanket.innerText).toBe('blanket with children');
      });
    });

    describe('testId', () => {
      it('should be passed as data-testid attribute of the blanket', () => {
        const { getByRole } = render(<Blanket testId="blanket-test" />);
        const blanket = getByRole('presentation');

        expect(blanket.getAttribute('data-testid')).toBe('blanket-test');
      });
    });
  });
});
