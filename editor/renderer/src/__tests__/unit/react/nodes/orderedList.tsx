import React from 'react';
import { mount, shallow } from 'enzyme';
import OrderedList from '../../../../react/nodes/orderedList';
import { RendererContextProvider } from '../../../../renderer-context';

describe('Renderer - React/Nodes/OrderedList', () => {
  it('should wrap content with <ol>-tag with no start prop', () => {
    const orderedList = shallow(
      <OrderedList>This is a ordered list</OrderedList>,
    );
    expect(orderedList.is('ol')).toEqual(true);
    expect(orderedList.prop('start')).toEqual(undefined);
  });

  it('should wrap content with <ol>-tag with start prop', () => {
    const orderedList = shallow(
      <OrderedList start={3}>This is a ordered list</OrderedList>,
    );
    expect(orderedList.is('ol')).toEqual(true);
    expect(orderedList.prop('start')).toEqual(3);
  });

  describe('restartNumberedLists (custom start numbers) enabled', () => {
    const contextValue = {
      featureFlags: { restartNumberedLists: true },
    };

    it('should wrap content with <ol>-tag with no start prop', () => {
      const wrapper = mount(
        <RendererContextProvider value={contextValue}>
          <OrderedList>This is a ordered list</OrderedList>
        </RendererContextProvider>,
      );
      const orderedList = wrapper.find('ol');
      expect(orderedList).toBeDefined();
      expect(orderedList.prop('start')).toEqual(undefined);
    });

    it('should wrap content with <ol>-tag with start prop', () => {
      const wrapper = mount(
        <RendererContextProvider value={contextValue}>
          <OrderedList order={3}>This is a ordered list</OrderedList>
        </RendererContextProvider>,
      );
      const orderedList = wrapper.find('ol');
      expect(orderedList).toBeDefined();
      expect(orderedList.prop('start')).toEqual(3);
    });

    it('should wrap content with <ol>-tag with start prop rounded down', () => {
      const wrapper = mount(
        <RendererContextProvider value={contextValue}>
          <OrderedList order={3.5}>This is a ordered list</OrderedList>
        </RendererContextProvider>,
      );
      const orderedList = wrapper.find('ol');
      expect(orderedList).toBeDefined();
      expect(orderedList.prop('start')).toEqual(3);
    });
  });
});
