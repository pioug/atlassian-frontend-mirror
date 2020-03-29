/** Reorders an item in items from startIndex to endIndex.
 *  If endIndex is null, the item will be
 *  removed (used when moving an item to a different group). */
const reorderItems = (items, startIndex, endIndex) => {
  const result = Array.from(items);
  const [removed] = result.splice(startIndex, 1);
  if (typeof endIndex === 'number') {
    result.splice(endIndex, 0, removed);
  }

  return result;
};

const addItem = (items, item, index) => {
  const result = Array.from(items);
  result.splice(index, 0, item);

  return result;
};

export default (items, dropResult) => {
  const { destination, source } = dropResult;
  if (
    // Dropped outside a droppable area
    !destination ||
    // Dropped in original position
    (source.droppableId === destination.droppableId &&
      source.index === destination.index)
  ) {
    return null;
  }

  const sourceGroupId = source.droppableId;
  const destinationGroupId = destination.droppableId;

  if (sourceGroupId === destinationGroupId) {
    // Dropped within group

    const modifiedGroup = reorderItems(
      items[sourceGroupId],
      source.index,
      destination.index,
    );

    return {
      ...items,
      [sourceGroupId]: modifiedGroup,
    };
  }

  // Dropped in a different group
  const reorderedItem = items[sourceGroupId][source.index];
  const modifiedSourceGroup = reorderItems(
    items[sourceGroupId],
    source.index,
    null,
  );
  const modifiedDestinationGroup = addItem(
    items[destinationGroupId],
    reorderedItem,
    destination.index,
  );

  return {
    ...items,
    [sourceGroupId]: modifiedSourceGroup,
    [destinationGroupId]: modifiedDestinationGroup,
  };
};
