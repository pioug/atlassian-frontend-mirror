import React from 'react';
import { render } from '@testing-library/react';
import useFocus from '../use-focus';

/**
 * Create an rtl container and attach elements to it rather than the document itself.
 *
 * original rtl error:
 * Rendering components directly into document.body is discouraged,
 * since its children are often manipulated by third-party scripts and browser extensions.
 * This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.
 */
const createRTLContainer = () => {
  let container: HTMLDivElement | null;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'rtlContainer';
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    container = null;
  });
};

const focusAndMount = (focus: boolean) => {
  const Component = () => {
    const ref = useFocus(focus);
    return (
      <div ref={ref} data-testid="test-div" tabIndex={0}>
        Hello World
      </div>
    );
  };
  return render(<Component />);
};

describe('useFocus', () => {
  createRTLContainer();
  it('focuses on a DOM element when initialising argument is true', () => {
    const wrapper = focusAndMount(true);
    expect(document.activeElement).toBe(wrapper.container.childNodes[0]);
    wrapper.unmount();
  });
  it('does not focus on a DOM element when initialising argument is false', () => {
    const wrapper = focusAndMount(false);
    expect(document.activeElement).not.toBe(wrapper.container.childNodes[0]);
    wrapper.unmount();
  });
});
