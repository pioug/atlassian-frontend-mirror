import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

import { ExampleIssueLikeTable } from '../../examples-helpers/buildIssueLikeTable';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Container = styled.div({
	margin: token('space.600', '48px'),
	height: '400px',
	width: '600px',
});

export default () => {
	return (
		<div>
			<Container>
				<ExampleIssueLikeTable />
			</Container>
			<Container>
				<ExampleIssueLikeTable />
			</Container>
		</div>
	);
};
