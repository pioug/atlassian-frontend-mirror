import React from 'react';

import { NumberType } from '@atlaskit/linking-types';

interface NumberProps {
  testId?: string;
  number: NumberType['value'];
}

export const NUMBER_TYPE_TEST_ID = 'link-datasource-render-type--number';

const NumberRenderType = ({
  number,
  testId = NUMBER_TYPE_TEST_ID,
}: NumberProps) => {
  const numberValue = number?.value;

  if (typeof numberValue !== 'number') {
    return <></>;
  }

  const formattedNumber = Number.isInteger(numberValue)
    ? numberValue
    : `${numberValue.toFixed(2)}`;

  return <span data-testid={testId}>{formattedNumber}</span>;
};

export default NumberRenderType;
