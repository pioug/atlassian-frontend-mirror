import React from 'react';

import { StringType } from '@atlaskit/linking-types';

interface TextProps {
  testId?: string;
  text: StringType['value'];
}

export const TEXT_TYPE_TEST_ID = 'link-datasource-render-type--text';

const TextRenderType = ({ text, testId = TEXT_TYPE_TEST_ID }: TextProps) => {
  const textValue = text?.value;

  if (!textValue) {
    return <></>;
  }

  return <span data-testid={testId}>{textValue}</span>;
};

export default TextRenderType;
