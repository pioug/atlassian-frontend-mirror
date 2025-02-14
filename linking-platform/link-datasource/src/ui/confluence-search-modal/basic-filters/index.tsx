import React from 'react';

import { cssMap } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type SelectOption } from '../../common/modal/popup-select/types';

import BasicFilterContainerOld from './basic-filters-old';
import { DateRangePicker, type DateRangeSelection } from './filters/date-range-picker';
import EditedOrCreatedByFilter from './filters/edited-or-created-by';
import { CLOLBasicFilters, type SelectedOptionsMap } from './types';

export interface BasicFilterContainerProps {
	cloudId?: string;
	selections: SelectedOptionsMap;
	onChange: (filterType: CLOLBasicFilters, options: SelectOption | SelectOption[]) => void;
	isHydrating?: boolean;
}

const styles = cssMap({
	basicFilterContainerStyles: {
		paddingLeft: token('space.100'),
	},
});

const BasicFilterContainer = ({
	cloudId,
	onChange,
	selections = {},
	isHydrating,
}: BasicFilterContainerProps) => {
	const { lastModified, editedOrCreatedBy } = selections;

	const [lastModifiedValue] = lastModified || [];
	const lastModifiedSelection =
		lastModifiedValue?.optionType === 'dateRange' ? lastModifiedValue : undefined;

	const onDateRangePickerChange = (updatedOption: DateRangeSelection) => {
		onChange(CLOLBasicFilters.lastModified, {
			optionType: 'dateRange',
			label: updatedOption.value,
			...updatedOption,
		});
	};

	return (
		<Flex
			xcss={styles.basicFilterContainerStyles}
			gap="space.100"
			testId="clol-basic-filter-container"
		>
			<EditedOrCreatedByFilter
				cloudId={cloudId}
				onSelectionChange={onChange}
				selection={editedOrCreatedBy || []}
				isHydrating={isHydrating}
			/>
			<DateRangePicker
				selection={lastModifiedSelection}
				onSelectionChange={onDateRangePickerChange}
				filterName={`clol-basic-filter-${CLOLBasicFilters.lastModified}`}
			/>
		</Flex>
	);
};

const BasicFilterContainerExported = (props: BasicFilterContainerProps) => {
	if (fg('bandicoots-compiled-migration-link-datasource')) {
		return <BasicFilterContainer {...props} />;
	} else {
		return <BasicFilterContainerOld {...props} />;
	}
};

export default BasicFilterContainerExported;
