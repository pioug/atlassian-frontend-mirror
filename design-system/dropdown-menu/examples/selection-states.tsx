import React from 'react';

import { cssMap } from '@atlaskit/css';
import DropdownMenu, {
	DropdownItem,
	DropdownItemCheckbox,
	DropdownItemGroup,
	DropdownItemRadio,
} from '@atlaskit/dropdown-menu';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		paddingTop: token('space.150'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.150'),
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
