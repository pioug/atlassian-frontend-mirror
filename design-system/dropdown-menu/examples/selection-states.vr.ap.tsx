import React from 'react';

import { cssMap } from '@atlaskit/css';
import DropdownItemCheckbox from '@atlaskit/dropdown-menu/dropdown-item-checkbox';
import DropdownItemRadio from '@atlaskit/dropdown-menu/dropdown-item-radio';
import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		paddingBlockStart: token('space.150'),
		paddingInlineEnd: token('space.150'),
		paddingBlockEnd: token('space.150'),
		paddingInlineStart: token('space.150'),
	},
});

export default (): React.JSX.Element => (
	<Box xcss={styles.container}>
		<DropdownMenu testId="dropdown" isOpen trigger="Filter cities" shouldRenderToParent>
			<DropdownItemGroup>
				<DropdownItemCheckbox id="checkbox" isSelected>
					Checkbox
				</DropdownItemCheckbox>
				<DropdownItemRadio id="radio" isSelected>
					Radio
				</DropdownItemRadio>
				<DropdownItem isSelected>Item</DropdownItem>
			</DropdownItemGroup>
		</DropdownMenu>
	</Box>
);
