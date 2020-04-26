import React, { Component } from 'react';

import { Draggable } from 'react-beautiful-dnd';

import { N60A } from '@atlaskit/theme/colors';

import Item from '../../presentational/Item';

const getStyles = (provided, { isDragging }) => {
  return {
    ...provided,
    itemBase: {
      ...provided.itemBase,
      boxShadow: isDragging
        ? `${N60A} 0px 4px 8px -2px, ${N60A} 0px 0px 1px`
        : undefined,
      cursor: isDragging ? 'grabbing' : 'pointer',
    },
  };
};

export default class SortableItem extends Component {
  render() {
    const { index, ...itemProps } = this.props;
    return (
      <Draggable
        draggableId={itemProps.id}
        index={index}
        disableInteractiveElementBlocking
      >
        {(draggableProvided, draggableSnapshot) => {
          const draggableProps = {
            ...draggableProvided.draggableProps,
            ...draggableProvided.dragHandleProps,
          };

          // Disabling clicking while a drag is occurring
          // rbd already handles this - but we are being super safe
          const onClick = draggableSnapshot.isDragging
            ? undefined
            : itemProps.onClick;

          return (
            <Item
              draggableProps={draggableProps}
              innerRef={draggableProvided.innerRef}
              isDragging={draggableSnapshot.isDragging}
              styles={getStyles}
              {...itemProps}
              onClick={onClick}
            />
          );
        }}
      </Draggable>
    );
  }
}
