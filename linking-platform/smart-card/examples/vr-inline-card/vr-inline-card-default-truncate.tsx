import React from 'react';
import { Box, xcss } from '@atlaskit/primitives';

import { InlineCardResolvedView as ResolvedView } from '../../src/view/InlineCard/ResolvedView';
import { VRTestCase } from '../utils/common';

const wrapperStyles = xcss({ width: '100px' });

export default () => {
	return (
		<VRTestCase title="Inline card with default icon and truncation">
			{() => (
				<Box xcss={wrapperStyles}>
					<ResolvedView
						link={'some-url'}
						isSelected={false}
						icon={'broken-url'}
						title="Smart Links - Designs"
						lozenge={{
							text: 'in progress',
							appearance: 'inprogress',
						}}
						truncateInline
					/>
				</Box>
			)}
		</VRTestCase>
	);
};
