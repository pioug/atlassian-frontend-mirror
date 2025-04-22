import React from 'react';

import { ExampleIssueLikeTableExample } from '../../examples-helpers/buildIssueLikeTable';
import VRTestWrapper from '../utils/VRWrapper';
import { withWaitForItem } from '../utils/withWaitForItem';

export const VRIssueLikeTable = (
	props: React.ComponentProps<typeof ExampleIssueLikeTableExample>,
): JSX.Element => {
	return (
		<VRTestWrapper>
			<ExampleIssueLikeTableExample {...props} />
		</VRTestWrapper>
	);
};

export const VRInformationalIssueLikeTable = withWaitForItem(VRIssueLikeTable, () => {
	const columnHeading = document.body.querySelector('[data-testid="type-column-heading"]');
	const peopleColumnHeading = document.body.querySelector('[data-testid="people-column-heading"]');
	const columnDropTarget = document.body.querySelector('[data-testid="column-drop-target"]');

	return [columnHeading, peopleColumnHeading, columnDropTarget].every((x) => x !== null);
});
