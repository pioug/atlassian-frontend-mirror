import React from 'react';

import { InlineCardResolvedView as ResolvedView } from '../../src/view/InlineCard/ResolvedView';
import { VRTestCase } from '../utils/common';

export default () => {
	return (
		<VRTestCase title="Selected inline card with default icon">
			{() => (
				<ResolvedView
					link={'some-url'}
					isSelected={true}
					icon={'broken-url'}
					title="Smart Links - Designs"
					lozenge={{
						text: 'in progress',
						appearance: 'inprogress',
					}}
				/>
			)}
		</VRTestCase>
	);
};
