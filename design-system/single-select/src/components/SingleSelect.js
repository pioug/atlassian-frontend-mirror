/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import StatelessSelect, { getTextContent } from './StatelessSelect';

// =============================================================
// NOTE: Duplicated in ./internal/appearances until docgen can follow imports.
// -------------------------------------------------------------
// DO NOT update values here without updating the other.
// =============================================================

const appearances = {
  values: ['default', 'subtle'],
  default: 'default',
};

export default class AkSingleSelect extends PureComponent {
  static defaultProps = {
    appearance: appearances.default,
    droplistShouldFitContainer: true,
    isRequired: false,
    items: [],
    label: '',
    onFilterChange: () => {},
    onOpenChange: () => {},
    onSelected: () => {},
    placeholder: '',
    position: 'bottom left',
    shouldFocus: false,
    shouldFlip: true,
  };

  state = {
    isOpen: this.props.isDefaultOpen,
    selectedItem: this.props.defaultSelected,
    filterValue: this.props.defaultSelected
      ? getTextContent(this.props.defaultSelected)
      : '',
  };

  selectItem = (item) => {
    this.setState({ isOpen: false, selectedItem: item });
    if (this.props.onSelected) {
      this.props.onSelected({ item });
    }
  };

  handleOpenChange = (attrs) => {
    // allows consuming components to look for `defaultPrevented` on the event
    // where they can handle internal state e.g. prevent InlineDialog from closing when
    // the target DOM node no-longer exists
    if (!attrs.isOpen) attrs.event.preventDefault();

    this.setState({ isOpen: attrs.isOpen });
    if (this.props.onOpenChange) {
      this.props.onOpenChange(attrs);
    }
  };

  handleFilterChange = (value) => {
    if (this.props.onFilterChange) {
      this.props.onFilterChange(value);
    }
    this.setState({ filterValue: value });
  };

  render() {
    return (
      <StatelessSelect
        appearance={this.props.appearance}
        droplistShouldFitContainer={this.props.droplistShouldFitContainer}
        filterValue={this.state.filterValue}
        hasAutocomplete={this.props.hasAutocomplete}
        id={this.props.id}
        isDisabled={this.props.isDisabled}
        isFirstChild={this.props.isFirstChild}
        isInvalid={this.props.isInvalid}
        invalidMessage={this.props.invalidMessage}
        isOpen={this.state.isOpen}
        isRequired={this.props.isRequired}
        items={this.props.items}
        label={this.props.label}
        name={this.props.name}
        noMatchesFound={this.props.noMatchesFound}
        onFilterChange={this.handleFilterChange}
        onOpenChange={this.handleOpenChange}
        onSelected={this.selectItem}
        placeholder={this.props.placeholder}
        position={this.props.position}
        selectedItem={this.state.selectedItem}
        shouldFitContainer={this.props.shouldFitContainer}
        shouldFocus={this.props.shouldFocus}
        shouldFlip={this.props.shouldFlip}
        maxHeight={this.props.maxHeight}
      />
    );
  }
}
