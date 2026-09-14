import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

import { InlineCardResolvedView as ResolvedView } from '../../src/view/InlineCard/ResolvedView';
import { VRTestCase } from '../utils/common';

const wrapperStyles = xcss({ width: '100px' });

export default (): React.JSX.Element => {
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
