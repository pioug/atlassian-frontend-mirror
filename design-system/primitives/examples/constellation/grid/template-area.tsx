import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Grid } from '@atlaskit/primitives/compiled/grid';

import ExampleBox from '../shared/example-box';

const gridStyles = cssMap({
	root: {
		gridTemplateAreas: `
            "navigation navigation navigation"
            "sidenav content content"
            "footer footer footer"
        `,
	},
	navigation: { gridArea: 'navigation' },
	sidenav: { gridArea: 'sidenav' },
	content: { gridArea: 'content' },
	footer: { gridArea: 'footer' },
});

export default function Basic(): React.JSX.Element {
	return (
		<Grid testId="grid-basic" gap="space.200" xcss={gridStyles.root}>
			<ExampleBox xcss={gridStyles.navigation} />
			<ExampleBox xcss={gridStyles.sidenav} />
			<ExampleBox xcss={gridStyles.content} />
			<ExampleBox xcss={gridStyles.footer} />
		</Grid>
	);
}
