import React from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import { createPortal } from 'react-dom';

import { akEditorTableCellOnStickyHeaderZIndex } from '@atlaskit/editor-shared-styles';

import FixedButton, {
  BUTTON_WIDTH,
  calcLeftPos,
  calcObserverTargetMargin,
} from '../../../plugins/table/ui/FloatingContextualButton/FixedButton';

jest.mock('react-dom', () => ({
  createPortal: jest.fn((node: React.ReactNode) => node),
}));

describe('calcLeftPos()', () => {
  it('should calculate left position', () => {
    let result = calcLeftPos({
      buttonWidth: 0,
      cellRectLeft: 0,
      cellRefWidth: 0,
      offset: 0,
    });
    expect(result).toEqual(0);
    result = calcLeftPos({
      buttonWidth: 20,
      cellRectLeft: 400,
      cellRefWidth: 250,
      offset: 3,
    });
    expect(result).toEqual(627);
  });
});

describe('calcObserverTargetMargin()', () => {
  it('should calculate the margin', () => {
    const mockTableWrapper = document.createElement('div');
    mockTableWrapper.scrollLeft = 50;
    const tableSpy = jest.spyOn(mockTableWrapper, 'getBoundingClientRect');
    tableSpy.mockImplementation(() => ({ left: 800 } as DOMRect));

    const mockButton = document.createElement('div');
    const buttonSpy = jest.spyOn(mockButton, 'getBoundingClientRect');
    buttonSpy.mockImplementation(() => ({ left: 1200 } as DOMRect));

    const result = calcObserverTargetMargin(mockTableWrapper, mockButton);
    expect(result).toEqual(450);
  });
});

describe('<FixedButton />', () => {
  const targetCellRef = document.createElement('div');
  const fixedButtonRef = {
    current: document.createElement('div'),
  };
  const observerTargetRef = {
    current: document.createElement('div'),
  };
  const props = {
    offset: 10,
    stickyHeader: {
      pos: 0,
      top: 0,
      padding: 0,
      sticky: true,
    },
    targetCellPosition: 0,
    targetCellRef,
    mountTo: document.createElement('div'),
    tableWrapper: document.createElement('div'),
    fixedButtonRef,
    observerTargetRef,
    isContextualMenuOpen: false,
  };
  const MockChildren = () => <div data-testid="mock-children" />;

  it('should render children', () => {
    render(
      <FixedButton {...props}>
        <MockChildren />
      </FixedButton>,
    );
    expect(screen.getByTestId('mock-children')).toBeInTheDocument();
  });

  it('should render using createPortal', () => {
    render(
      <FixedButton {...props}>
        <MockChildren />
      </FixedButton>,
    );
    expect(createPortal).toBeCalled();
  });

  describe('observerTargetRef', () => {
    it('should have correct inital styles', () => {
      const { container } = render(
        <FixedButton {...props}>
          <MockChildren />
        </FixedButton>,
      );
      expect(container.firstChild).toHaveStyle(
        `top: 0px; left: 0px; position: absolute; width: ${BUTTON_WIDTH}px; height: ${BUTTON_WIDTH}px`,
      );
    });

    it('should have correct "margin-left" style', () => {
      const mockTableWrapper = document.createElement('div');
      mockTableWrapper.scrollLeft = 123;
      const { container } = render(
        <FixedButton {...props} tableWrapper={mockTableWrapper}>
          <MockChildren />
        </FixedButton>,
      );

      expect(container.firstChild).toHaveStyle(`margin-left: 123px;`);
    });
  });

  describe('fixedButtonRef', () => {
    it('should have correct "top" style', () => {
      const { container, rerender } = render(
        <FixedButton {...props} offset={10}>
          <MockChildren />
        </FixedButton>,
      );
      expect(container.firstChild?.firstChild).toHaveStyle(`top: 20px;`);

      rerender(
        <FixedButton
          {...props}
          stickyHeader={{ pos: 0, top: 3, padding: 0, sticky: true }}
        >
          <MockChildren />
        </FixedButton>,
      );
      expect(container.firstChild?.firstChild).toHaveStyle(`top: 23px;`);

      rerender(
        <FixedButton
          {...props}
          stickyHeader={{ pos: 0, top: 0, padding: 2, sticky: true }}
        >
          <MockChildren />
        </FixedButton>,
      );
      expect(container.firstChild?.firstChild).toHaveStyle(`top: 22px;`);
    });

    it('should have correct "left" style', () => {
      const mockRef = document.createElement('div');
      const mockRefSpy = jest.spyOn(mockRef, 'getBoundingClientRect');
      mockRefSpy.mockImplementation(() => ({ left: 3 } as DOMRect));

      const { container } = render(
        <FixedButton {...props} targetCellRef={mockRef}>
          <MockChildren />
        </FixedButton>,
      );
      expect(container.firstChild?.firstChild).toHaveStyle(`left: -27px;`);
    });

    it('should have correct "z-index" style', () => {
      const { container } = render(
        <FixedButton {...props}>
          <MockChildren />
        </FixedButton>,
      );
      expect(container.firstChild?.firstChild).toHaveStyle(
        `z-index: ${akEditorTableCellOnStickyHeaderZIndex}`,
      );
    });
  });

  describe('useEffect()', () => {
    const observe = jest.fn();
    const unobserve = jest.fn();

    window.IntersectionObserver = jest.fn((callback) => {
      callback([{ isIntersecting: true }]);
      return {
        observe,
        unobserve,
      };
    }) as any;

    it('should add / remove event listener to the table wrapper', () => {
      const mockTableWrapper = document.createElement('div');
      const addSpy = jest.spyOn(mockTableWrapper, 'addEventListener');
      const removeSpy = jest.spyOn(mockTableWrapper, 'removeEventListener');

      render(
        <FixedButton {...props} tableWrapper={mockTableWrapper}>
          <MockChildren />
        </FixedButton>,
      );

      expect(addSpy).toBeCalled();
      cleanup();
      expect(removeSpy).toBeCalled();
    });

    it('should observe / unobserve an InterSectionObserver', () => {
      render(
        <FixedButton {...props}>
          <MockChildren />
        </FixedButton>,
      );

      expect(observe).toHaveBeenCalled();
      cleanup();
      expect(unobserve).toHaveBeenCalled();
    });
  });
});
