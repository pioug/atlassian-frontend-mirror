import { Component } from 'react';

import updateSortableItems from './update-sortable-items';

export default class SortableItemState extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortableItems: {},
      onDragEnd: this.onDragEnd,
      setItems: this.setItems,
    };
  }

  onDragEnd = (dropResult) => {
    const updatedItems = updateSortableItems(
      this.state.sortableItems,
      dropResult,
    );
    if (updatedItems) {
      this.setState({
        sortableItems: updatedItems,
      });
    }
  };

  setItems = (items) => {
    this.setState({
      sortableItems: items,
    });
  };

  render() {
    return this.props.children(this.state);
  }
}
