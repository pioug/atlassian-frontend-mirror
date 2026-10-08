import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import Pagination from '@atlaskit/pagination/pagination';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: 'fit-content',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<Pagination pages={[1, 2, 3, 4, 5, 6, 7]} selectedIndex={2} />
			</Box>
		</IntlProvider>
	);
}
