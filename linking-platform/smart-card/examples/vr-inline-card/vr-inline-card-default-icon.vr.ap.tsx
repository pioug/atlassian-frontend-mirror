import React from 'react';

import { InlineCardResolvedView as ResolvedView } from '../../src/view/InlineCard/ResolvedView';
import { VRTestCase } from '../utils/common';

export default (): React.JSX.Element => {
	return (
		<VRTestCase title="Inline card with default icon">
			{() => (
				<ResolvedView
					link={'some-url'}
					isSelected={false}
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
