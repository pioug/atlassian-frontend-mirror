import React from 'react';

import { type NumberType } from '@atlaskit/linking-types';

import TextRenderType from '../text';

interface NumberProps {
	number: NumberType['value'];
	testId?: string;
}

export const NUMBER_TYPE_TEST_ID = 'link-datasource-render-type--number';

const NumberRenderType = ({
	number,
	testId = NUMBER_TYPE_TEST_ID,
}: NumberProps): React.JSX.Element => {
	if (typeof number !== 'number') {
		return <></>;
	}

	const formattedNumber = number.toLocaleString(undefined, {
		maximumFractionDigits: 15,
	});

	return <TextRenderType testId={testId} text={formattedNumber}></TextRenderType>;
};

export default NumberRenderType;
