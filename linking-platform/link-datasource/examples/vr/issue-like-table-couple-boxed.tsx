import React from 'react';

import { styled } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { ExampleIssueLikeTable } from '../../examples-helpers/buildIssueLikeTable';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Container = styled.div({
	marginTop: token('space.600', '48px'),
	marginRight: token('space.600', '48px'),
	marginBottom: token('space.600', '48px'),
	marginLeft: token('space.600', '48px'),
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
