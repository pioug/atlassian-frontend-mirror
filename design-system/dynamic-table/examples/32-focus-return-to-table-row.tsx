import React, { useState } from 'react';

import Drawer from '@atlaskit/drawer';
import { token } from '@atlaskit/tokens';

import { DynamicTableStateless } from '../src';
import { type RowType } from '../src/types';

import { head, rows } from './content/sample-data-numerical';

const paddingStyle = { padding: `${token('space.100', '8px')} 0` };

const FocusReturnToTableRowExample = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const rowsWithTabIndexAndOnClickCallback: Array<RowType> = rows.map(
    (row) => ({
      ...row,
      tabIndex: 0,
      style: {
        cursor: 'pointer',
      },
      onClick: () => setIsDrawerOpen(true),
      onKeyDown: (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          setIsDrawerOpen(true);
        }
      },
    }),
  );

  return (
    <>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
      <h4 style={paddingStyle}>
        Test that focus returns to the row after closing the drawer. Press ENTER
        while focused on a row to open the drawer. Since :focus-visible is used,
        the focus ring should only appear when using the keyboard to navigate.
      </h4>
      <DynamicTableStateless
        head={head}
        rows={rowsWithTabIndexAndOnClickCallback}
        rowsPerPage={40}
        page={1}
      />
      <Drawer
        label="Empty drawer"
        onClose={() => setIsDrawerOpen(false)}
        isOpen={isDrawerOpen}
        width="full"
      >
        Drawer content
      </Drawer>
    </>
  );
};

export default FocusReturnToTableRowExample;
