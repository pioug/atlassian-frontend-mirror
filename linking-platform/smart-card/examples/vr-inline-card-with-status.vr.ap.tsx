import React from 'react';

import { InlineCardResolvedView as ResolvedView } from '../src/view/InlineCard/ResolvedView';

import { VRTestCase } from './utils/common';

export default (): React.JSX.Element => {
	return (
		<VRTestCase title="Inline card with status">
			{() => (
				<ResolvedView
					link={'https://www.mockurl.com'}
					isSelected={false}
					title="Smart Link"
					lozenge={{
						text: 'In progress - 0.7',
						appearance: 'inprogress',
					}}
				/>
			)}
		</VRTestCase>
	);
};
