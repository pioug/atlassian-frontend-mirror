import React from 'react';

import { shallow } from 'enzyme';
import { Droppable } from 'react-beautiful-dnd';

import Group from '../../../../presentational/Group';
import SortableGroup from '../../index';

jest.mock('react-beautiful-dnd', () => {
  const MockDroppable = jest.fn();
  MockDroppable.displayName = 'MockDroppable';
  return {
    Droppable: MockDroppable,
  };
});

describe('SortableGroup', () => {
  let baseProps;
  let droppableRenderArgs;
  const droppableRef = {};
  beforeEach(() => {
    jest.clearAllMocks();
    droppableRenderArgs = [
      {
        droppableProps: {
          myspecialprop: 'foo',
        },
        placeholder: () => <span>Placeholder</span>,
        innerRef: droppableRef,
      },
      { isDraggingOver: false },
    ];
    Droppable.mockImplementation(({ children }) =>
      children(...droppableRenderArgs),
    );
    baseProps = {
      heading: 'My group',
      id: 'my-group',
    };
  });

  it('should render a Group component', () => {
    const wrapper = shallow(
      <SortableGroup {...baseProps}>Group children</SortableGroup>,
    ).dive();

    const group = wrapper.find(Group);

    expect(group).toHaveLength(1);
    expect(group.props()).toEqual({
      hasSeparator: false,
      heading: 'My group',
      id: 'my-group',
      children: ['Group children', droppableRenderArgs[0].placeholder],
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should wrap Group with a Droppable Component', () => {
    const wrapper = shallow(
      <SortableGroup {...baseProps}>Group children</SortableGroup>,
    );

    const droppable = wrapper.find(Droppable);
    expect(droppable).toHaveLength(1);
    expect(droppable.props()).toEqual({
      children: expect.any(Function),
      droppableId: baseProps.id,
    });
    expect(droppable).toMatchSnapshot();
  });

  it('should spread droppable provided props onto div wrapper around Group', () => {
    const wrapper = shallow(
      <SortableGroup {...baseProps}>Group children</SortableGroup>,
    )
      .find(Droppable)
      .dive();

    expect(wrapper.props()).toEqual(
      expect.objectContaining({
        ...droppableRenderArgs[0].droppableProps,
      }),
    );
  });

  it('should style the div wrapper with default styles and `innerStyle` prop', () => {
    const wrapper = shallow(
      <SortableGroup {...baseProps} innerStyle={{ paddingTop: 400 }}>
        Group children
      </SortableGroup>,
    ).dive();

    expect(wrapper).toMatchSnapshot();
  });

  it('should disable pointerEvents on the group while it is being dragged over', () => {
    droppableRenderArgs[1].isDraggingOver = true;

    Droppable.mockImplementation(({ children }) =>
      children(...droppableRenderArgs),
    );
    const wrapper = shallow(
      <SortableGroup {...baseProps}>Group children</SortableGroup>,
    ).dive();

    expect(wrapper).toMatchSnapshot();
  });
});
