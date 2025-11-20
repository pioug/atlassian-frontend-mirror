import React from 'react';

import { IntlProvider } from 'react-intl-next';
import { BrowserRouter as Router } from 'react-router-dom';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { AddContainerCard } from '../src/ui/team-containers/add-container-card';

const styles = cssMap({
	root: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
		width: '300px',
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
	},
});

export default function Basic(): React.JSX.Element {
	const locale = 'en';
	return (
		<Router>
			<IntlProvider key={locale} locale={locale}>
				<Box xcss={styles.root}>
					<AddContainerCard containerType="ConfluenceSpace" onAddAContainerClick={() => {}} />
					<AddContainerCard containerType="JiraProject" onAddAContainerClick={() => {}} />
					<AddContainerCard containerType="WebLink" onAddAContainerClick={() => {}} />
				</Box>
			</IntlProvider>
		</Router>
	);
}
