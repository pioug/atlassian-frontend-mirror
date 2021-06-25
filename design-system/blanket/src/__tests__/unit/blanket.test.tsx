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
        const { getByTestId } = render(<Blanket testId="blanket" />);
        const blanket = getByTestId('blanket');

        expect(getComputedStyle(blanket).opacity).toBe('0');
      });

      it('should get tint styling when prop set', () => {
        const { getByTestId } = render(
          <Blanket isTinted={true} testId="blanket" />,
        );
        const blanket = getByTestId('blanket');

        expect(getComputedStyle(blanket).opacity).toBe('1');
      });

      it('should not get tint styling when prop set to false', () => {
        const { getByTestId } = render(
          <Blanket isTinted={false} testId="blanket" />,
        );
        const blanket = getByTestId('blanket');

        expect(getComputedStyle(blanket).opacity).toBe('0');
      });
    });

    describe('canClickThrough', () => {
      it('should have pointer-events initial by default', () => {
        const { getByTestId } = render(<Blanket testId="blanket" />);
        const blanket = getByTestId('blanket');

        expect(getComputedStyle(blanket).pointerEvents).toBe('initial');
      });
      it('should set correct pointer-events values for different canClickThrough prop value', () => {
        const { getByTestId, rerender } = render(
          <Blanket canClickThrough={false} testId="blanket" />,
        );
        const blanket = getByTestId('blanket');

        expect(getComputedStyle(blanket).pointerEvents).toBe('initial');

        rerender(<Blanket canClickThrough={true} testId="blanket" />);

        expect(getComputedStyle(blanket).pointerEvents).toBe('none');
      });
      it('should trigger onBlanketClicked when canClickThrough is false', () => {
        const onBlanketClicked = jest.fn();
        const { getByTestId } = render(
          <Blanket
            canClickThrough={false}
            onBlanketClicked={onBlanketClicked}
            testId="blanket"
          />,
        );
        const blanket = getByTestId('blanket');
        fireEvent.click(blanket);

        expect(onBlanketClicked).toHaveBeenCalled();
      });
      it('should not trigger onBlanketClicked when canClickThrough is true', () => {
        const onBlanketClicked = jest.fn();
        const { getByTestId } = render(
          <Blanket
            canClickThrough={true}
            onBlanketClicked={onBlanketClicked}
            testId="blanket"
          />,
        );
        const blanket = getByTestId('blanket');
        fireEvent.click(blanket);

        expect(onBlanketClicked).not.toHaveBeenCalled();
      });
    });

    describe('onBlanketClicked', () => {
      it('should trigger when blanket clicked', () => {
        const onBlanketClicked = jest.fn();
        const { getByTestId } = render(
          <Blanket onBlanketClicked={onBlanketClicked} testId="blanket" />,
        );
        const blanket = getByTestId('blanket');
        fireEvent.click(blanket);

        expect(onBlanketClicked).toHaveBeenCalled();
      });
    });

    describe('testId', () => {
      it('should be passed as data-testid attribute of the blanket', () => {
        const { getByTestId } = render(<Blanket testId="blanket-test" />);
        const blanket = getByTestId('blanket-test');

        expect(blanket.getAttribute('data-testid')).toBe('blanket-test');
      });
    });
  });
});
