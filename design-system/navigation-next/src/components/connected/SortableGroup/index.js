import React, { Component } from 'react';

import { Droppable } from 'react-beautiful-dnd';

import Group from '../../presentational/Group';

const defaultStyles = {
  minHeight: 64,
  // Remove browser default button styles for rbdnd placeholder
  '& > button': {
    background: 'none',
    border: 'none',
    padding: 'none',
  },
};

// This will automatically be applied for us as part of react-beautiful-dnd v10
const applyDraggingStyles = (snapshot) => ({
  pointerEvents: snapshot.isDraggingOver ? 'none' : undefined,
});

export default class SortableGroup extends Component {
  render() {
    // eslint-disable-next-line react/prop-types
    const { children, innerStyle, ...groupProps } = this.props;
    return (
      <Droppable droppableId={groupProps.id}>
        {(droppableProvided, snapshot) => (
          <div
            ref={droppableProvided.innerRef}
            css={{
              ...defaultStyles,
              ...innerStyle,
              ...applyDraggingStyles(snapshot),
            }}
            {...droppableProvided.droppableProps}
          >
            <Group {...groupProps}>
              {children}
              {droppableProvided.placeholder}
            </Group>
          </div>
        )}
      </Droppable>
    );
  }
}
