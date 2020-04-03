import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Ellipsify } from '../../ellipsify';

const getElementHeight = (wrapper: ReactWrapper, container: HTMLDivElement) => {
  container.appendChild(wrapper.getDOMNode());

  const el = wrapper.find('.ellipsed-text').getDOMNode();
  const height = el.getBoundingClientRect().height;

  container.removeChild(wrapper.getDOMNode());

  return height;
};

const mountEllipsis = (text: string, lines: number, width = 1000) => {
  const wrapper = mount(
    <div style={{ width: `${width}px` }}>
      <Ellipsify text={text} lines={lines} />
    </div>,
  );

  return wrapper;
};

describe.skip('Ellipsify', () => {
  let lineHeight = 0;
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = '<div id="lineheight-check">a</div>';
    document.body.appendChild(container);
    lineHeight = container
      .querySelector('#lineheight-check')!
      .getBoundingClientRect().height;
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('Dont cut text where there are enough lines', () => {
    let wrapper = mountEllipsis('foo', 1);
    let elementHeight = getElementHeight(wrapper, container);

    expect(Math.ceil(elementHeight)).toBe(Math.ceil(lineHeight));

    wrapper = mountEllipsis('foo', 2);
    elementHeight = getElementHeight(wrapper, container);

    expect(Math.ceil(elementHeight)).toBe(Math.ceil(lineHeight));
  });

  it('Cut text where there is not enough lines', () => {
    const wrapper = mountEllipsis(
      'This text should be bigger than two lines',
      2,
      50,
    );
    const elementHeight = getElementHeight(wrapper, container);

    expect(Math.ceil(elementHeight)).toBe(Math.ceil(lineHeight * 2));
  });
});
