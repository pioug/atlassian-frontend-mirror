import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Inline, Text } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	separator: {
		transform: 'scale(0.75)',
	},
});

const SEPARATOR = '•';
export const Separator = () => (
	<Inline xcss={styles.separator}>
		<Text size="small" color="color.text.subtle">
			{SEPARATOR}
		</Text>
	</Inline>
);
