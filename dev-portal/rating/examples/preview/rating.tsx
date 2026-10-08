import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { RatingGroup } from '@atlaskit/rating/rating-group';
import { Star } from '@atlaskit/rating/star';
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

export const previewOptions = { width: 'fit-content', scale: 1.5 } as const;
export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<RatingGroup groupName="rating" value="4">
					<Star label="One star" value="1" />
					<Star label="Two stars" value="2" />
					<Star label="Three stars" value="3" />
					<Star label="Four stars" value="4" />
					<Star label="Five stars" value="5" />
				</RatingGroup>
			</Box>
		</IntlProvider>
	);
}
