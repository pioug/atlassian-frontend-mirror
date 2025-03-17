import React, { useMemo } from 'react';

import { cssMap } from '@compiled/react';

import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { Site } from '../../../../common/types';
import { type SelectOption } from '../../../common/modal/popup-select/types';
import type { BasicFilterFieldType, SelectedOptionsMap } from '../types';
import { extractValuesFromNonComplexJQL } from '../utils/extractValuesFromNonComplexJQL';

import AsyncPopupSelect from './async-popup-select';

export const availableBasicFilterTypes: BasicFilterFieldType[] = [
	'project',
	'type',
	'status',
	'assignee',
];

export interface BasicFilterContainerProps {
	jql: string;
	site?: Site;
	selections: SelectedOptionsMap;
	onChange: (filterType: BasicFilterFieldType, options: SelectOption[]) => void;
	isJQLHydrating: boolean;
}

const styles = cssMap({
	basicFilterContainerStyles: {
		paddingLeft: token('space.100'),
	},
});

const BasicFilterContainer = ({
	jql,
	site,
	onChange,
	selections,
	isJQLHydrating,
}: BasicFilterContainerProps) => {
	const extractedFilterValues = useMemo(
		() => (isJQLHydrating ? extractValuesFromNonComplexJQL(jql) : {}),
		[isJQLHydrating, jql],
	);

	const { cloudId } = site || {};

	return (
		<Flex
			xcss={styles.basicFilterContainerStyles}
			gap="space.100"
			testId="jlol-basic-filter-container"
		>
			{availableBasicFilterTypes.map((filter: BasicFilterFieldType) => {
				const shouldShowHydrationLoader =
					isJQLHydrating && extractedFilterValues[filter]?.length > 0;

				return (
					<AsyncPopupSelect
						site={site}
						filterType={filter}
						key={filter}
						selection={selections[filter] || []}
						isJQLHydrating={shouldShowHydrationLoader}
						isDisabled={!cloudId}
						onSelectionChange={onChange}
					/>
				);
			})}
		</Flex>
	);
};

export default BasicFilterContainer;
