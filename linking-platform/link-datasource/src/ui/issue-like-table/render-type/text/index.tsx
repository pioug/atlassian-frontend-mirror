import React from 'react';

interface TextProps {
  testId?: string;
  text: string;
}

export const TEXT_TYPE_TEST_ID = 'link-datasource-render-type--text';

const TextRenderType = ({ text, testId = TEXT_TYPE_TEST_ID }: TextProps) => {
  if (!text) {
    return <></>;
  }

  return <span data-testid={testId}>{text}</span>;
};

export default TextRenderType;
