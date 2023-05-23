import React from 'react';

import { StringType } from '@atlaskit/linking-types';

interface TextProps {
  testId?: string;
  text: StringType['value'];
}

export const TEXT_TYPE_TEST_ID = 'link-datasource-render-type--text';

const TextRenderType = ({ text, testId = TEXT_TYPE_TEST_ID }: TextProps) => {
  if (!(text && typeof text === 'string')) {
    return <></>;
  }

  return <span data-testid={testId}>{text}</span>;
};

export default TextRenderType;
