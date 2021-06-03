/* eslint-disable react/prop-types */
import React from 'react';
import { Item, Group } from '@atlaskit/droplist';

import NoMatches from '../styled/NoMatch';
import InitialLoading from '../styled/InitialLoading';
import GroupsContainer from '../styled/GroupsContainer';
import { filterItems } from '../internal/sharedFunctions';

const renderItems = ({ items, focusedItemIndex, handleItemSelect }) => {
  if (items && items.length) {
    return items.map((item, itemIndex) => (
      <Item
        {...item}
        elemBefore={item.elemBefore}
        isFocused={itemIndex === focusedItemIndex}
        key={itemIndex} // eslint-disable-line react/no-array-index-key
        onActivate={(attrs) => {
          handleItemSelect(item, attrs);
        }}
      >
        {item.content}
      </Item>
    ));
  }
  return null;
};

const renderNoItemsMessage = (noMatchesFound) => (
  <NoMatches>{noMatchesFound}</NoMatches>
);

const renderLoadingMessage = (loadingMessage) => (
  <InitialLoading aria-live="polite" role="status">
    {loadingMessage}
  </InitialLoading>
);

const renderMessageForEmptyList = ({
  noMatchesFound,
  isLoading,
  loadingMessage,
}) =>
  isLoading
    ? renderLoadingMessage(loadingMessage)
    : renderNoItemsMessage(noMatchesFound);

const renderGroups = ({
  filterValue,
  focusedItemIndex,
  hasFooter,
  groups,
  handleItemSelect,
  noMatchesFound,
  selectedItems,
  shouldAllowCreateItem,
  isLoading,
  loadingMessage,
}) => {
  const renderedGroups = groups
    .map((group, groupIndex) => {
      const filteredItems = filterItems(
        group.items,
        filterValue,
        selectedItems,
      );
      return filteredItems.length > 0 ? (
        <Group
          heading={group.heading}
          key={groupIndex} // eslint-disable-line react/no-array-index-key
        >
          {renderItems({
            items: filteredItems,
            focusedItemIndex,
            handleItemSelect,
          })}
        </Group>
      ) : null;
    })
    .filter((group) => !!group);

  // don't show the 'noItems' message when the new item functinality is enabled
  return renderedGroups.length > 0 || shouldAllowCreateItem ? (
    <GroupsContainer hasFooter={hasFooter}>{renderedGroups}</GroupsContainer>
  ) : (
    renderMessageForEmptyList({
      noMatchesFound,
      isLoading,
      loadingMessage,
    })
  );
};

export default renderGroups;
