import React, { useCallback, useState } from 'react';
import ChevronRightIcon from '@atlaskit/icon/utility/migration/chevron-right';
import { Box, xcss } from '@atlaskit/primitives';
import { N50, N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const containerStyles = xcss({
	display: 'flex',
});

const iconWrapperStyles = xcss({
	marginTop: 'space.050',
	marginLeft: 'space.050',
});

export default () => {
	const [isMouseHovered, setHoverState] = useState(false);
	const onMouseEnter = useCallback(() => setHoverState(true), [setHoverState]);
	const onMouseLeave = useCallback(() => setHoverState(false), [setHoverState]);
	return (
		<Box xcss={containerStyles} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
			<Box xcss={iconWrapperStyles}>
				<ChevronRightIcon
					LEGACY_margin={`${token('space.negative.050')} 0 0 ${token('space.negative.050')}`}
					testId="chevron-right-icon"
					label="chevron right"
					LEGACY_size="large"
					color={token('color.text.subtlest', isMouseHovered ? N200 : N50)}
					spacing="spacious"
				/>
			</Box>
		</Box>
	);
};
