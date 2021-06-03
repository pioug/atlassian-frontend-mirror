import React from 'react';

import { mount, shallow } from 'enzyme';

import { LayoutEventEmitter, LayoutEventListener } from '../../LayoutEvent';

describe('LayoutEvent', () => {
  describe('LayoutEventListener', () => {
    it('should provide emitItemDragStart and emitItemDragEnd emitters via context', () => {
      const wrapper = shallow(<LayoutEventListener>Child</LayoutEventListener>);

      expect(wrapper.prop('value')).toEqual({
        emitItemDragStart: expect.any(Function),
        emitItemDragEnd: expect.any(Function),
      });
    });

    it('should call `onItemDragStart` prop when emitItemDragStart is called', () => {
      const onItemDragStart = jest.fn();
      const wrapper = shallow(
        <LayoutEventListener onItemDragStart={onItemDragStart}>
          Child
        </LayoutEventListener>,
      );

      const emitters = wrapper.prop('value');

      expect(onItemDragStart).toHaveBeenCalledTimes(0);
      emitters.emitItemDragStart();
      expect(onItemDragStart).toHaveBeenCalledTimes(1);
    });

    it('should call `onItemDragEnd` prop when emitItemDragEnd is called', () => {
      const onItemDragEnd = jest.fn();
      const wrapper = shallow(
        <LayoutEventListener onItemDragEnd={onItemDragEnd}>
          Child
        </LayoutEventListener>,
      );

      const emitters = wrapper.prop('value');

      expect(onItemDragEnd).toHaveBeenCalledTimes(0);
      emitters.emitItemDragEnd();
      expect(onItemDragEnd).toHaveBeenCalledTimes(1);
    });

    it('should render provided children', () => {
      const wrapper = shallow(<LayoutEventListener>Child</LayoutEventListener>);

      expect(wrapper.text()).toBe('Child');
    });
  });

  describe('LayoutEventEmitter', () => {
    it('should consume `emitItemDragStart` and `emitItemDragEnd` methods provided by listener via context', () => {
      const wrapper = mount(
        <LayoutEventEmitter>
          {(emitters) => <div emitters={emitters} />}
        </LayoutEventEmitter>,
      );

      expect(wrapper.find('div').prop('emitters')).toEqual({
        emitItemDragStart: expect.any(Function),
        emitItemDragEnd: expect.any(Function),
      });
    });
  });
});
