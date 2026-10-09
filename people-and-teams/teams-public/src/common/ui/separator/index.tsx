import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Text } from '@atlaskit/primitives/compiled/text';

const styles = cssMap({
	separator: {
		transform: 'scale(0.75)',
	},
});

const SEPARATOR = '•';
export const Separator = (): React.JSX.Element => (
	<Inline xcss={styles.separator}>
		<Text size="small" color="color.text.subtle">
			{SEPARATOR}
		</Text>
	</Inline>
);
