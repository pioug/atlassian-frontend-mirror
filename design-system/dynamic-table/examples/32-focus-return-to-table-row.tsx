import React, { useState } from 'react';

import { Drawer } from '@atlaskit/drawer/drawer';
import { DrawerCloseButton } from '@atlaskit/drawer/drawer-close-button';
import { DrawerContent } from '@atlaskit/drawer/drawer-content';
import { DrawerSidebar } from '@atlaskit/drawer/drawer-sidebar';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import { type RowType } from '@atlaskit/dynamic-table/types';
import { token } from '@atlaskit/tokens';

import { head, rows } from './content/sample-data-numerical';

const paddingStyle = { padding: `${token('space.100')} 0` };

const FocusReturnToTableRowExample = (): React.JSX.Element => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const rowsWithTabIndexAndOnClickCallback: Array<RowType> = rows.map((row) => ({
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
	}));

	return (
		<>
			<h4 style={paddingStyle}>
				Test that focus returns to the row after closing the drawer. Press ENTER while focused on a
				row to open the drawer. Since :focus-visible is used, the focus ring should only appear when
				using the keyboard to navigate.
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
				<DrawerSidebar>
					<DrawerCloseButton />
				</DrawerSidebar>
				<DrawerContent>Drawer content</DrawerContent>
			</Drawer>
		</>
	);
};

export default FocusReturnToTableRowExample;
