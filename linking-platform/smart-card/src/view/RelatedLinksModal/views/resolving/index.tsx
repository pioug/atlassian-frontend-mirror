import React from 'react';
import { Box, xcss } from '@atlaskit/primitives';
import Spinner from '@atlaskit/spinner';

const style = xcss({
	alignItems: 'center',
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
	justifyContent: 'center',
});

const RelatedLinksResolvingView = () => (
	<Box xcss={style} testId="related-links-resolving-view">
		<Spinner size={'large'} testId="related-links-resolving-view-spinner" />
	</Box>
);

export default RelatedLinksResolvingView;
