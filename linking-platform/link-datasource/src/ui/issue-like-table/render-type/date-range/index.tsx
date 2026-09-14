import React from 'react';

import { useIntl } from 'react-intl';

import type { DateRangeType } from '@atlaskit/linking-types/datasource';
import { Text } from '@atlaskit/primitives/compiled';

import { getFormattedDateRange } from './getFormattedDateRange';

export interface DateRangeProps {
	testId?: string;
	value: DateRangeType['value'];
}

export const DATERANGE_TYPE_TEST_ID = 'link-datasource-render-type--daterange';

const DateRangeRenderType = ({
	value,
	testId = DATERANGE_TYPE_TEST_ID,
}: DateRangeProps): React.JSX.Element => {
	const { formatDate, formatMessage } = useIntl();
	const formattedString = getFormattedDateRange(value.start, value.end, formatDate, formatMessage);
	if (formattedString === '') {
		return <></>;
	}

	return <Text testId={testId}>{formattedString}</Text>;
};

export default DateRangeRenderType;
