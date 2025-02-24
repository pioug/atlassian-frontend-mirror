import React from 'react';

import { DecisionItem } from '../..';

export const DecisionItemEditor = () => <DecisionItem>Decision item</DecisionItem>;

export const DecisionItemEditorWithPlaceholder = () => (
	<DecisionItem placeholder="Write a decision..." showPlaceholder></DecisionItem>
);
