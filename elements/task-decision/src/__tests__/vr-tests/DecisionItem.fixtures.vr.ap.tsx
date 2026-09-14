import React from 'react';

import { DecisionItem } from '../..';

export const DecisionItemEditor = (): React.JSX.Element => (
	<DecisionItem>Decision item</DecisionItem>
);

export const DecisionItemEditorWithPlaceholder = (): React.JSX.Element => (
	<DecisionItem placeholder="Write a decision..." showPlaceholder></DecisionItem>
);
