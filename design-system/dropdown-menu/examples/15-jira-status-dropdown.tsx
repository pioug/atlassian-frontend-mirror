import React from 'react';

import { cssMap } from '@atlaskit/css';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import Arrow from '@atlaskit/icon/core/arrow-right';
import Lozenge from '@atlaskit/lozenge/lozenge';
import { Box } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	item: {
		width: '6rem',
		alignItems: 'center',
	},
});

export default (): React.JSX.Element => (
	<DropdownMenu defaultOpen trigger="To do" shouldRenderToParent>
		<DropdownItemGroup>
			<DropdownItem
				elemAfter={
					<Box xcss={styles.item}>
						<Arrow label="" size="small" />
						<Lozenge appearance="information">in progress</Lozenge>
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
