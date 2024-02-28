import React from 'react';

import styled from '@emotion/styled';

import { StringType } from '@atlaskit/linking-types';

import { fieldTextFontSize } from '../../styled';

interface TextProps {
  testId?: string;
  text: StringType['value'];
}

export const TEXT_TYPE_TEST_ID = 'link-datasource-render-type--text';

const TextWrapper = styled.span({
  fontSize: fieldTextFontSize,
});

const TextRenderType = ({ text, testId = TEXT_TYPE_TEST_ID }: TextProps) => {
  if (!(text && typeof text === 'string')) {
    return <></>;
  }

  return (
    <>
      <TextWrapper data-testid={testId}>{text}</TextWrapper>
      <br />
    </>
  );
};

export default TextRenderType;
