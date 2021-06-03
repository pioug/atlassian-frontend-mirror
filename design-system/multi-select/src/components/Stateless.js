/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import Droplist from '@atlaskit/droplist';
import { Label } from '@atlaskit/field-base';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';

import { SelectWrapper } from '../styled/Stateless';
import Trigger from './Trigger';
import Footer from './Footer';
import {
  filterItems,
  getNextFocusable,
  getPrevFocusable,
  groupItems,
} from '../internal/sharedFunctions';
import renderGroups from './Groups';
import renderOptGroups from './Options';

// =============================================================
// NOTE: Duplicated in ./internal/appearances until docgen can follow imports.
// -------------------------------------------------------------
// DO NOT update values here without updating the other.
// =============================================================

const appearances = {
  values: ['default', 'subtle'],
  default: 'default',
};

const getAllValues = (selectedItems) => selectedItems.map((item) => item.value);

/*

==============================+
COMPONENT CODE BEGINS HERE
==============================+

*/

if (process.env.NODE_ENV !== 'production' && !process.env.CI) {
  // eslint-disable-next-line no-console
  console.warn(
    '@atlaskit/multi-select has been deprecated. Please use the @atlaskit/select package instead.',
  );
}

export default class StatelessMultiSelect extends PureComponent {
  static defaultProps = {
    appearance: appearances.default,
    createNewItemLabel: 'New item',
    filterValue: '',
    footer: {},
    shouldFocus: false,
    shouldFlip: true,
    isLoading: false,
    isOpen: false,
    items: [],
    label: '',
    loadingMessage: 'Receiving information',
    noMatchesFound: 'No matches found',
    onFilterChange: () => {},
    onOpenChange: () => {},
    onSelected: () => {},
    onRemoved: () => {},
    position: 'bottom left',
    selectedItems: [],
    shouldAllowCreateItem: false,
    icon: <ExpandIcon label="" />,
  };

  // This is used only to manipulate focus , it's okay to have state in this case.
  state = {
    isFocused: this.props.isOpen || this.props.shouldFocus,
    focusedItemIndex: undefined,
    groupedItems: groupItems(this.props.items),
  };

  componentDidMount = () => {
    if (this.state.isFocused && this.inputNode) {
      this.inputNode.focus();
    }
  };

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (this.props.items !== nextProps.items) {
      this.setState({ groupedItems: groupItems(nextProps.items) });
    }
  };

  componentDidUpdate = (prevProps) => {
    if (!prevProps.shouldFocus && this.props.shouldFocus && this.inputNode) {
      this.inputNode.focus();
    }
  };

  onFocus = () => {
    if (!this.props.isDisabled) {
      this.setState({ isFocused: true });

      /**
       * Check if we're tabbing to the Remove button on a tag.
       * This is a hacky workaround for now and should be fixed when
       * we implement proper traversal for tags with the keyboard.
       *
       * @see {@link https://ecosystem.atlassian.net/browse/AK-2250}
       * @todo Implement traversal of tags with arrow keys, then remove this.
       */
      if (
        document.activeElement &&
        document.activeElement.tagName.toLowerCase() !== 'button' &&
        this.inputNode
      ) {
        this.inputNode.focus();
      }
    }
  };

  onBlur = () => {
    if (!this.props.isDisabled) {
      this.setState({ isFocused: false });
    }
  };

  onOpenChange = (attrs) => {
    const target = attrs.event.currentTarget;
    // eslint-disable-next-line react/no-find-dom-node
    const tagGroup = ReactDOM.findDOMNode(this.tagGroup);
    const tagGroupElements = tagGroup ? tagGroup.children : [];
    const isInsideTagGroup = [...tagGroupElements].some(
      (node) => node.contains(target) && node.tagName !== 'INPUT',
    );

    const args = { ...attrs, inputNode: this.inputNode };
    if (!isInsideTagGroup) {
      this.props.onOpenChange(args);
    }

    const tagInput = tagGroup ? tagGroup.querySelector('input') : undefined;
    if (attrs.isOpen && tagInput) {
      tagInput.focus();
    }
  };

  getPlaceholder = () => {
    const { isOpen, selectedItems, placeholder } = this.props;

    if (!isOpen && selectedItems.length === 0) {
      return placeholder;
    }

    return undefined;
  };

  getAllVisibleItems = (groups) => {
    const { filterValue, selectedItems } = this.props;
    return groups.reduce((allFilteredItems, val) => {
      const filteredItems = filterItems(val.items, filterValue, selectedItems);
      return allFilteredItems.concat(filteredItems);
    }, []);
  };

  handleItemCreate = (event) => {
    const { filterValue: value, items } = this.props;
    if (value) {
      const allVisible = this.getAllVisibleItems(items);
      const matchingElement = allVisible.filter(
        (item) => item.content === value,
      );
      if (!matchingElement.length) {
        if (this.props.onNewItemCreated) {
          this.props.onNewItemCreated({ value });
        }
      } else {
        this.handleItemSelect(matchingElement[0], { event });
      }
    }
  };

  handleItemSelect = (item, attrs) => {
    if (!this.isFooterFocused()) {
      // we short circuit above because when focusing on footer we don't have `item`.
      // We could look at adding item.disabled in the future though if required.
      if (!item.isDisabled) {
        this.props.onOpenChange({ isOpen: false, event: attrs.event });
        this.props.onSelected(item);
        this.props.onFilterChange('');
        this.setState({ focusedItemIndex: undefined });
      }
    } else if (this.props.shouldAllowCreateItem) {
      this.handleItemCreate(attrs.event);
    } else {
      // footer is focused and we dont have shouldAllowCreateItem so call the footer's onActivate
      this.handleFooterActivate(attrs.event);
    }
  };

  handleItemRemove = (item) => {
    this.props.onRemoved(item);
  };

  removeLatestItem = () => {
    if (this.props.selectedItems.length) {
      const { selectedItems } = this.props;
      this.handleItemRemove(selectedItems[selectedItems.length - 1]);
    }
  };

  hasVisibleFooter = () => {
    const { footer, shouldAllowCreateItem, filterValue } = this.props;
    // This logic is interesting because we explicitly check !multiSelectContainer with footer
    // because if you have both turned on but you havent typed anything, there will be no footer
    return (
      (footer && footer.content && !shouldAllowCreateItem) ||
      (shouldAllowCreateItem && !!filterValue)
    );
  };

  isFooterFocused = () => {
    const { focusedItemIndex, groupedItems } = this.state;
    const selectableItems = this.getAllVisibleItems(groupedItems);
    // if our selected index is outside of our array bounds, the footer should be selected
    return focusedItemIndex === selectableItems.length;
  };

  handleOnChange = (event) => {
    const { value } = event.currentTarget;

    if (value !== this.props.filterValue) {
      // We want to get rid of the focus on the items when the shouldAllowCreateItem enabled.
      // When a user presses Enter multi-select should create a new value if nothing is focused, but
      // it still should allow to focus an item in the list and select it by pressing Enter
      // as normal multi-select does.
      if (this.props.shouldAllowCreateItem) {
        this.setState({ focusedItemIndex: undefined });
      }

      this.props.onFilterChange(value);
      this.onOpenChange({ event, isOpen: true });
    }
  };

  handleTriggerClick = (event) => {
    if (!this.props.isDisabled) {
      this.onOpenChange({ event, isOpen: true });
    }
  };

  handleFooterActivate = (event) => {
    const { footer } = this.props;
    if (footer && footer.onActivate) {
      footer.onActivate(event);
    }
  };

  focusNextItem = () => {
    const filteredItems = this.getAllVisibleItems(this.props.items);
    const footerIsFocusable = this.hasVisibleFooter();
    const { focusedItemIndex } = this.state;
    this.setState({
      focusedItemIndex: getNextFocusable(
        focusedItemIndex,
        filteredItems.length,
        footerIsFocusable,
      ),
    });
  };

  focusPreviousItem = () => {
    const filteredItems = this.getAllVisibleItems(this.props.items);
    const footerIsFocusable = this.hasVisibleFooter();
    const { focusedItemIndex } = this.state;
    this.setState({
      focusedItemIndex: getPrevFocusable(
        focusedItemIndex,
        filteredItems.length,
        footerIsFocusable,
      ),
    });
  };

  handleKeyboardInteractions = (event) => {
    const { isOpen, items, filterValue } = this.props;
    const { focusedItemIndex } = this.state;

    const isSelectOpen = isOpen;
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
          if (focusedItemIndex != null) {
            this.handleItemSelect(
              this.getAllVisibleItems(items)[focusedItemIndex],
              { event },
            );
          } else if (this.props.shouldAllowCreateItem) {
            this.handleItemCreate(event);
          }
        }
        break;
      case 'Backspace':
        if (!filterValue) {
          this.removeLatestItem();
          this.onOpenChange({ event, isOpen: true });
        }
        break;
      case 'Tab':
        // tabbing from within the multi select should move focus to the next form element
        // hence, we close the dropdown and clear the focusedItemIndex
        this.onOpenChange({ event, isOpen: false });
        this.setState({ focusedItemIndex: undefined });
        break;
      default:
        break;
    }
  };

  renderFooter = () => {
    const {
      filterValue: newValue,
      shouldAllowCreateItem,
      footer,
      createNewItemLabel,
    } = this.props;
    if (shouldAllowCreateItem) {
      if (newValue) {
        return (
          <Footer
            appearance={footer && footer.appearance}
            isFocused={this.isFooterFocused()}
            newLabel={this.props.createNewItemLabel}
            onClick={this.handleItemCreate}
            shouldHideSeparator={
              !this.getAllVisibleItems(this.props.items).length
            }
          >
            {newValue} ({createNewItemLabel})
          </Footer>
        );
      }
    } else if (footer && footer.content) {
      return (
        <Footer
          appearance={footer.appearance}
          elemBefore={footer.elemBefore}
          isFocused={this.isFooterFocused()}
          onClick={this.handleFooterActivate}
          shouldHideSeparator={
            !this.getAllVisibleItems(this.props.items).length
          }
        >
          {footer.content}
        </Footer>
      );
    }
    return null;
  };

  render() {
    const {
      appearance,
      filterValue,
      id,
      isDisabled,
      isFirstChild,
      isInvalid,
      invalidMessage,
      isLoading,
      isOpen,
      isRequired,
      label,
      loadingMessage,
      name,
      noMatchesFound,
      position,
      selectedItems,
      shouldAllowCreateItem,
      shouldFitContainer,
      shouldFlip,
    } = this.props;

    const { groupedItems, isFocused, focusedItemIndex } = this.state;

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <SelectWrapper
        shouldFitContainer={shouldFitContainer}
        onKeyDown={this.handleKeyboardInteractions}
      >
        <select
          disabled={isDisabled}
          id={id}
          multiple
          name={name}
          readOnly
          required={isRequired}
          style={{ display: 'none' }}
          value={getAllValues(selectedItems)}
        >
          {renderOptGroups(groupedItems)}
        </select>
        {label ? (
          <Label
            htmlFor={id}
            isDisabled={isDisabled}
            isFirstChild={isFirstChild}
            isRequired={isRequired}
            label={label}
          />
        ) : null}
        <Droplist
          appearance={this.hasVisibleFooter() ? 'tall' : 'default'}
          isKeyboardInteractionDisabled
          isOpen={isOpen}
          isTriggerDisabled
          isTriggerNotTabbable
          onOpenChange={this.onOpenChange}
          position={position}
          shouldFitContainer
          shouldFlip={shouldFlip}
          trigger={
            <Trigger
              appearance={appearance}
              filterValue={filterValue}
              handleItemRemove={this.handleItemRemove}
              handleOnChange={this.handleOnChange}
              handleTriggerClick={this.handleTriggerClick}
              inputNode={this.inputNode}
              inputRefFunction={(ref) => {
                this.inputNode = ref;
              }}
              isDisabled={isDisabled}
              isFocused={isOpen || isFocused}
              isInvalid={isInvalid}
              invalidMessage={invalidMessage}
              isLoading={isLoading}
              isRequired={isRequired}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              placeholder={this.getPlaceholder()}
              selectedItems={selectedItems}
              tagGroup={this.tagGroup}
              tagGroupRefFunction={(ref) => {
                this.tagGroup = ref;
              }}
              icon={this.props.icon}
            />
          }
        >
          {renderGroups({
            groups: groupedItems,
            hasFooter: this.hasVisibleFooter(),
            filterValue,
            selectedItems,
            noMatchesFound,
            focusedItemIndex,
            handleItemSelect: this.handleItemSelect,
            shouldAllowCreateItem,
            isLoading,
            loadingMessage,
          })}
          {this.renderFooter()}
        </Droplist>
      </SelectWrapper>
    );
  }
}
