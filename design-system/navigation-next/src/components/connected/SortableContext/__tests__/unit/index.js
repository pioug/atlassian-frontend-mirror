import React from 'react';

import { shallow } from 'enzyme';
import { DragDropContext } from 'react-beautiful-dnd';

import { LayoutEventEmitter } from '../../../../presentational/LayoutManager/LayoutEvent';
import SortableContext from '../../index';

jest.mock('../../../../presentational/LayoutManager/LayoutEvent', () => {
  const mock = jest.fn();
  mock.displayName = 'MockLayoutEventEmitter';
  return {
    LayoutEventEmitter: mock,
  };
});

const MockLayoutEventEmitter = LayoutEventEmitter;

describe('SortableContext', () => {
  let baseProps;
  let sectionChildren;
  const layoutEventEmitters = {
    emitItemDragStart: jest.fn(),
    emitItemDragEnd: jest.fn(),
  };
  beforeEach(() => {
    jest.clearAllMocks();
    MockLayoutEventEmitter.mockImplementation(({ children }) =>
      children(layoutEventEmitters),
    );
    baseProps = {
      id: 'my-section',
      onDragEnd: () => {},
    };
    sectionChildren = <div>Children</div>;
  });

  it('should render a DragDropContext Component', () => {
    const onDragUpdate = () => {};
    const wrapper = shallow(
      <SortableContext {...baseProps} onDragUpdate={onDragUpdate}>
        {sectionChildren}
      </SortableContext>,
    ).dive();

    const dragDropContext = wrapper.find(DragDropContext);
    expect(dragDropContext).toHaveLength(1);
    expect(dragDropContext.props()).toEqual({
      children: sectionChildren,
      onDragStart: expect.any(Function),
      onDragUpdate,
      onDragEnd: expect.any(Function),
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should emit a drag start event and call `onDragStart` when a drag has started', () => {
    const onDragStartArgs = [{}, {}];
    const onDragStart = jest.fn();
    const wrapper = shallow(
      <SortableContext {...baseProps} onDragStart={onDragStart}>
        {sectionChildren}
      </SortableContext>,
    ).dive();

    expect(onDragStart).not.toHaveBeenCalled();
    expect(layoutEventEmitters.emitItemDragStart).not.toHaveBeenCalled();

    wrapper.find(DragDropContext).prop('onDragStart')(...onDragStartArgs);

    expect(layoutEventEmitters.emitItemDragStart).toHaveBeenCalledTimes(1);
    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(onDragStart).toHaveBeenCalledWith(...onDragStartArgs);
  });

  it('should emit a drag end event and call `onDragEnd` when a drag has ended', () => {
    const onDragEndArgs = [{}, {}];
    const onDragEnd = jest.fn();
    const wrapper = shallow(
      <SortableContext {...baseProps} onDragEnd={onDragEnd}>
        {sectionChildren}
      </SortableContext>,
    ).dive();

    expect(onDragEnd).not.toHaveBeenCalled();
    expect(layoutEventEmitters.emitItemDragEnd).not.toHaveBeenCalled();

    wrapper.find(DragDropContext).prop('onDragEnd')(...onDragEndArgs);

    expect(layoutEventEmitters.emitItemDragEnd).toHaveBeenCalledTimes(1);
    expect(onDragEnd).toHaveBeenCalledTimes(1);
    expect(onDragEnd).toHaveBeenCalledWith(...onDragEndArgs);
  });

  it('should call `onDragUpdate` when a drag has updated', () => {
    const onDragUpdateArgs = [{}, {}];
    const onDragUpdate = jest.fn();
    const wrapper = shallow(
      <SortableContext {...baseProps} onDragUpdate={onDragUpdate}>
        {sectionChildren}
      </SortableContext>,
    ).dive();

    expect(onDragUpdate).not.toHaveBeenCalled();

    wrapper.find(DragDropContext).prop('onDragUpdate')(...onDragUpdateArgs);

    expect(onDragUpdate).toHaveBeenCalledTimes(1);
    expect(onDragUpdate).toHaveBeenCalledWith(...onDragUpdateArgs);
  });
});
