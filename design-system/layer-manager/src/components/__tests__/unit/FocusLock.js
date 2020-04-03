import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import { FocusLock } from '../../..';

// TODO: Couple of tests have been already tracked in react-focus-lock no need to repeat them.
// https://github.com/theKashey/react-focus-lock/commit/72deb577d43b86af2ae374e3d861c330b3a52be4

const textContent = elem => (elem ? elem.textContent : '');

const documentBody = fn => {
  if (!document.body) {
    throw new Error('expected document.body to exist');
  } else {
    fn(document.body);
  }
};
const nextTick = fn =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        fn();
        resolve();
      } catch (e) {
        reject(e);
      }
    }, 0);
  });

class FocusLockWithState extends React.Component {
  static propTypes = {
    defaultEnabled: PropTypes.bool,
  };

  state = {
    enabled: this.props.defaultEnabled,
  };

  render() {
    const { enabled } = this.state;
    return (
      <FocusLock enabled={enabled}>
        {this.props.children(enabled, () =>
          this.setState({ enabled: !enabled }),
        )}
      </FocusLock>
    );
  }
}

describe('FocusLock', () => {
  let rootElement;
  let wrapper;

  /**
   * These tests check the focused element via `document.activeElement`.
   *
   * The default `mount()` method mounts into a div but doesn't attach it to the DOM.
   *
   * In order for `document.activeElement` to function as intended we need to explicitly
   * mount it into the DOM. We do this using the `attachTo` property.
   *
   * We mount to a div instead of `document.body` directly to avoid a react render warning.
   */
  beforeAll(() => {
    rootElement = document.createElement('div');
    document.body.appendChild(rootElement);
  });

  afterEach(() => {
    if (wrapper) wrapper.unmount();
    wrapper = undefined;
  });

  afterAll(() => {
    if (rootElement) {
      document.body.removeChild(rootElement);
      rootElement = undefined;
    }
  });

  it('should focus button', () => {
    wrapper = mount(
      <FocusLock enabled>
        <button>Button 1</button>
      </FocusLock>,
      { attachTo: rootElement },
    );
    expect(textContent(document.activeElement)).toBe('Button 1');
  });

  it('should focus what is returned by the function', () => {
    const ref = React.createRef();
    /* eslint-disable jsx-a11y/no-autofocus */
    wrapper = mount(
      <FocusLock>
        <button>Button 1</button>
        <button autoFocus ref={ref}>
          Button 2
        </button>
      </FocusLock>,
      { attachTo: rootElement },
    );
    expect(textContent(document.activeElement)).toBe('Button 2');
  });

  it('should focus in last rendered lock', () => {
    wrapper = mount(
      <div>
        <FocusLock enabled>
          <button>Button 1</button>
        </FocusLock>
        <FocusLock enabled>
          <button>Button 2</button>
        </FocusLock>
        <FocusLock enabled>
          <button>Button 3</button>
        </FocusLock>
      </div>,
      { attachTo: rootElement },
    );
    expect(textContent(document.activeElement)).toBe('Button 3');
  });

  it('should focus last enabled lock', () => {
    wrapper = mount(
      <div>
        <FocusLock enabled>
          <button>Button 1</button>
        </FocusLock>
        <FocusLock enabled>
          <button>Button 2</button>
        </FocusLock>
        <FocusLock enabled={false}>
          <button>Button 3</button>
        </FocusLock>
      </div>,
      { attachTo: rootElement },
    );
    expect(textContent(document.activeElement)).toBe('Button 2');
  });

  it('should focus on inner lock', () => {
    const outer = createRef();
    const inner = createRef();
    wrapper = mount(
      <FocusLock enabled>
        <button ref={outer}>Button 1</button>
        <FocusLock enabled>
          <button ref={inner}>Button 2</button>
        </FocusLock>
      </FocusLock>,
      { attachTo: rootElement },
    );
    expect(inner.current).toBe(document.activeElement);
  });

  it('should work through Portals', () => {
    class Portal extends React.Component {
      domNode = document.createElement('div');

      constructor(props) {
        super(props);
        documentBody(body => body.appendChild(this.domNode));
      }

      componentWillUnmount() {
        documentBody(body => body.removeChild(this.domNode));
      }

      render() {
        return ReactDOM.createPortal(this.props.children, this.domNode);
      }
    }

    wrapper = mount(
      <div>
        <Portal>
          <FocusLock enabled>
            <button>Button 1</button>
          </FocusLock>
        </Portal>
        <Portal>
          <FocusLock enabled>
            <button>Button 2</button>
          </FocusLock>
        </Portal>
        <Portal>
          <FocusLock enabled>
            <button>Button 3</button>
          </FocusLock>
        </Portal>
      </div>,
      { attachTo: rootElement },
    );
    expect(textContent(document.activeElement)).toBe('Button 3');
  });

  it('should focus on previous lock after state change', () => {
    const ref = React.createRef();
    wrapper = mount(
      <div>
        <FocusLock enabled>
          <button ref={ref}>Button 1</button>
        </FocusLock>
        <FocusLockWithState defaultEnabled>
          {(enabled, toggle) => (
            <button id="button-2" onClick={toggle}>
              {`Button 2 ${enabled ? 'locked' : 'unlocked'}`}
            </button>
          )}
        </FocusLockWithState>
      </div>,
      { attachTo: rootElement },
    );
    wrapper.find('#button-2').simulate('click');
    return nextTick(() =>
      expect(textContent(document.activeElement)).toBe('Button 1'),
    );
  });

  it('should focus on previous lock after a couple of state changes', () => {
    const ref = React.createRef();
    wrapper = mount(
      <div>
        <FocusLock enabled>
          <button>Button 1</button>
        </FocusLock>
        <FocusLockWithState defaultEnabled>
          {(enabled, toggle) => (
            <button id="button-2" onClick={toggle} ref={ref}>
              {`Button 2 ${enabled ? 'locked' : 'unlocked'}`}
            </button>
          )}
        </FocusLockWithState>
      </div>,
      { attachTo: rootElement },
    );
    wrapper.find('#button-2').simulate('click');
    wrapper.find('#button-2').simulate('click');
    return nextTick(() =>
      expect(textContent(document.activeElement)).toBe('Button 2 locked'),
    );
  });
});
