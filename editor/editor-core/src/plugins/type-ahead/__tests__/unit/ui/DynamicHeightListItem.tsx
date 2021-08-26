import React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import type { TypeAheadItem } from '../../../types';
import {
  DynamicHeightListItem,
  UpdateListItemHeightContext,
} from '../../../ui/DynamicHeightListItem';
import { ResizeObserverContext } from '../../../ui/hooks/use-resize-observer';

let container: HTMLElement | null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container!);
  container = null;
  cleanup();
});

describe('DynamicHeightListItem', () => {
  const data: Array<TypeAheadItem> = [
    {
      title: 'Item One',
    },
  ];
  const style = {};
  const FAKE_HEIGHT = 98;
  let fakeResizeObserver: ResizeObserver;
  let fakeUpdateListItemCallback: jest.Mock;

  beforeEach(() => {
    fakeResizeObserver = {
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    };
    fakeUpdateListItemCallback = jest.fn();
  });
  describe('when the component mounts', () => {
    it('should creates the onResize function around', () => {
      const { getByTestId } = render(
        <ResizeObserverContext.Provider value={fakeResizeObserver}>
          <DynamicHeightListItem index={0} data={data} style={style} />
        </ResizeObserverContext.Provider>,
        {
          container: container!,
        },
      );

      const firstRenderComponent = getByTestId('list-item-height-observed-0');

      expect((firstRenderComponent as any).onResize).toBeDefined();
    });

    it('should call the observe from the ResizeObserver', () => {
      render(
        <ResizeObserverContext.Provider value={fakeResizeObserver}>
          <DynamicHeightListItem index={0} data={data} style={style} />
        </ResizeObserverContext.Provider>,
      );

      expect(fakeResizeObserver.observe).toHaveBeenCalledWith(
        expect.any(HTMLElement),
      );
    });
  });

  describe('when the component unmounts', () => {
    it('should call the observe from the ResizeObserver', () => {
      const { unmount } = render(
        <ResizeObserverContext.Provider value={fakeResizeObserver}>
          <DynamicHeightListItem index={0} data={data} style={style} />
        </ResizeObserverContext.Provider>,
      );

      act(() => {
        unmount();
      });

      expect(fakeResizeObserver.unobserve).toHaveBeenCalledWith(
        expect.any(HTMLElement),
      );
    });
  });

  describe('when the component resizes', () => {
    const createPromise = () => {
      const resolveRef: Record<'current', Function> = {
        current: () => {},
      };
      const promise = new Promise((_resolve) => {
        resolveRef.current = _resolve;
      });

      const resolve = () => {
        resolveRef.current();
      };

      return { promise, resolve };
    };

    it('should call the updateItemHeight', async () => {
      const { promise, resolve } = createPromise();

      (fakeResizeObserver.observe as jest.Mock).mockImplementation((target) => {
        promise.then(() => {
          target.onResize({
            contentRect: { height: FAKE_HEIGHT },
          });
        });
      });

      render(
        <ResizeObserverContext.Provider value={fakeResizeObserver}>
          <UpdateListItemHeightContext.Provider
            value={fakeUpdateListItemCallback}
          >
            <DynamicHeightListItem index={0} data={data} style={style} />
          </UpdateListItemHeightContext.Provider>
        </ResizeObserverContext.Provider>,
      );

      act(() => {
        resolve();
      });

      await promise;

      expect(fakeUpdateListItemCallback).toHaveBeenCalledWith({
        index: 0,
        height: FAKE_HEIGHT,
      });
    });
  });
});
