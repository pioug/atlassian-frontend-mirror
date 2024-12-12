import React, { type ReactElement } from 'react';

import { cssMap } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
import VisuallyHidden from '@atlaskit/visually-hidden';

const styles = cssMap({
	container: {
		display: 'flex',
		position: 'relative',
	},
});

export type EllipsisProp = {
	key: string;
	testId?: string;
	from: number;
	to: number;
};

export default function renderEllipsis({ key, testId, from, to }: EllipsisProp): ReactElement {
	return (
		<Box as="li" testId={testId} key={key} xcss={styles.container} paddingInline="space.100">
			<Text testId={testId && `${testId}-text`}>
				<VisuallyHidden>
					Skipped pages from {from} to {to}
				</VisuallyHidden>
				&hellip;
			</Text>
		</Box>
	);
}
