import React from 'react';

import { styled } from '@compiled/react';

import { withWaitForItem } from '@atlaskit/link-test-helpers';
import { token } from '@atlaskit/tokens';

import { HoverableContainer } from '../../examples-helpers/hoverableContainer';
import EmptyState from '../../src/ui/issue-like-table/empty-state';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Container = styled.div({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	maxHeight: 590,
	paddingTop: token('space.100', '8px'),
	paddingRight: token('space.100', '8px'),
	paddingBottom: token('space.100', '8px'),
	paddingLeft: token('space.100', '8px'),
});

export default function Component() {
	return (
		<Container>
			<HoverableContainer>
				<EmptyState />
			</HoverableContainer>
		</Container>
	);
}

export const VREmptyStateHoverable = withWaitForItem(Component, () => {
	return document.body.querySelector('[data-testid="examples-hoverable-container"]') !== null;
});
