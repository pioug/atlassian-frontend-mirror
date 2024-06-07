import React from 'react';

import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

import { HoverableContainer } from '../../examples-helpers/hoverableContainer';
import EmptyState from '../../src/ui/issue-like-table/empty-state';
import { ScrollableContainerHeight } from '../../src/ui/issue-like-table/styled';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Container = styled.div({
	maxHeight: ScrollableContainerHeight,
	padding: token('space.100', '8px'),
});

export default () => {
	return (
		<Container>
			<HoverableContainer>
				<EmptyState />
			</HoverableContainer>
		</Container>
	);
};
