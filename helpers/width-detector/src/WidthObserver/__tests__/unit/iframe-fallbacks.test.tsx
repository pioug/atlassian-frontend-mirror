import React from 'react';
import { mount } from 'enzyme';

import {
  IframeWidthObserver,
  IframeWrapperProvider,
  IframeWidthObserverFallbackWrapper,
  IframeWidthObserverFallback,
  SubscribeIframeResizeWhenVisible,
  SubscribeIframeResize,
} from '../../iframe-fallbacks';

jest.mock('../../utils', () => ({
  browser: {
    supportsResizeObserver: true,
    supportsIntersectionObserver: true,
  },
}));

const mockTarget = document.createElement('div');
const mockEntry = {
  target: mockTarget,
  boundingClientRect: {
    width: 0,
  },
};

jest.mock('../../hooks', () => {
  return {
    useInView: () => [jest.fn(), true, mockTarget, mockEntry],
  };
});

describe('Iframe fallbacks', () => {
  const windowIntersectionObserver = window.IntersectionObserver;
  let setWidth = jest.fn();
  let subscribe = jest.fn();
  let observeMock = {
    observe: jest.fn(),
    disconnect: jest.fn(),
  };

  beforeAll(() => {
    (window as any).IntersectionObserver = () => observeMock;
  });

  beforeEach(() => {
    setWidth = jest.fn();
    subscribe = jest.fn();
    observeMock = {
      observe: jest.fn(),
      disconnect: jest.fn(),
    };
  });

  afterAll(() => {
    window.IntersectionObserver = windowIntersectionObserver;
  });

  describe('IframeWidthObserverFallbackWrapper', () => {
    describe('when there is support for ResizeObserver and IntersectionObserver', () => {
      it('should not add the IframeWidthObserverFallback', () => {
        const wrapper = mount(
          <IframeWidthObserverFallbackWrapper>
            <span>1</span>
          </IframeWidthObserverFallbackWrapper>,
        );

        const component = wrapper.find(IframeWidthObserverFallback);
        expect(component).toHaveLength(0);
      });
    });
  });

  describe('SubscribeIframeResizeWhenVisible', () => {
    describe('when the component is mounted', () => {
      it('should call setWidth once', () => {
        mount(
          <SubscribeIframeResizeWhenVisible
            subscribe={subscribe}
            setWidth={setWidth}
          />,
        );

        expect(setWidth).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the subscribe is called', () => {
      it('should call setWidth twice', () => {
        let y = () => {};
        const subscribe = (x: any) => {
          y = x;

          return () => {};
        };
        mount(
          <SubscribeIframeResizeWhenVisible
            subscribe={subscribe}
            setWidth={setWidth}
          />,
        );

        expect(setWidth).toHaveBeenCalledTimes(1);
        y();
        expect(setWidth).toHaveBeenCalledTimes(2);
      });
    });

    describe('when the component is unmounted', () => {
      it('should call the unsubscribe function', () => {
        const unsub = jest.fn();
        const subscribe = () => unsub;
        const wrapper = mount(
          <SubscribeIframeResizeWhenVisible
            subscribe={subscribe}
            setWidth={setWidth}
          />,
        );

        wrapper.unmount();

        expect(unsub).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('SubscribeIframeResize', () => {
    describe('when the component is mounted', () => {
      it('should call setWidth once', () => {
        mount(
          <SubscribeIframeResize subscribe={subscribe} setWidth={setWidth} />,
        );

        expect(setWidth).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the subscribe is called', () => {
      it('should call setWidth twice', () => {
        let y = () => {};
        const subscribe = (x: any) => {
          y = x;

          return () => {};
        };
        mount(
          <SubscribeIframeResize subscribe={subscribe} setWidth={setWidth} />,
        );

        expect(setWidth).toHaveBeenCalledTimes(1);
        y();
        expect(setWidth).toHaveBeenCalledTimes(2);
      });
    });

    describe('when the component is unmounted', () => {
      it('should call the unsubscribe function', () => {
        const unsub = jest.fn();
        const subscribe = () => unsub;
        const wrapper = mount(
          <SubscribeIframeResize subscribe={subscribe} setWidth={setWidth} />,
        );

        wrapper.unmount();

        expect(unsub).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('IframeWidthObserver', () => {
    describe.each`
      useIntersectionObserver | componentName                         | expected
      ${false}                | ${'SubscribeIframeResize'}            | ${SubscribeIframeResize}
      ${true}                 | ${'SubscribeIframeResizeWhenVisible'} | ${SubscribeIframeResizeWhenVisible}
    `(
      'when useIntersectionObserver is $componentName',
      ({ useIntersectionObserver, componentName, expected }) => {
        it(`should use ${componentName} as fallback`, () => {
          const wrapper = mount(
            <IframeWidthObserver
              useIntersectionObserver={useIntersectionObserver}
              setWidth={setWidth}
            />,
          );

          const component = wrapper.find(expected);
          expect(component).toHaveLength(1);
        });

        it(`should passwdown the setWidth to ${componentName}`, () => {
          const wrapper = mount(
            <IframeWidthObserver
              useIntersectionObserver={useIntersectionObserver}
              setWidth={setWidth}
            />,
          );

          const component = wrapper.find(expected);
          expect(component.prop('setWidth')).toBe(setWidth);
        });

        it(`should use IframeWrapperProvider as context to ${componentName}`, () => {
          const wrapper = mount(
            <IframeWrapperProvider value={{ subscribe }}>
              <IframeWidthObserver
                useIntersectionObserver={useIntersectionObserver}
                setWidth={setWidth}
              />
            </IframeWrapperProvider>,
          );

          const component = wrapper.find(expected);
          expect(component.prop('subscribe')).toBe(subscribe);
        });
      },
    );
  });
});
