import React, { type ReactElement } from 'react';

import { cssMap } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Text } from '@atlaskit/primitives/compiled';
import VisuallyHidden from '@atlaskit/visually-hidden';

const styles = cssMap({
	containerOld: {
		display: 'flex',
		position: 'relative',
	},
	containerNew: {
		display: 'flex',
		position: 'relative',
		marginTop: 0,
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
		<Box
			as="li"
			testId={testId}
			key={key}
			xcss={fg('jfp-a11y-team_pagination_list-markup') ? styles.containerNew : styles.containerOld}
			paddingInline="space.100"
		>
			<Text testId={testId && `${testId}-text`}>
				<VisuallyHidden>
					Skipped pages from {from} to {to}
				</VisuallyHidden>
				&hellip;
			</Text>
		</Box>
	);
}
