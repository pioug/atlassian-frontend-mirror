import React from 'react';

const renderOptions = (items) => {
  if (!items || !items.length) return [];

  return items.map((item, itemIndex) => (
    <option
      disabled={item.isDisabled}
      key={itemIndex} // eslint-disable-line react/no-array-index-key
      value={item.value}
    >
      {item.content}
    </option>
  ));
};

const renderOptGroups = (groups) =>
  groups.map((group, groupIndex) => (
    <optgroup
      key={groupIndex} // eslint-disable-line react/no-array-index-key
      label={group.heading}
    >
      {renderOptions(group.items)}
    </optgroup>
  ));

export default renderOptGroups;
