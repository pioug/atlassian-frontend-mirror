import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Grid } from '@atlaskit/primitives/compiled';

import ExampleBox from '../shared/example-box';

const gridStyles = cssMap({
	root: {
		gridTemplateAreas: `
            "navigation navigation navigation"
            "sidenav content content"
            "footer footer footer"
        `,
	},
});

export default function Basic(): React.JSX.Element {
	return (
		<Grid testId="grid-basic" gap="space.200" xcss={gridStyles.root}>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<ExampleBox style={{ gridArea: 'navigation' }} />
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<ExampleBox style={{ gridArea: 'sidenav' }} />
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<ExampleBox style={{ gridArea: 'content' }} />
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<ExampleBox style={{ gridArea: 'footer' }} />
		</Grid>
	);
}
