import React from 'react';

import { IntlProvider } from 'react-intl';

import Breadcrumbs from '@atlaskit/breadcrumbs/breadcrumbs';
import { BreadcrumbsItem } from '@atlaskit/breadcrumbs/breadcrumbs-item';
import { cssMap } from '@atlaskit/css';
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
				<Breadcrumbs>
					<BreadcrumbsItem text="Projects" href="#" />
					<BreadcrumbsItem text="Atlas" href="#" />
					<BreadcrumbsItem text="Roadmap" />
				</Breadcrumbs>
			</Box>
		</IntlProvider>
	);
}
