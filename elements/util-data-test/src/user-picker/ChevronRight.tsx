import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import React from 'react';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const containerStyles = xcss({
	display: 'flex',
});

const iconWrapperStyles = xcss({
	marginTop: 'space.050',
	marginLeft: 'space.050',
});

export default (): React.JSX.Element => {
	return (
		<Box xcss={containerStyles}>
			<Box xcss={iconWrapperStyles}>
				<ChevronRightIcon
					testId="chevron-right-icon"
					label="chevron right"
					color={token('color.text.subtlest')}
					spacing="spacious"
					size="small"
				/>
			</Box>
		</Box>
	);
};
