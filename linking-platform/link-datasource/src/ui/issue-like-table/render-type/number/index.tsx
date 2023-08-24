import React from 'react';

import { NumberType } from '@atlaskit/linking-types';

import TextRenderType from '../text';

interface NumberProps {
  testId?: string;
  number: NumberType['value'];
}

export const NUMBER_TYPE_TEST_ID = 'link-datasource-render-type--number';

const NumberRenderType = ({
  number,
  testId = NUMBER_TYPE_TEST_ID,
}: NumberProps) => {
  if (typeof number !== 'number') {
    return <></>;
  }

  const formattedNumber = number.toLocaleString(undefined, {
    maximumFractionDigits: 15,
  });

  return (
    <TextRenderType testId={testId} text={formattedNumber}></TextRenderType>
  );
};

export default NumberRenderType;
