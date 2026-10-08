import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import Image from '@atlaskit/image/image';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import celebration from '../images/Celebration.png';
const styles = cssMap({
	subject: {
		width: '280px',
		display: 'block',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<Image src={celebration} alt="Celebration" width={280} />
			</Box>
		</IntlProvider>
	);
}
