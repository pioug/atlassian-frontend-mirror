import React, { ReactNode } from 'react';

import { cleanup, render } from '@testing-library/react';

import { PORTAL_MOUNT_EVENT, PORTAL_UNMOUNT_EVENT } from '../../constants';
import Portal from '../../index';

const App = ({ children }: { children: ReactNode }) => <div>{children}</div>;

const zIndex = (elem: HTMLElement | void) =>
  elem ? parseInt(elem.style.getPropertyValue('z-index'), 10) : 0;

const onMountListener = jest.fn();
const onUnmountListener = jest.fn();

const getElement = (text: string, elements: HTMLCollectionOf<Element>) =>
  [...((elements as unknown) as Array<HTMLElement>)].find(
    e => e.innerHTML.indexOf(text) > -1,
  );

const getMountEventObject = (
  layer: string,
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

  test(' should use z-index to stack nested portals', () => {
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

    const front = getElement('front', elements);
    const back = getElement('back', elements);

    expect(zIndex(front)).toBeGreaterThan(zIndex(back));
  });

  test(' should use DOM ordering to stack sibiling portals', () => {
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

    const front = getElement('front', elements);
    const back = getElement('back', elements);

    expect(zIndex(front)).toEqual(zIndex(back));
    expect(back?.nextSibling).toBe(front);
  });

  test(' should create a new stacking context', () => {
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

  test(' should accept a string for zIndex', () => {
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

  test(' should clean up elements after unmount', () => {
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

  test(' portal mounts children only when it is attached to DOM', () => {
    let DOMElement = null;
    class ChildComponent extends React.Component<{}> {
      componentDidMount() {
        DOMElement = document.querySelector('body');
      }

      render() {
        return <div>Hello World!!</div>;
      }
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

  test(' should send correct mount and unmount events', () => {
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

  test(' should send correct layer event for every layer', () => {
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
  });
});
