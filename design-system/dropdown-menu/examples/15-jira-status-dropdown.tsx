import React from 'react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Arrow from '@atlaskit/icon/glyph/arrow-right';
import Lozenge from '@atlaskit/lozenge';
import { Box, xcss } from '@atlaskit/primitives';

const jiraItemStyles = xcss({
	width: 'size.600',
	alignItems: 'center',
});

export default () => (
	<DropdownMenu defaultOpen trigger="To do" shouldRenderToParent>
		<DropdownItemGroup>
			<DropdownItem
				elemAfter={
					<Box xcss={jiraItemStyles}>
						<Arrow label="" size="small" />
						<Lozenge appearance="inprogress">in progress</Lozenge>
					</Box>
				}
			>
				Status project
			</DropdownItem>
			<DropdownItem
				elemAfter={
					<Box xcss={jiraItemStyles}>
						<Arrow label="" size="small" />
						<Lozenge appearance="success">Done</Lozenge>
					</Box>
				}
			>
				Move to done
			</DropdownItem>
			<DropdownItem>View workflow</DropdownItem>
		</DropdownItemGroup>
	</DropdownMenu>
);
