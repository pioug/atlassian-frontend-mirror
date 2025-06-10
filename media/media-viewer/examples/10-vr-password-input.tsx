import React from 'react';

import { I18NWrapper } from '@atlaskit/media-test-helpers';

import { MainWrapper } from '../example-helpers/MainWrapper';
import { PDFPasswordInput } from '../src/viewers/doc/pdfPasswordInput';
import { Box, xcss } from '@atlaskit/primitives';

// Set background color to match media viewer because
// this color doesn't change regardless of the theme
const mediaViewerBackground = xcss({
	background: '#22272b',
	padding: 'space.400',
});

const Example = () => (
	<I18NWrapper>
		<MainWrapper>
			<Box xcss={mediaViewerBackground}>
				<PDFPasswordInput onSubmit={() => {}} />
			</Box>
		</MainWrapper>
	</I18NWrapper>
);

export default Example;
