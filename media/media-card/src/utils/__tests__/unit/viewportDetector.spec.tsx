import React from 'react';
import { mount } from 'enzyme';
import { createViewportDetector } from '../../viewportDetector';
import { LazyContent } from '../../lazyContent';

const observeMock = jest.fn();
const disconnectMock = jest.fn();
let intersectionTrigger: () => void;
const IntersectionObserverMock = jest.fn((intersectionCallback) => {
  const entries: Partial<IntersectionObserverEntry>[] = [
    { isIntersecting: false },
    { isIntersecting: true },
    { isIntersecting: true },
  ];
  intersectionTrigger = () => {
    intersectionCallback(entries, { disconnect: disconnectMock });
  };
  return {
    observe: observeMock,
    disconnect: disconnectMock,
  };
});
(global as any).IntersectionObserver = IntersectionObserverMock;

const setup = (isIntersectionObserverSupported: boolean) => {
  const Child = () => <>Hi!</>;
  const callBack = jest.fn();
  const targetRef = document.createElement('div');
  const ViewportDetector = createViewportDetector(
    isIntersectionObserverSupported,
  );
  const component = mount(
    <ViewportDetector onVisible={callBack} targetRef={targetRef}>
      <Child />
    </ViewportDetector>,
  );
  return { component, Child, callBack, targetRef };
};

describe('ViewportDetector', () => {
  it('should use LazyContent when IntersectionObserver is not supported', () => {
    const { component, Child, callBack } = setup(false);
    expect(component.find(Child)).toHaveLength(1);
    const lazyContent = component.find(LazyContent);
    expect(lazyContent).toHaveLength(1);
    expect(lazyContent.prop('onRender')).toBe(callBack);
    const placeholder = lazyContent.prop('placeholder');
    expect(placeholder).toBeDefined();
  });

  it('should use IntersectionObserver when supported', () => {
    const { component, Child, callBack } = setup(true);
    expect(component.find(Child)).toHaveLength(1);
    expect(component.find(LazyContent)).toHaveLength(0);

    intersectionTrigger();
    expect(observeMock).toBeCalledTimes(1);
    expect(disconnectMock).toBeCalledTimes(1);
    expect(callBack).toBeCalledTimes(1);
  });
});
