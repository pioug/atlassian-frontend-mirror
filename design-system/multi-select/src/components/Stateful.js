/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import uuid from 'uuid';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';

import MultiSelectStateless from './Stateless';

// =============================================================
// NOTE: Duplicated in ./internal/appearances until docgen can follow imports.
// -------------------------------------------------------------
// DO NOT update values here without updating the other.
// =============================================================

const appearances = {
  values: ['default', 'subtle'],
  default: 'default',
};

export default class MultiSelect extends PureComponent {
  static defaultProps = {
    appearance: appearances.default,
    createNewItemLabel: 'New item',
    defaultSelected: [],
    shouldFocus: false,
    shouldFlip: true,
    isRequired: false,
    items: [],
    label: '',
    onFilterChange: () => {},
    onNewItemCreated: () => {},
    onOpenChange: () => {},
    onSelectedChange: () => {},
    position: 'bottom left',
    shouldAllowCreateItem: false,
    icon: <ExpandIcon label="" />,
  };

  state = {
    isOpen: this.props.isDefaultOpen,
    selectedItems: this.props.defaultSelected,
    filterValue: '',
    items: this.props.items,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.items !== this.state.items) {
      this.setState({ items: [...nextProps.items] });
    }
  }

  selectItem = (item) => {
    const selectedItems = [...this.state.selectedItems, item];
    this.setState({ selectedItems });
    this.props.onSelectedChange({
      items: selectedItems,
      action: 'select',
      changed: item,
    });
  };

  removeItem = (item) => {
    const selectedItems = this.state.selectedItems.filter(
      (i) => i.value !== item.value,
    );
    this.setState({ selectedItems });
    this.props.onSelectedChange({
      items: selectedItems,
      action: 'remove',
      changed: item,
    });
  };

  selectedChange = (item) => {
    if (this.state.selectedItems.some((i) => i.value === item.value)) {
      this.removeItem(item);
    } else {
      this.selectItem(item);
    }
  };

  handleFilterChange = (value) => {
    this.props.onFilterChange(value);
    this.setState({ filterValue: value });
  };

  handleOpenChange = (attrs) => {
    if (this.state.isOpen !== attrs.isOpen) {
      this.props.onOpenChange(attrs);
    }
    this.setState({ isOpen: attrs.isOpen });
  };

  handleNewItemCreate = ({ value: textValue }) => {
    // eslint-disable-line react/no-unused-prop-types
    const { items, selectedItems } = this.state;
    const id = uuid();
    const newItem = { value: id, content: textValue };
    const newItemsArray = [...items];
    newItemsArray[newItemsArray.length - 1].items.push(newItem);

    this.setState({
      items: newItemsArray,
      selectedItems: [...selectedItems, newItem],
      filterValue: '',
    });
    this.props.onNewItemCreated({ value: textValue, item: newItem });
  };

  render() {
    const {
      appearance,
      createNewItemLabel,
      footer,
      id,
      isDisabled,
      isFirstChild,
      isInvalid,
      invalidMessage,
      isRequired,
      label,
      name,
      noMatchesFound,
      placeholder,
      position,
      shouldAllowCreateItem,
      shouldFitContainer,
      shouldFocus,
      shouldFlip,
      icon,
    } = this.props;
    const { filterValue, isOpen, items, selectedItems } = this.state;

    return (
      <MultiSelectStateless
        appearance={appearance}
        createNewItemLabel={createNewItemLabel}
        filterValue={filterValue}
        footer={footer}
        id={id}
        isDisabled={isDisabled}
        isFirstChild={isFirstChild}
        isInvalid={isInvalid}
        invalidMessage={invalidMessage}
        isOpen={isOpen}
        isRequired={isRequired}
        items={items}
        label={label}
        name={name}
        noMatchesFound={noMatchesFound}
        onFilterChange={this.handleFilterChange}
        onNewItemCreated={this.handleNewItemCreate}
        onOpenChange={this.handleOpenChange}
        onRemoved={this.selectedChange}
        onSelected={this.selectedChange}
        placeholder={placeholder}
        position={position}
        selectedItems={selectedItems}
        shouldAllowCreateItem={shouldAllowCreateItem}
        shouldFitContainer={shouldFitContainer}
        shouldFocus={shouldFocus}
        shouldFlip={shouldFlip}
        icon={icon}
      />
    );
  }
}
