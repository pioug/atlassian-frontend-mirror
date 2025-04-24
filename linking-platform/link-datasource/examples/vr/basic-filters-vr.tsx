import React, { useCallback, useState } from 'react';

import { cssMap } from '@compiled/react';
import { IntlProvider } from 'react-intl-next';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { withWaitForItem } from '@atlaskit/link-test-helpers';
import { mockBasicFilterAGGFetchRequests, mockSite } from '@atlaskit/link-test-helpers/datasource';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type SelectOption } from '../../src/ui/common/modal/popup-select/types';
import {
	type BasicFilterFieldType,
	type SelectedOptionsMap,
} from '../../src/ui/jira-issues-modal/basic-filters/types';
import AsyncPopupSelect from '../../src/ui/jira-issues-modal/basic-filters/ui/async-popup-select';

const styles = cssMap({
	flexContainerStyles: {
		marginTop: token('space.400'),
		marginRight: token('space.400'),
		marginBottom: token('space.400'),
		marginLeft: token('space.400'),
	},
});

mockBasicFilterAGGFetchRequests();

const Component = () => {
	const filters: BasicFilterFieldType[] = ['project', 'type', 'status', 'assignee'];

	const [selection, setSelection] = useState<SelectedOptionsMap>({
		project: [],
		type: [],
		status: [],
		assignee: [],
	});

	const handleSelectionChange = useCallback(
		(filter: BasicFilterFieldType, options: SelectOption[]) => {
			const updatedSelection = {
				...selection,
				[filter]: options,
			};
			setSelection(updatedSelection);
		},
		[selection],
	);

	return (
		<IntlProvider locale="en">
			<SmartCardProvider client={new CardClient()}>
				<Flex gap="space.400" xcss={styles.flexContainerStyles}>
					{filters.map((filter) => (
						<AsyncPopupSelect
							filterType={filter}
							site={mockSite}
							key={filter}
							selection={selection[filter] || []}
							onSelectionChange={handleSelectionChange}
							isJQLHydrating={false}
						/>
					))}
				</Flex>
			</SmartCardProvider>
		</IntlProvider>
	);
};

export default withWaitForItem(Component, () => {
	const buttons = document.body.querySelectorAll('button');
	return buttons.length >= 4;
});
