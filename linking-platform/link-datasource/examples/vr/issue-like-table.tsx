import React from 'react';

import { withWaitForItem } from '@atlaskit/link-test-helpers';
import type { Product, Site } from '@atlaskit/link-test-helpers/datasource';

import { ExampleIssueLikeTableExample } from '../../examples-helpers/buildIssueLikeTable';
import VRTestWrapper from '../utils/VRWrapper';

export const VRIssueLikeTable = (
	props: React.ComponentProps<typeof ExampleIssueLikeTableExample>,
): JSX.Element => {
	return (
		<VRTestWrapper>
			<ExampleIssueLikeTableExample {...props} />
		</VRTestWrapper>
	);
};

export const VRInformationalIssueLikeTable: React.ComponentType<
	{
		canControlWrapping?: boolean;
		canResizeColumns?: boolean;
		cloudId?: string;
		forceLoading?: boolean;
		isReadonly?: boolean;
		skipIntl?: boolean;
		visibleColumnKeys?: string[];
	} & {
		accessibleProductsOverride?: Product[];
		availableSitesOverride?: Site[];
		datasourceId?: string;
		delayedResponse?: boolean;
		initialVisibleColumnKeys?: string[];
		mockExecutionDelay?: number;
		shouldMockORSBatch?: boolean;
		type?: 'jira' | 'confluence';
	}
> = withWaitForItem(VRIssueLikeTable, () => {
	const columnHeading = document.body.querySelector('[data-testid="type-column-heading"]');
	const peopleColumnHeading = document.body.querySelector('[data-testid="people-column-heading"]');
	const columnDropTarget = document.body.querySelector('[data-testid="column-drop-target"]');

	return [columnHeading, peopleColumnHeading, columnDropTarget].every((x) => x !== null);
});
