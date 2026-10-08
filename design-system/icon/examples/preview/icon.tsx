import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import HeartIcon from '@atlaskit/icon/core/heart';
import LightbulbIcon from '@atlaskit/icon/core/lightbulb';
import StarIcon from '@atlaskit/icon/core/star-starred';
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

export const previewOptions = { width: 'fit-content', scale: 2 } as const;
export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<StarIcon label="" />
				<HeartIcon label="" />
				<LightbulbIcon label="" />
			</Box>
		</IntlProvider>
	);
}
