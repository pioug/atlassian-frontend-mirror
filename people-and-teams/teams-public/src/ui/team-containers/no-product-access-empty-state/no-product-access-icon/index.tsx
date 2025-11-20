import React from 'react';

import { cssMap } from '@atlaskit/css';
import Image from '@atlaskit/image';
import { Box } from '@atlaskit/primitives/compiled';

import NoProductAccessSVG from '../../../../common/assets/NoProductAccess.svg';

const styles = cssMap({
	icon: {
		minWidth: '80px',
		maxWidth: '80px',
	},
});

export function NoProductAccessIcon(): React.JSX.Element {
	return (
		<Box xcss={styles.icon}>
			<Image src={NoProductAccessSVG} alt="" />
		</Box>
	);
}
