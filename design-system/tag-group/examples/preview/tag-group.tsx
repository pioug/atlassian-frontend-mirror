import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import TagGroup from '@atlaskit/tag-group/tag-group';
import Tag from '@atlaskit/tag/tag-new';
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
				<TagGroup>
					<Tag text="Design" />
					<Tag text="Engineering" />
					<Tag text="Product" />
				</TagGroup>
			</Box>
		</IntlProvider>
	);
}
