/** @jsx jsx */
import { jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';

const verticalSpaceStyles = xcss({
	marginBlockEnd: 'space.300',
});

const VerticalSpace = () => <Box xcss={verticalSpaceStyles} />;

export default VerticalSpace;
