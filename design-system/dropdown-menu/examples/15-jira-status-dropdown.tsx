import React from 'react';

import { cssMap } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import Arrow from '@atlaskit/icon/glyph/arrow-right';
import Lozenge from '@atlaskit/lozenge';
import { Box } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	item: {
		width: '6rem',
		alignItems: 'center',
	},
});

export default () => (
	<DropdownMenu defaultOpen trigger="To do" shouldRenderToParent>
		<DropdownItemGroup>
			<DropdownItem
				elemAfter={
					<Box xcss={styles.item}>
						<Arrow label="" size="small" />
						<Lozenge appearance="inprogress">in progress</Lozenge>
					</Box>
				}
			>
				Status project
			</DropdownItem>
			<DropdownItem
				elemAfter={
					<Box xcss={styles.item}>
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
