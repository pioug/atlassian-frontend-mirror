import React, { Component } from 'react';

import { DragDropContext } from 'react-beautiful-dnd';

import { LayoutEventEmitter } from '../../presentational/LayoutManager/LayoutEvent';

export default class SortableContext extends Component {
  onDragStart = ([start, provided], emit) => {
    emit();
    if (this.props.onDragStart) {
      this.props.onDragStart(start, provided);
    }
  };

  onDragEnd = ([result, provided], emit) => {
    emit();
    if (this.props.onDragEnd) {
      this.props.onDragEnd(result, provided);
    }
  };

  render() {
    const { children, onDragUpdate } = this.props;
    return (
      <LayoutEventEmitter>
        {({ emitItemDragStart, emitItemDragEnd }) => (
          <DragDropContext
            onDragUpdate={onDragUpdate}
            onDragStart={(...args) => this.onDragStart(args, emitItemDragStart)}
            onDragEnd={(...args) => this.onDragEnd(args, emitItemDragEnd)}
          >
            {children}
          </DragDropContext>
        )}
      </LayoutEventEmitter>
    );
  }
}
