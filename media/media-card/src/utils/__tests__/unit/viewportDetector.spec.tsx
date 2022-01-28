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

const setup = (
  preAnchorRef: React.RefObject<HTMLDivElement> = {
    current: document.createElement('div'),
  },
  postAnchorRef: React.RefObject<HTMLDivElement> = {
    current: document.createElement('div'),
  },
) => {
  const Child = () => <>Hi!</>;
  const callBack = jest.fn();
  const cardEl = document.createElement('div');
  const component = mount(
    <ViewportDetector
      onVisible={callBack}
      cardEl={cardEl}
      preAnchorRef={preAnchorRef}
      postAnchorRef={postAnchorRef}
    >
      <Child />
    </ViewportDetector>,
  );
  return { component, Child, callBack, cardEl, preAnchorRef, postAnchorRef };
};

describe('ViewportDetector logic:', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('ViewportDetector', () => {
    it('should observe DOM node referenced by preAnchorRef + postAnchorRef + cardEl', () => {
      const preAnchorEl = document.createElement('div');
      const postAnchorEl = document.createElement('div');
      const { cardEl } = setup(
        { current: preAnchorEl },
        { current: postAnchorEl },
      );

      expect(observeMock).toBeCalledTimes(3);
      expect(observeMock).toHaveBeenNthCalledWith(1, preAnchorEl);
      expect(observeMock).toHaveBeenNthCalledWith(2, postAnchorEl);
      expect(observeMock).toHaveBeenNthCalledWith(3, cardEl);
    });

    it('should observe cardEl if anchorRef is empty', () => {
      const { cardEl } = setup({ current: null }, { current: null });

      expect(observeMock).toBeCalledTimes(1);
      expect(observeMock).toHaveBeenCalledWith(cardEl);
    });

    it('should call callback & disconnect when observe node(s) in viewport', () => {
      const { component, Child, callBack } = setup();
      expect(component.find(Child)).toHaveLength(1);
      expect(observeMock).toBeCalledTimes(3);

      intersectionTrigger();

      expect(callBack).toBeCalledTimes(1);
      expect(disconnectMock).toBeCalledTimes(1);
    });
  });
});
