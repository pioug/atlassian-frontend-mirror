import React from 'react';
import { mount } from 'enzyme';
import { ViewportDetector } from '../../viewportDetector';

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

const setup = () => {
  const Child = () => <>Hi!</>;
  const callBack = jest.fn();
  const cardEl = document.createElement('div');
  const component = mount(
    <ViewportDetector onVisible={callBack} cardEl={cardEl}>
      <Child />
    </ViewportDetector>,
  );
  return { component, Child, callBack, cardEl };
};

describe('ViewportDetector logic:', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('ViewportDetector', () => {
    it('should observe cardEl', () => {
      const { cardEl } = setup();

      expect(observeMock).toBeCalledTimes(1);
      expect(observeMock).toHaveBeenNthCalledWith(1, cardEl);
    });

    it('should call callback & disconnect when observe node(s) in viewport', () => {
      const { component, Child, callBack } = setup();
      expect(component.find(Child)).toHaveLength(1);
      expect(observeMock).toBeCalledTimes(1);

      intersectionTrigger();

      expect(callBack).toBeCalledTimes(1);
      expect(disconnectMock).toBeCalledTimes(1);
    });
  });
});
