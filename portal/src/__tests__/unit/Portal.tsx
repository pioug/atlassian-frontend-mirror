import React, { ReactNode } from 'react';
import { mount } from 'enzyme';
import Portal from '../..';
import { PORTAL_MOUNT_EVENT, PORTAL_UNMOUNT_EVENT } from '../../constants';

const App = ({ children }: { children: ReactNode }) => <div>{children}</div>;

const zIndex = (elem: HTMLElement | void) =>
  elem ? parseInt(elem.style.getPropertyValue('z-index'), 10) : 0;

let wrapper: any;

const onMountListener = jest.fn();
const onUnmountListener = jest.fn();

beforeEach(() => {
  window.addEventListener(PORTAL_MOUNT_EVENT, onMountListener);
  window.addEventListener(PORTAL_UNMOUNT_EVENT, onUnmountListener);
});

afterEach(() => {
  wrapper && wrapper.unmount();

  window.removeEventListener(PORTAL_MOUNT_EVENT, onMountListener);
  window.removeEventListener(PORTAL_UNMOUNT_EVENT, onUnmountListener);
});

test('should create a portal', () => {
  wrapper = mount(
    <App>
      <Portal>
        <div>Hi</div>
      </Portal>
    </App>,
  );
  const elements = document.getElementsByClassName('atlaskit-portal');
  expect(wrapper.find(App).html()).toBe('<div></div>');
  expect(elements).toHaveLength(1);
  expect(elements[0].innerHTML).toBe('<div>Hi</div>');
});

test('should use z-index to stack nested portals', () => {
  wrapper = mount(
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
  const getElement = (text: string) =>
    [...((elements as unknown) as Array<HTMLElement>)].find(
      e => e.innerHTML.indexOf(text) > -1,
    );
  const front = getElement('front');
  const back = getElement('back');
  expect(zIndex(front)).toBeGreaterThan(zIndex(back));
});

test('should use DOM ordering to stack sibiling portals', () => {
  wrapper = mount(
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
  const [back, front] = (elements as unknown) as Array<HTMLElement>;
  expect(zIndex(front)).toEqual(zIndex(back));
  expect(back.nextSibling).toBe(front);
});

test('should create a new stacking context', () => {
  wrapper = mount(
    <App>
      <Portal>
        <div>Hi</div>
      </Portal>
    </App>,
  );
  const container = document.querySelector(
    'body > .atlaskit-portal-container',
  ) as HTMLElement;
  expect(container && container.style.getPropertyValue('display')).toBe('flex');
});

test('should accept a string for zIndex', () => {
  wrapper = mount(
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
  wrapper = mount(<Wrapper renderPortal />);
  wrapper.setProps({ renderPortal: false });
  const parent = document.querySelector('.atlaskit-portal-container');
  expect(parent).toBeNull();
  const portal = document.querySelector('.atlaskit-portal');
  expect(portal).toBeNull();
});

test('portal mounts children only when it is attached to DOM', () => {
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
  wrapper = mount(<Wrapper renderPortal />);
  expect(DOMElement).not.toBeNull();
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
  wrapper = mount(<Wrapper renderPortal />);
  expect(onMountListener).toHaveBeenCalledWith(
    expect.objectContaining({
      type: PORTAL_MOUNT_EVENT,
      detail: {
        layer: 'blanket',
        zIndex: 500,
      },
    }),
  );

  wrapper.setProps({ renderPortal: false });
  expect(onUnmountListener).toHaveBeenCalledWith(
    expect.objectContaining({
      type: PORTAL_UNMOUNT_EVENT,
      detail: {
        layer: 'blanket',
        zIndex: 500,
      },
    }),
  );
});

test('should send correct layer event for card', () => {
  wrapper = mount(
    <App>
      <Portal zIndex={100}>
        <div>Hi</div>
      </Portal>
    </App>,
  );

  expect(onMountListener).toHaveBeenCalledWith(
    expect.objectContaining({
      type: PORTAL_MOUNT_EVENT,
      detail: {
        layer: 'card',
        zIndex: 100,
      },
    }),
  );
});

test('should send correct layer event for navigation', () => {
  wrapper = mount(
    <App>
      <Portal zIndex={200}>
        <div>Hi</div>
      </Portal>
    </App>,
  );

  expect(onMountListener).toHaveBeenCalledWith(
    expect.objectContaining({
      type: PORTAL_MOUNT_EVENT,
      detail: {
        layer: 'navigation',
        zIndex: 200,
      },
    }),
  );
});

test('should send correct layer event for dialog', () => {
  wrapper = mount(
    <App>
      <Portal zIndex={300}>
        <div>Hi</div>
      </Portal>
    </App>,
  );

  expect(onMountListener).toHaveBeenCalledWith(
    expect.objectContaining({
      type: PORTAL_MOUNT_EVENT,
      detail: {
        layer: 'dialog',
        zIndex: 300,
      },
    }),
  );
});

test('should send correct layer event for layer', () => {
  wrapper = mount(
    <App>
      <Portal zIndex={400}>
        <div>Hi</div>
      </Portal>
    </App>,
  );

  expect(onMountListener).toHaveBeenCalledWith(
    expect.objectContaining({
      type: PORTAL_MOUNT_EVENT,
      detail: {
        layer: 'layer',
        zIndex: 400,
      },
    }),
  );
});

test('should send correct layer event for blanket', () => {
  wrapper = mount(
    <App>
      <Portal zIndex={500}>
        <div>Hi</div>
      </Portal>
    </App>,
  );

  expect(onMountListener).toHaveBeenCalledWith(
    expect.objectContaining({
      type: PORTAL_MOUNT_EVENT,
      detail: {
        layer: 'blanket',
        zIndex: 500,
      },
    }),
  );
});

test('should send correct layer event for modal', () => {
  wrapper = mount(
    <App>
      <Portal zIndex={510}>
        <div>Hi</div>
      </Portal>
    </App>,
  );

  expect(onMountListener).toHaveBeenCalledWith(
    expect.objectContaining({
      type: PORTAL_MOUNT_EVENT,
      detail: {
        layer: 'modal',
        zIndex: 510,
      },
    }),
  );
});

test('should send correct layer event for flag', () => {
  wrapper = mount(
    <App>
      <Portal zIndex={600}>
        <div>Hi</div>
      </Portal>
    </App>,
  );

  expect(onMountListener).toHaveBeenCalledWith(
    expect.objectContaining({
      type: PORTAL_MOUNT_EVENT,
      detail: {
        layer: 'flag',
        zIndex: 600,
      },
    }),
  );
});

test('should send correct layer event for spotlight', () => {
  wrapper = mount(
    <App>
      <Portal zIndex={700}>
        <div>Hi</div>
      </Portal>
    </App>,
  );

  expect(onMountListener).toHaveBeenCalledWith(
    expect.objectContaining({
      type: PORTAL_MOUNT_EVENT,
      detail: {
        layer: 'spotlight',
        zIndex: 700,
      },
    }),
  );
});

test('should send correct layer event for tooltip', () => {
  wrapper = mount(
    <App>
      <Portal zIndex={800}>
        <div>Hi</div>
      </Portal>
    </App>,
  );

  expect(onMountListener).toHaveBeenCalledWith(
    expect.objectContaining({
      type: PORTAL_MOUNT_EVENT,
      detail: {
        layer: 'tooltip',
        zIndex: 800,
      },
    }),
  );
});
