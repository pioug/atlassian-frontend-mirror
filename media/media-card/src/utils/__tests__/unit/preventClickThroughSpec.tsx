import { mount } from 'enzyme';
import React from 'react';

import {
  PreventClickThrough,
  createPreventClickThrough,
} from '../../preventClickThrough';

describe('<PreventClickThrough />', () => {
  it('should prevent outer on click handler to be called', () => {
    const onOuterClick = jest.fn();
    const onInnerClick = jest.fn();

    const wrapper = mount(
      <div id="outer" onClick={onOuterClick}>
        <PreventClickThrough>
          <div id="inner" onClick={onInnerClick} />
        </PreventClickThrough>
      </div>,
    );

    const innerElement = wrapper.find('#inner');
    innerElement.simulate('click');

    expect(onInnerClick).toBeCalled();
    expect(onOuterClick).not.toBeCalled();
  });
});

describe('createPreventClickThrough', () => {
  it('should create an onClick function that stops propagation', () => {
    const onOuterClick = jest.fn();
    const onInnerClick = jest.fn();

    const wrapper = mount(
      <div id="outer" onClick={onOuterClick}>
        <div id="inner" onClick={createPreventClickThrough(onInnerClick)} />
      </div>,
    );

    const innerElement = wrapper.find('#inner');
    innerElement.simulate('click');

    expect(onInnerClick).toBeCalled();
    expect(onOuterClick).not.toBeCalled();
  });
});
