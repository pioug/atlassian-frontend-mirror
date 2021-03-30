import React, { ReactNode, useEffect } from 'react';

import { cleanup, render } from '@testing-library/react';

import { PORTAL_MOUNT_EVENT, PORTAL_UNMOUNT_EVENT } from '../../constants';
import Portal from '../../index';
import { portalParentSelector } from '../../internal/constants';
import * as domUtils from '../../internal/utils/portal-dom-utils';

const App = ({ children }: { children: ReactNode }) => <div>{children}</div>;

const zIndex = (elem: HTMLElement | void) =>
  elem ? parseInt(elem.style.getPropertyValue('z-index'), 10) : 0;

const onMountListener = jest.fn();
const onUnmountListener = jest.fn();
const appendPortalContainerSpy = jest.spyOn(domUtils, 'appendPortalContainer');
const removePortalContainerSpy = jest.spyOn(domUtils, 'removePortalContainer');
const createContainerSpy = jest.spyOn(domUtils, 'createContainer');
const removePortalParentIfNoMorePortalsSpy = jest.spyOn(
  domUtils,
  'removePortalParentContainerIfNoMorePortals',
);

const getElementByText = (text: string, elements: HTMLCollectionOf<Element>) =>
  [...((elements as unknown) as Array<HTMLElement>)].find(
    e => e.innerHTML.indexOf(text) > -1,
  );

const getMountEventObject = (
  layer: string | null,
  zIndex: string | number,
  isUnmount?: boolean,
) => ({
  type: isUnmount ? PORTAL_UNMOUNT_EVENT : PORTAL_MOUNT_EVENT,
  detail: {
    layer: layer,
    zIndex: zIndex,
  },
});

beforeEach(() => {
  jest.clearAllMocks();
  window.addEventListener(PORTAL_MOUNT_EVENT, onMountListener);
  window.addEventListener(PORTAL_UNMOUNT_EVENT, onUnmountListener);
});

afterEach(() => {
  cleanup();
  window.removeEventListener(PORTAL_MOUNT_EVENT, onMountListener);
  window.removeEventListener(PORTAL_UNMOUNT_EVENT, onUnmountListener);
});

describe('Portal container', () => {
  test('should be able to render a portal', () => {
    const { container } = render(
      <App>
        <Portal>
          <div>Hi</div>
        </Portal>
      </App>,
    );
    const elements = document.getElementsByClassName('atlaskit-portal');
    expect(container.innerHTML).toBe('<div></div>');
    expect(elements).toHaveLength(1);
    expect(elements[0].innerHTML).toBe('<div>Hi</div>');
  });

  test('should use z-index to stack nested portals', async () => {
    render(
      <App>
        <Portal>
          <div>back</div>
          <Portal zIndex={1}>
            <div>front</div>
          </Portal>
        </Portal>
      </App>,
    );
    const elements = document.getElementsByClassName('atlaskit-portal');
    expect(elements).toHaveLength(2);
    const front = getElementByText('front', elements);
    const back = getElementByText('back', elements);
    expect(zIndex(front)).toBeGreaterThan(zIndex(back));
  });

  test('should use DOM ordering to stack sibiling portals', () => {
    render(
      <App>
        <Portal>
          <div>back</div>
        </Portal>
        <Portal>
          <div>front</div>
        </Portal>
      </App>,
    );
    const elements = document.getElementsByClassName('atlaskit-portal');
    expect(elements).toHaveLength(2);

    const front = getElementByText('front', elements);
    const back = getElementByText('back', elements);

    expect(zIndex(front)).toEqual(zIndex(back));
    expect(back?.nextSibling).toBe(front);
  });

  test('should create a new stacking context', () => {
    render(
      <App>
        <Portal>
          <div>Hi</div>
        </Portal>
      </App>,
    );
    const container = document.querySelector(
      'body > .atlaskit-portal-container',
    ) as HTMLElement;
    expect(container && container.style.getPropertyValue('display')).toBe(
      'flex',
    );
  });

  test('should accept a string for zIndex', () => {
    render(
      <App>
        <Portal zIndex="unset">
          <div>Hi</div>
        </Portal>
      </App>,
    );
    const elements = (document.getElementsByClassName(
      'atlaskit-portal',
    ) as unknown) as Array<HTMLElement>;
    expect(elements).toHaveLength(1);
    expect(elements[0].style.getPropertyValue('z-index')).toBe('unset');
  });

  test('should clean up elements after unmount', () => {
    const Wrapper = ({ renderPortal }: { renderPortal: boolean }) => (
      <App>
        {renderPortal && (
          <Portal zIndex={500}>
            <div>Hi</div>
          </Portal>
        )}
      </App>
    );
    const { rerender } = render(<Wrapper renderPortal />);
    expect(document.querySelector('.atlaskit-portal-container')).toBeDefined();
    expect(document.querySelector('.atlaskit-portal')).toBeDefined();

    rerender(<Wrapper renderPortal={false} />);
    expect(document.querySelector('.atlaskit-portal-container')).toBeNull();
    expect(document.querySelector('.atlaskit-portal')).toBeNull();
  });

  test('portal mounts children only when it is attached to DOM', () => {
    let DOMElement = null;
    function ChildComponent() {
      useEffect(() => {
        DOMElement = document.querySelector('body');
      });
      return <div>Hello World!!</div>;
    }

    const Wrapper = ({ renderPortal }: { renderPortal: boolean }) => (
      <App>
        {renderPortal && (
          <Portal zIndex={500}>
            <ChildComponent />
          </Portal>
        )}
      </App>
    );
    const { rerender } = render(<Wrapper renderPortal={false} />);
    expect(DOMElement).toBeNull();

    rerender(<Wrapper renderPortal />);
    expect(DOMElement).toBeDefined();
  });

  test('should send correct mount and unmount events', () => {
    const Wrapper = ({ renderPortal }: { renderPortal: boolean }) => (
      <App>
        {renderPortal && (
          <Portal zIndex={500}>
            <div>Hi</div>
          </Portal>
        )}
      </App>
    );
    const { rerender } = render(<Wrapper renderPortal />);
    expect(onMountListener).toHaveBeenCalledWith(
      expect.objectContaining(getMountEventObject('blanket', 500)),
    );

    rerender(<Wrapper renderPortal={false} />);
    expect(onUnmountListener).toHaveBeenCalledWith(
      expect.objectContaining(getMountEventObject('blanket', 500, true)),
    );
  });

  test('should send correct layer event for every layer', () => {
    const Wrapper = ({ zIndex }: { zIndex: number | string }) => (
      <App>
        <Portal zIndex={zIndex}>
          <div>Hi</div>
        </Portal>
      </App>
    );
    render(<Wrapper zIndex={100} />);

    expect(onMountListener).toHaveBeenCalledWith(
      expect.objectContaining(getMountEventObject('card', 100)),
    );

    render(<Wrapper zIndex={200} />);

    expect(onMountListener).toHaveBeenCalledWith(
      expect.objectContaining(getMountEventObject('navigation', 200)),
    );

    render(<Wrapper zIndex={300} />);

    expect(onMountListener).toHaveBeenCalledWith(
      expect.objectContaining(getMountEventObject('dialog', 300)),
    );

    render(<Wrapper zIndex={400} />);

    expect(onMountListener).toHaveBeenCalledWith(
      expect.objectContaining(getMountEventObject('layer', 400)),
    );

    render(<Wrapper zIndex={510} />);

    expect(onMountListener).toHaveBeenCalledWith(
      expect.objectContaining(getMountEventObject('modal', 510)),
    );

    render(<Wrapper zIndex={600} />);

    expect(onMountListener).toHaveBeenCalledWith(
      expect.objectContaining(getMountEventObject('flag', 600)),
    );

    render(<Wrapper zIndex={700} />);

    expect(onMountListener).toHaveBeenCalledWith(
      expect.objectContaining(getMountEventObject('spotlight', 700)),
    );

    render(<Wrapper zIndex={800} />);

    expect(onMountListener).toHaveBeenCalledWith(
      expect.objectContaining(getMountEventObject('tooltip', 800)),
    );

    // case when z-index does not have corresponding layer name
    render(<Wrapper zIndex={1234} />);

    expect(onMountListener).toHaveBeenCalledWith(
      expect.objectContaining(getMountEventObject(null, 1234)),
    );
  });

  test('should delete old portal container and append new portal container on z-index change', () => {
    const PortalWrapper = ({ zIndex }: { zIndex: number }) => (
      <Portal zIndex={zIndex}>
        <div>Hi</div>
      </Portal>
    );
    const { rerender } = render(<PortalWrapper zIndex={100} />);
    expect(appendPortalContainerSpy).toHaveBeenCalledTimes(1);
    expect(createContainerSpy).toHaveBeenCalledTimes(1);
    jest.clearAllMocks();
    rerender(<PortalWrapper zIndex={200} />);
    expect(removePortalContainerSpy).toHaveBeenCalledTimes(1);
    expect(appendPortalContainerSpy).toHaveBeenCalledTimes(1);
    expect(createContainerSpy).toHaveBeenCalledTimes(1);
  });

  test('should delete old portal parent container when no more portals are there and append new portal portal container when new portal is created', () => {
    const PortalWrapper = ({ zIndex }: { zIndex: number }) => (
      <Portal zIndex={zIndex}>
        <div>Hi</div>
      </Portal>
    );
    const { rerender } = render(<PortalWrapper zIndex={100} />);
    expect(document.querySelector(portalParentSelector)).toBeInTheDocument();
    rerender(<PortalWrapper zIndex={200} />);
    expect(removePortalParentIfNoMorePortalsSpy).toHaveBeenCalledTimes(1);
    expect(document.querySelector(portalParentSelector)).toBeInTheDocument();
  });
  test('should memoize container creation and not create new portal container when portal is re rendered with same z-index', () => {
    const PortalWrapper = ({ zIndex }: { zIndex: number }) => (
      <Portal zIndex={zIndex}>
        <div>Hi</div>
      </Portal>
    );
    const { rerender } = render(<PortalWrapper zIndex={100} />);
    jest.clearAllMocks();
    rerender(<PortalWrapper zIndex={100} />);
    expect(removePortalParentIfNoMorePortalsSpy).toHaveBeenCalledTimes(0);
    expect(createContainerSpy).toHaveBeenCalledTimes(0);
    expect(removePortalContainerSpy).toHaveBeenCalledTimes(0);
    expect(appendPortalContainerSpy).toHaveBeenCalledTimes(0);
  });
  test('should memoize container creation and not create new portal container when portal is re rendered with different children', () => {
    const PortalWrapper = ({ children }: { children: JSX.Element }) => (
      <Portal zIndex={100}>{children}</Portal>
    );
    const { rerender } = render(
      <PortalWrapper>
        <div>Lorem Ipsum</div>
      </PortalWrapper>,
    );
    jest.clearAllMocks();
    rerender(
      <PortalWrapper>
        <p>Dolor Sit</p>
      </PortalWrapper>,
    );
    expect(removePortalParentIfNoMorePortalsSpy).toHaveBeenCalledTimes(0);
    expect(createContainerSpy).toHaveBeenCalledTimes(0);
    expect(removePortalContainerSpy).toHaveBeenCalledTimes(0);
    expect(appendPortalContainerSpy).toHaveBeenCalledTimes(0);
  });
});
