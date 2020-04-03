import React, { useState } from 'react';
import { Checkbox } from '../../src';

interface CheckedItems {
  [value: string]: boolean;
}

const PARENT_ID: string = 'PARENT';
const CHILD_1_ID: string = 'CHILD1';
const CHILD_2_ID: string = 'CHILD2';

const getCheckedChildrenCount = (checkedItems: CheckedItems) => {
  const childItems = Object.keys(checkedItems).filter(i => i !== PARENT_ID);
  return childItems.reduce(
    (count, i) => (checkedItems[i] ? count + 1 : count),
    0,
  );
};

const getIsParentIndeterminate = (checkedItems: CheckedItems) => {
  const checkedChildrenCount = getCheckedChildrenCount(checkedItems);
  return checkedChildrenCount > 0 && checkedChildrenCount < 2;
};

const IndeterminateCheckbox = () => {
  const initialCheckedItems: Record<string, boolean> = {
    [PARENT_ID]: false,
    [CHILD_1_ID]: false,
    [CHILD_2_ID]: false,
  };
  const [checkedItems, setCheckedItems] = useState(initialCheckedItems);

  const onChange = (event: any) => {
    const itemValue = event.target.value;

    if (itemValue === PARENT_ID) {
      const newCheckedState = !checkedItems[PARENT_ID];
      // Set all items to the checked state of the parent
      setCheckedItems(
        Object.keys(checkedItems).reduce(
          (items, i) => ({ ...items, [i]: newCheckedState }),
          {},
        ),
      );
    } else {
      const newCheckedItems = {
        ...checkedItems,
        [itemValue]: !checkedItems[itemValue],
      };

      setCheckedItems({
        // If all children would be unchecked, also uncheck the parent
        ...newCheckedItems,
        [PARENT_ID]: getCheckedChildrenCount(newCheckedItems) > 0,
      });
    }
  };

  return (
    <div>
      <Checkbox
        isChecked={checkedItems[PARENT_ID]}
        isIndeterminate={getIsParentIndeterminate(checkedItems)}
        onChange={onChange}
        label="Parent checkbox"
        value={PARENT_ID}
        name="parent"
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: '24px',
        }}
      >
        <Checkbox
          isChecked={checkedItems[CHILD_1_ID]}
          onChange={onChange}
          label="Child checkbox 1"
          value={CHILD_1_ID}
          name="child-1"
        />
        <Checkbox
          isChecked={checkedItems[CHILD_2_ID]}
          onChange={onChange}
          label="Child checkbox 2"
          value={CHILD_2_ID}
          name="child-1"
        />
      </div>
    </div>
  );
};

export default IndeterminateCheckbox;
