import React from 'react';

import { styled } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { VRIssueLikeTable } from '../../examples/vr/issue-like-table';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Container = styled.div({
	marginTop: token('space.600', '48px'),
	marginRight: token('space.600', '48px'),
	marginBottom: token('space.600', '48px'),
	marginLeft: token('space.600', '48px'),
	height: '400px',
	width: '600px',
});

export default (): React.JSX.Element => {
	return (
		<div>
			<Container>
				<VRIssueLikeTable />
			</Container>
			<Container>
				<VRIssueLikeTable />
			</Container>
		</div>
	);
};
