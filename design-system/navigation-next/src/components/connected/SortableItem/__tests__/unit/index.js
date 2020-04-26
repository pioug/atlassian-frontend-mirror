import React from 'react';

import { shallow } from 'enzyme';
import { Draggable } from 'react-beautiful-dnd';

import Item from '../../../../presentational/Item';
import SortableItem from '../../index';

jest.mock('react-beautiful-dnd', () => {
  const MockDraggable = jest.fn();
  MockDraggable.displayName = 'MockDraggable';
  return {
    Draggable: MockDraggable,
  };
});

describe('SortableItem', () => {
  let baseProps;
  let draggableRenderArgs;
  const draggableRef = {};
  beforeEach(() => {
    jest.clearAllMocks();
    draggableRenderArgs = [
      {
        draggableProps: {
          tabIndex: 0,
          mySpecialProp: 'foo',
        },
        dragHandleProps: {
          anotherProp: 'bar',
        },
        innerRef: draggableRef,
      },
      {
        isDragging: false,
      },
    ];
    Draggable.mockImplementation(({ children }) =>
      children(...draggableRenderArgs),
    );
    baseProps = {
      index: 0,
      text: 'My item',
      id: 'my-item',
      onClick: () => {},
    };
  });

  it('should render an Item component', () => {
    const wrapper = shallow(<SortableItem {...baseProps} />).dive();

    const item = wrapper.find(Item);

    expect(item).toHaveLength(1);
    expect(item.props()).toEqual({
      draggableProps: {
        tabIndex: 0,
        mySpecialProp: 'foo',
        anotherProp: 'bar',
      },
      innerRef: draggableRef,
      isDragging: false,
      styles: expect.any(Function),
      onClick: baseProps.onClick,
      text: 'My item',
      id: 'my-item',
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should wrap Item with a Draggable component', () => {
    const wrapper = shallow(<SortableItem {...baseProps} />);

    const draggable = wrapper.find(Draggable);
    expect(draggable).toHaveLength(1);
    expect(draggable.props()).toEqual({
      draggableId: 'my-item',
      index: 0,
      disableInteractiveElementBlocking: true,
      children: expect.any(Function),
    });
    expect(draggable).toMatchSnapshot();
  });

  it('should not trigger onClick if the item is dragged', () => {
    draggableRenderArgs[1].isDragging = true;
    Draggable.mockImplementation(({ children }) =>
      children(...draggableRenderArgs),
    );
    const wrapper = shallow(<SortableItem {...baseProps} />).dive();

    expect(wrapper.find(Item).prop('onClick')).toBeUndefined();
    expect(wrapper.find(Item).prop('isDragging')).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });

  it('should supply some extra styling', () => {
    const wrapper = shallow(<SortableItem {...baseProps} />).dive();

    const stylesReducer = wrapper.find(Item).prop('styles');

    const stylesWhileDragging = stylesReducer({}, { isDragging: true });
    expect(stylesWhileDragging).toEqual({
      itemBase: {
        boxShadow: expect.any(String),
        cursor: 'grabbing',
      },
    });
    expect(stylesWhileDragging).toMatchSnapshot('while dragging');

    const nonDraggingStyles = stylesReducer({}, { isDragging: false });
    expect(nonDraggingStyles).toEqual({
      itemBase: {
        boxShadow: undefined,
        cursor: 'pointer',
      },
    });
    expect(nonDraggingStyles).toMatchSnapshot('not dragging');
  });
});
