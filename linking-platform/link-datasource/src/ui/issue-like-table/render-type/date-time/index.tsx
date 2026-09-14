import React from 'react';

import { useIntl } from 'react-intl';

import type { DateTimeType, DateType, TimeType } from '@atlaskit/linking-types/datasource';
import { Text } from '@atlaskit/primitives/compiled';

import { getFormattedDate } from './getFormattedDate';

export interface DateProps {
	display: (DateType | TimeType | DateTimeType)['type'];
	testId?: string;
	value: (DateType | TimeType | DateTimeType)['value'];
}

export const DATETIME_TYPE_TEST_ID = 'link-datasource-render-type--datetime';

const DateTimeRenderType = ({
	value,
	testId = DATETIME_TYPE_TEST_ID,
	display = 'datetime',
}: DateProps): React.JSX.Element => {
	const intl = useIntl();
	const formattedString = getFormattedDate(value, display, intl.formatDate);
	if (formattedString === '') {
		return <></>;
	}

	return <Text testId={testId}>{formattedString}</Text>;
};

export default DateTimeRenderType;
