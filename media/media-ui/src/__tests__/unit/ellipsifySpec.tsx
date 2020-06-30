import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Ellipsify } from '../../ellipsify';

const getElementHeight = (wrapper: ReactWrapper, container: HTMLDivElement) => {
  container.appendChild(wrapper.getDOMNode());

  const el = wrapper.find('div.ellipsed-text').getDOMNode();
  const height = el.getBoundingClientRect().height;

  container.removeChild(wrapper.getDOMNode());

  return height;
};

const mountEllipsis = (text: string, lines: number, width = 1000) =>
  mount(
    <div style={{ width: `${width}px` }}>
      <Ellipsify text={text} lines={lines} />
    </div>,
  );

describe('Ellipsify', () => {
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

  it('should not cut short text where there are enough lines when 1 line allowed', () => {
    const wrapper = mountEllipsis('foo', 1);
    const elementHeight = getElementHeight(wrapper, container);

    expect(Math.ceil(elementHeight)).toBe(Math.ceil(lineHeight));
  });

  it('should not cut short text where there are enough lines when 2 lines allowed', () => {
    const wrapper = mountEllipsis('foo', 2);
    const elementHeight = getElementHeight(wrapper, container);

    expect(Math.ceil(elementHeight)).toBe(Math.ceil(lineHeight));
  });

  it('should cut long text when there is not enough lines', () => {
    const wrapper = mountEllipsis(
      'This text should be bigger than two lines',
      2,
      50,
    );
    const elementHeight = getElementHeight(wrapper, container);

    expect(Math.ceil(elementHeight)).toBe(Math.ceil(lineHeight * 2));
  });
});
