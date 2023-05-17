import React from 'react';

interface NumberProps {
  testId?: string;
  number: number;
}

export const NUMBER_TYPE_TEST_ID = 'link-datasource-render-type--number';

const NumberRenderType = ({
  number,
  testId = NUMBER_TYPE_TEST_ID,
}: NumberProps) => {
  if (typeof number !== 'number') {
    return <></>;
  }

  const formattedNumber = Number.isInteger(number)
    ? number
    : `${number.toFixed(2)}`;

  return <span data-testid={testId}>{formattedNumber}</span>;
};

export default NumberRenderType;
