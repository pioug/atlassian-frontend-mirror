import { renderHook, act } from '@testing-library/react-hooks';

import {
  useDynamicListHeightCalculation,
  calcVisibleListHeight,
} from '../../../../ui/hooks/use-dynamic-list-height-calculation';
import throttle from 'lodash/throttle';
jest.mock('lodash/throttle', () => jest.fn((fn) => fn));

jest.useFakeTimers();
describe('Hooks: useDynamicListHeightCalculation', () => {
  let getFirstVisibleIndex = jest.fn();
  let props = {
    redrawListAtIndex: jest.fn(),
    getFirstVisibleIndex,
    listLength: 10,
    listMaxHeight: 100,
    listItemEstimatedHeight: 10,
  };

  beforeEach(() => {
    getFirstVisibleIndex.mockReturnValue(0);
    props = {
      redrawListAtIndex: jest.fn(),
      getFirstVisibleIndex,
      listLength: 10,
      listMaxHeight: 100,
      listItemEstimatedHeight: 10,
    };
    (throttle as jest.Mock).mockClear();
    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: Function) => cb());
  });

  afterEach(() => {
    (window.requestAnimationFrame as jest.Mock).mockRestore();
  });

  it('should return renderedListHeight as null in the first run', () => {
    const { result } = renderHook(() => useDynamicListHeightCalculation(props));

    expect(result.current.renderedListHeight).toEqual(null);
  });

  describe('when the hook is mounted', () => {
    it('should throttle the animation frame request', () => {
      renderHook(() => useDynamicListHeightCalculation(props));

      expect(throttle).toHaveBeenCalledTimes(1);
    });

    describe('when rerender with same props', () => {
      it('should throttle the animation frame request', () => {
        const { rerender } = renderHook(() =>
          useDynamicListHeightCalculation(props),
        );

        (throttle as jest.Mock).mockClear();

        act(() => {
          rerender(props);
        });

        expect(throttle).not.toHaveBeenCalled();
      });
    });
  });

  describe('when the list items heigth are updated', () => {
    it('should update the renderedListHeight', () => {
      props.listLength = 3;
      const { result, rerender } = renderHook(() =>
        useDynamicListHeightCalculation(props),
      );

      act(() => {
        result.current.setListItemHeight({
          index: 0,
          height: 11,
        });
      });

      act(() => {
        result.current.setListItemHeight({
          index: 1,
          height: 11,
        });
      });

      act(() => {
        result.current.setListItemHeight({
          index: 2,
          height: 11,
        });
      });

      rerender();

      expect(result.current.renderedListHeight).toEqual(33);
    });
  });
  describe('when the height calculated is zero', () => {
    it('should not update the renderedListHeight', () => {
      props.listMaxHeight = 0;
      const { result, rerender } = renderHook(() =>
        useDynamicListHeightCalculation(props),
      );

      act(() => {
        result.current.setListItemHeight({
          index: 0,
          height: 11,
        });
      });

      rerender();

      expect(result.current.renderedListHeight).toBeNull();
    });
  });

  describe('when the getListItemHeight is called with a non-calculated height', () => {
    it('should return the estimated height', () => {
      const { result } = renderHook(() =>
        useDynamicListHeightCalculation(props),
      );

      expect(result.current.getListItemHeight(0)).toEqual(
        props.listItemEstimatedHeight,
      );
    });
  });

  describe('when the setListItemHeight is called', () => {
    describe('and when the height is not a valid number', () => {
      it('should not update the index height map', () => {
        const { result } = renderHook(() =>
          useDynamicListHeightCalculation(props),
        );

        act(() => {
          result.current.setListItemHeight({
            index: 0,
            // @ts-ignore
            height: 'lol',
          });
        });

        expect(result.current.getListItemHeight(0)).toEqual(
          props.listItemEstimatedHeight,
        );
      });

      it('should schedule any frame', () => {
        const { result } = renderHook(() =>
          useDynamicListHeightCalculation(props),
        );

        act(() => {
          result.current.setListItemHeight({
            index: 0,
            // @ts-ignore
            height: 'lol',
          });
        });

        expect(window.requestAnimationFrame).not.toHaveBeenCalled();
      });
    });

    it('should wait until the next frame to apply the math and redraw the list', () => {
      const { result } = renderHook(() =>
        useDynamicListHeightCalculation(props),
      );

      act(() => {
        result.current.setListItemHeight({
          index: 0,
          height: 11,
        });
      });

      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should update the index height map', () => {
      const { result } = renderHook(() =>
        useDynamicListHeightCalculation(props),
      );

      act(() => {
        result.current.setListItemHeight({
          index: 0,
          height: 11,
        });
      });

      expect(result.current.getListItemHeight(0)).toEqual(11);
    });

    describe('when the same index is update twice', () => {
      it('should update the map with the last value', () => {
        const { result } = renderHook(() =>
          useDynamicListHeightCalculation(props),
        );

        act(() => {
          result.current.setListItemHeight({
            index: 0,
            height: 11,
          });
        });

        act(() => {
          result.current.setListItemHeight({
            index: 0,
            height: 18,
          });
        });

        expect(result.current.getListItemHeight(0)).toEqual(18);
      });
    });

    describe('when there is no data about the heigth of the last visible item', () => {
      it('should not call the redrawListAtIndex', () => {
        getFirstVisibleIndex.mockReturnValue(35);

        const { result } = renderHook(() =>
          useDynamicListHeightCalculation(props),
        );

        act(() => {
          result.current.setListItemHeight({
            index: 0,
            height: 11,
          });
        });

        expect(props.redrawListAtIndex).not.toHaveBeenCalled();
      });
    });

    it('should call the redrawListAtIndex callback', () => {
      const { result } = renderHook(() =>
        useDynamicListHeightCalculation(props),
      );

      act(() => {
        result.current.setListItemHeight({
          index: 0,
          height: 11,
        });
      });

      expect(props.redrawListAtIndex).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the list length changes', () => {
    it('should reset the index heigth map', () => {
      props.listLength = 3;

      const { result, rerender } = renderHook(() =>
        useDynamicListHeightCalculation(props),
      );

      act(() => {
        result.current.setListItemHeight({
          index: 0,
          height: 11,
        });
      });

      act(() => {
        props.listLength = 9;
        rerender(props);
      });

      expect(result.current.getListItemHeight(0)).toEqual(
        props.listItemEstimatedHeight,
      );
    });
  });

  describe('calcVisibleListHeight', () => {
    it('should should calc the space starting from the startIndex', () => {
      const result = calcVisibleListHeight({
        startIndex: 1,
        indexHeightMap: [140],
        limit: 10,
        listMaxHeight: 300,
        listItemEstimatedHeight: 10,
      });

      expect(result).toBe(90);
    });

    describe('when the indexHeightMap is empty', () => {
      it('should calc the heigth using the estimatedHeight', () => {
        const result = calcVisibleListHeight({
          startIndex: 0,
          indexHeightMap: [],
          limit: 10,
          listMaxHeight: 300,
          listItemEstimatedHeight: 15,
        });

        expect(result).toBe(150);
      });
    });

    it('should return the max heigth when the items height overflow', () => {
      const result = calcVisibleListHeight({
        startIndex: 0,
        indexHeightMap: [10, 10, 10, 10, 10],
        limit: 10,
        listMaxHeight: 30,
        listItemEstimatedHeight: 15,
      });

      expect(result).toBe(30);
    });
  });
});
