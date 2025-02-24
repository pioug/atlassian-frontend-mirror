import React from 'react';

import { DecisionList, DecisionItem } from '../../';

export const DecisionListEditor = () => (
	<DecisionList>
		<DecisionItem>Decision item 1</DecisionItem>
		<DecisionItem>Decision item 2</DecisionItem>
		<DecisionItem showPlaceholder placeholder="Write decision...">
			Decision item 3
		</DecisionItem>
	</DecisionList>
);

export const DecisionListSingleItemEditor = () => (
	<DecisionList>
		<DecisionItem>Decision item 1</DecisionItem>
	</DecisionList>
);

export const DecisionListEmptyEditor = () => <DecisionList />;
