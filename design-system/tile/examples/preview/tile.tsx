import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import LightbulbIcon from '@atlaskit/icon/core/lightbulb';
import { Box } from '@atlaskit/primitives/compiled/box';
import Tile from '@atlaskit/tile/tile';
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
				<Tile label="Ideas" size="large" backgroundColor="color.background.discovery">
					<LightbulbIcon label="" />
				</Tile>
			</Box>
		</IntlProvider>
	);
}
