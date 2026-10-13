import React from 'react';

import { cssMap } from '@atlaskit/css';
import { NameCell } from '@atlaskit/media-table/name-cell';
import { Box } from '@atlaskit/primitives/compiled/box';

const styles = cssMap({ container: { width: '240px' } });

export default function MediaFileNameCell(): React.JSX.Element {
	return (
		<Box xcss={styles.container}>
			<NameCell text="Quarterly planning and delivery review.pdf" mediaType="doc" />
		</Box>
	);
}
