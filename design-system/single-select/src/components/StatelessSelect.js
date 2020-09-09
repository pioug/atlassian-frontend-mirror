/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import Droplist, { Item, Group } from '@atlaskit/droplist';
import FieldBase, { Label } from '@atlaskit/field-base';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import Spinner from '@atlaskit/spinner';
import { mapAppearanceToFieldBase } from './appearances';
import { AutocompleteWrapper, AutocompleteInput } from '../styled/Autocomplete';
import Content from '../styled/Content';
import ElemBefore from '../styled/ElemBefore';
import Expand from '../styled/Expand';
import InitialLoading from './InitialLoading';
import NothingWasFound from './NothingWasFound';
import Placeholder from '../styled/Placeholder';
import StatelessSelectWrapper from '../styled/StatelessSelectWrapper';
import Trigger from '../styled/Trigger';

// =============================================================
// NOTE: Duplicated in ./internal/appearances until docgen can follow imports.
// -------------------------------------------------------------
// DO NOT update values here without updating the other.
// =============================================================

const appearances = {
  values: ['default', 'subtle'],
  default: 'default',
};

export const getTextContent = item => {
  if (!item || Object.keys(item).length === 0) {
    return '';
  }

  if (typeof item.content === 'string') {
    return item.content;
  }

  if (!item.label && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(
      'SingleSelect: item.label must be set when item.content is JSX',
    );
  }

  return item.label || '';
};

const isMatched = (item, matchingValue) => {
  const { filterValues } = item;
  if (filterValues && filterValues.length > 0) {
    return filterValues.some(
      value => value.toLowerCase().indexOf(matchingValue) > -1,
    );
  }

  return getTextContent(item).toLowerCase().indexOf(matchingValue) > -1;
};

if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  // eslint-disable-next-line no-console
  console.warn(
    '@atlaskit/single-select has been deprecated. Please use the @atlaskit/select package instead.',
  );
}

export default class StatelessSelect extends PureComponent {
  containerNode;

  triggerNode;

  inputNode;

  droplistNode;

  nativeSearchKey;

  previousKey;

  nativeSearchCounter;

  static defaultProps = {
    appearance: appearances.default,
    droplistShouldFitContainer: true,
    filterValue: '',
    hasAutocomplete: false,
    isLoading: false,
    isOpen: false,
    isRequired: false,
    items: [],
    label: '',
    loadingMessage: 'Receiving information',
    noMatchesFound: 'No matches found',
    onFilterChange: () => {},
    onSelected: () => {},
    onOpenChange: () => {},
    placeholder: '',
    position: 'bottom left',
    shouldFocus: false,
    selectedItem: {},
    shouldFlip: true,
  };

  state = {
    focusedItemIndex: undefined,
    droplistWidth: undefined,
  };

  componentDidMount = () => {
    if (this.props.isOpen || this.props.shouldFocus) {
      this.focus();
    }

    if (!this.props.droplistShouldFitContainer && this.droplistNode) {
      this.setDroplistMinWidth();
    }
  };

  componentDidUpdate = prevProps => {
    if (
      (!prevProps.shouldFocus && this.props.shouldFocus) ||
      (!prevProps.isOpen && this.props.isOpen)
    ) {
      this.focus();
    }

    if (!this.props.droplistShouldFitContainer && this.droplistNode) {
      this.setDroplistMinWidth();
    }
  };

  onOpenChange = attrs => {
    this.props.onOpenChange(attrs);
    this.setState({
      focusedItemIndex: undefined,
    });

    if (attrs.isOpen) {
      this.focus();
    }
  };

  getNextFocusable = (indexItem, length) => {
    let currentItem = indexItem;

    if (currentItem === undefined) {
      currentItem = 0;
    } else if (currentItem < length) {
      currentItem++;
    } else {
      currentItem = 0;
    }

    return currentItem;
  };

  getPrevFocusable = (indexItem, length) => {
    let currentItem = indexItem;

    if (currentItem && currentItem > 0) {
      currentItem--;
    } else {
      currentItem = length;
    }

    return currentItem;
  };

  getAllItems = groups => {
    let allItems = [];
    groups.forEach(val => {
      allItems = allItems.concat(val.items);
    });
    return allItems;
  };

  getAllVisibleItems = groups =>
    groups ? this.filterItems(this.getAllItems(groups)) : [];

  getNextNativeSearchItem = (items, key, currentIndex, isSecondStep) => {
    let result;
    const res = items.find((item, index) => {
      const content = getTextContent(item).toLowerCase();
      if (index <= currentIndex) {
        return false;
      }
      return content && content.indexOf(key.toLowerCase()) === 0;
    });

    if (res) {
      result = res;
    } else if (!res && !isSecondStep) {
      result = this.getNextNativeSearchItem(items, key, -1, true);
    }
    return result;
  };

  setDroplistMinWidth = () => {
    const width = this.triggerNode
      ? this.triggerNode.getBoundingClientRect().width
      : undefined;
    this.setState({ droplistWidth: width });
  };

  getItemTrueIndex = (itemIndex, groupIndex = 0) =>
    itemIndex +
    this.props.items
      .filter((group, thisGroupIndex) => thisGroupIndex < groupIndex)
      .reduce((totalItems, group) => totalItems + group.items.length, 0);

  focus = () => {
    if (this.inputNode) {
      this.inputNode.focus();
    } else if (this.triggerNode) {
      this.triggerNode.focus();
    }
  };

  clearNativeSearch = () => {
    this.nativeSearchKey = '';
    this.nativeSearchCounter = undefined;
  };

  filterItems = items => {
    const value = this.props.filterValue;
    const trimmedValue = value && value.toLowerCase().trim();
    const { selectedItem } = this.props;
    const unselectedItems = items.filter(
      item => selectedItem && selectedItem.value !== item.value,
    );
    const selectedItemContent = getTextContent(selectedItem).toLowerCase();

    return trimmedValue && trimmedValue !== selectedItemContent
      ? unselectedItems.filter(item => isMatched(item, trimmedValue))
      : unselectedItems;
  };

  scrollToFocused = index => {
    const scrollable = this.containerNode
      ? this.containerNode.querySelector('[data-role="droplistContent"]')
      : undefined;
    let item;

    if (scrollable && index !== undefined) {
      item = scrollable.querySelectorAll('[data-role="droplistItem"]')[index];
    }

    if (item && scrollable) {
      scrollable.scrollTop =
        item.offsetTop - scrollable.clientHeight + item.clientHeight;
    }
  };

  focusNextItem = () => {
    const filteredItems = this.getAllVisibleItems(this.props.items);
    const length = filteredItems.length - 1;
    const index = this.getNextFocusable(this.state.focusedItemIndex, length);
    this.setState({
      focusedItemIndex: index,
    });
    this.scrollToFocused(index);
  };

  focusPreviousItem = () => {
    const filteredItems = this.getAllVisibleItems(this.props.items);
    const length = filteredItems.length - 1;
    const index = this.getPrevFocusable(this.state.focusedItemIndex, length);
    this.setState({
      focusedItemIndex: index,
    });
    this.scrollToFocused(index);
  };

  focusItem = item => {
    const filteredItems = this.getAllVisibleItems(this.props.items);
    const index = filteredItems.indexOf(item);
    this.setState({
      focusedItemIndex: index,
    });
    this.scrollToFocused(index);
  };

  handleNativeSearch = event => {
    const { selectedItem, items } = this.props;
    const { key: eventKey } = event;
    let { nativeSearchKey } = this;
    const allItems = this.getAllItems(items);

    if (!this.nativeSearchCounter) {
      nativeSearchKey = eventKey;
    } else {
      nativeSearchKey += eventKey;
    }

    const current =
      this.state.focusedItemIndex !== undefined
        ? this.state.focusedItemIndex
        : allItems.indexOf(selectedItem);

    const allItemsWithoutSelected =
      selectedItem && selectedItem.value
        ? allItems.filter(item => item.value !== selectedItem.value)
        : allItems;

    if (!this.props.isOpen) {
      const matchingItem = this.getNextNativeSearchItem(
        allItems,
        nativeSearchKey,
        current,
      );
      this.handleItemSelect(matchingItem, { event });
    } else {
      const matchingItem = this.getNextNativeSearchItem(
        allItemsWithoutSelected,
        nativeSearchKey,
        current,
      );
      this.focusItem(matchingItem);
    }

    if (this.nativeSearchCounter) {
      clearTimeout(this.nativeSearchCounter);
    }
    this.nativeSearchCounter = setTimeout(this.clearNativeSearch, 200);
    this.previousKey = eventKey;
    this.nativeSearchKey = nativeSearchKey;
  };

  handleKeyboardInteractions = event => {
    const isSelectOpen = this.props.isOpen;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isSelectOpen) {
          this.onOpenChange({ event, isOpen: true });
        }
        this.focusNextItem();
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isSelectOpen) {
          this.focusPreviousItem();
        }
        break;
      case 'Enter':
        if (isSelectOpen) {
          event.preventDefault();
          const visibleItems = this.getAllVisibleItems(this.props.items);
          if (this.state.focusedItemIndex !== undefined) {
            this.handleItemSelect(
              visibleItems.length
                ? visibleItems[this.state.focusedItemIndex]
                : undefined,
              { event },
            );
          }
        }
        break;
      default:
        if (!this.props.hasAutocomplete) {
          this.handleNativeSearch(event);
        }
        break;
    }
  };

  handleInputOnChange = event => {
    const { value } = event.currentTarget;

    if (value !== this.props.filterValue) {
      this.props.onFilterChange(value);
      this.onOpenChange({ event, isOpen: true });
    }
  };

  handleTriggerClick = event => {
    if (!this.props.isDisabled) {
      this.onOpenChange({ event, isOpen: !this.props.isOpen });
    }
  };

  handleOnBlur = event => {
    this.onOpenChange({ event, isOpen: false });
  };

  handleItemSelect = (item, attrs) => {
    if (item && !item.isDisabled) {
      this.props.onOpenChange({ isOpen: false, event: attrs.event });
      this.props.onSelected(item);
      this.props.onFilterChange(getTextContent(item));

      this.setState({ focusedItemIndex: undefined });
    }
  };

  renderItems = (items, groupIndex = 0) => {
    const filteredItems = this.filterItems(items);

    if (filteredItems.length) {
      return filteredItems.map((item, itemIndex) => (
        <Item
          {...item}
          isFocused={
            this.getItemTrueIndex(itemIndex, groupIndex) ===
            this.state.focusedItemIndex
          }
          key={itemIndex} // eslint-disable-line react/no-array-index-key
          onActivate={attrs => {
            this.handleItemSelect(item, attrs);
          }}
          type="option"
        >
          {item.content}
        </Item>
      ));
    }

    return <NothingWasFound noMatchesFound={this.props.noMatchesFound} />;
  };

  renderGroups = groups => {
    if (this.props.isLoading) {
      return <InitialLoading>{this.props.loadingMessage}</InitialLoading>;
    }

    const filteredGroups = groups
      .filter(group => this.filterItems(group.items).length)
      .map((group, groupIndex) => (
        <Group
          heading={group.heading}
          key={groupIndex} // eslint-disable-line react/no-array-index-key
        >
          {this.renderItems(group.items, groupIndex)}
        </Group>
      ));

    if (filteredGroups.length === 0) {
      return <NothingWasFound noMatchesFound={this.props.noMatchesFound} />;
    }

    return filteredGroups;
  };

  renderOptions = items =>
    items.map((item, itemIndex) => (
      <option
        disabled={item.isDisabled}
        key={itemIndex} // eslint-disable-line react/no-array-index-key
        value={item.value}
      >
        {getTextContent(item)}
      </option>
    ));

  renderOptGroups = groups =>
    groups.map((group, groupIndex) => (
      <optgroup
        label={group.heading}
        key={groupIndex} // eslint-disable-line react/no-array-index-key
      >
        {this.renderOptions(group.items)}
      </optgroup>
    ));

  renderSelect = () => (
    <select
      disabled={this.props.isDisabled}
      id={this.props.id}
      name={this.props.name}
      readOnly
      required={this.props.isRequired}
      style={{ display: 'none' }}
      value={
        this.props.selectedItem ? this.props.selectedItem.value : undefined
      }
    >
      <option value="" />
      {this.renderOptGroups(this.props.items)}
    </select>
  );

  render() {
    const {
      appearance,
      droplistShouldFitContainer,
      filterValue,
      hasAutocomplete,
      id,
      invalidMessage,
      isDisabled,
      isFirstChild,
      isInvalid,
      isLoading,
      isOpen,
      isRequired,
      items,
      label,
      placeholder,
      position,
      selectedItem,
      shouldFitContainer,
      shouldFlip,
      maxHeight,
    } = this.props;
    // disabled because all of the accessibility is handled manually
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <StatelessSelectWrapper
        onKeyDown={this.handleKeyboardInteractions}
        innerRef={ref => {
          this.containerNode = ref;
        }}
        shouldFitContainer={shouldFitContainer}
      >
        {this.renderSelect()}
        {label ? (
          <Label
            htmlFor={id}
            isFirstChild={isFirstChild}
            isRequired={isRequired}
            label={label}
          />
        ) : null}
        <Droplist
          isKeyboardInteractionDisabled
          isOpen={isOpen}
          isTriggerDisabled
          isTriggerNotTabbable
          onOpenChange={this.onOpenChange}
          position={position}
          shouldFitContainer={droplistShouldFitContainer}
          shouldFlip={shouldFlip}
          maxHeight={maxHeight}
          trigger={
            <FieldBase
              appearance={mapAppearanceToFieldBase(appearance)}
              isDisabled={isDisabled}
              isFitContainerWidthEnabled
              isInvalid={isInvalid}
              invalidMessage={invalidMessage}
              isPaddingDisabled
              onBlur={this.handleOnBlur}
            >
              <Trigger
                onClick={this.handleTriggerClick}
                tabIndex={!isDisabled && !hasAutocomplete ? '0' : null}
                innerRef={ref => {
                  this.triggerNode = ref;
                }}
              >
                {!hasAutocomplete || isDisabled ? (
                  <Content>
                    {selectedItem && selectedItem.elemBefore ? (
                      <ElemBefore>{selectedItem.elemBefore}</ElemBefore>
                    ) : null}
                    {selectedItem && selectedItem.content ? (
                      <span>{getTextContent(selectedItem)}</span>
                    ) : (
                      <Placeholder>{placeholder}</Placeholder>
                    )}
                  </Content>
                ) : (
                  <AutocompleteWrapper>
                    <AutocompleteInput
                      autoComplete="off"
                      onChange={this.handleInputOnChange}
                      placeholder={placeholder}
                      innerRef={ref => {
                        this.inputNode = ref;
                      }}
                      type="text"
                      value={filterValue}
                      disabled={isDisabled}
                    />
                  </AutocompleteWrapper>
                )}
                <Expand>
                  {isOpen && isLoading ? <Spinner /> : <ExpandIcon label="" />}
                </Expand>
              </Trigger>
            </FieldBase>
          }
        >
          <div
            ref={ref => {
              this.droplistNode = ref;
            }}
            style={{ minWidth: this.state.droplistWidth }}
          >
            {this.renderGroups(items)}
          </div>
        </Droplist>
      </StatelessSelectWrapper>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions */
  }
}
