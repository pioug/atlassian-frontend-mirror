import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

import { HoverableContainer } from '../../examples-helpers/hoverableContainer';
import EmptyState from '../../src/ui/issue-like-table/empty-state';
import { ScrollableContainerHeight } from '../../src/ui/issue-like-table/styled';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Container = styled.div({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
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
