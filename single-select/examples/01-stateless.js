import React, { PureComponent } from 'react';
import { StatelessSelect } from '../src';

const selectItems = [
  {
    heading: 'Cities',
    items: [
      { content: 'Sydney', value: 'sydney' },
      { content: 'Canberra', value: 'canberra' },
    ],
  },
  {
    heading: 'Animals',
    items: [
      { content: 'Sheep', value: 'sheep' },
      { content: 'Cow', value: 'cow', isDisabled: true },
    ],
  },
];

export default class StatelessExample extends PureComponent {
  state = {
    isOpen: false,
    filterValue: '',
    selectedItem: undefined,
  };

  onSelected = item => {
    this.setState({
      isOpen: false,
      selectedItem: item,
      filterValue: '',
    });
  };

  toggleOpen = ({ isOpen }) => this.setState({ isOpen });

  updateFilter = filterValue => this.setState({ filterValue });

  render() {
    return (
      <div>
        <StatelessSelect
          items={selectItems}
          isOpen={this.state.isOpen}
          onOpenChange={this.toggleOpen}
          hasAutocomplete
          onFilterChange={this.updateFilter}
          filterValue={this.state.filterValue}
          onSelected={this.onSelected}
          selectedItem={this.state.selectedItem}
        />
      </div>
    );
  }
}
