import React from 'react';
import {
  I18NWrapper,
  externaBrokenlIdentifier,
  errorFileId,
  largePdfFileId,
  imageFileId,
  createStorybookMediaClientConfig,
} from '@atlaskit/media-test-helpers';
import { Card } from '../src';
import styled from 'styled-components';
import { MainWrapper } from '../example-helpers';

const mediaClientConfig = createStorybookMediaClientConfig();

const Wrapper = styled.div`
  max-width: 800px;
  margin: 20px auto;
`;

const CardContainer = styled.div`
  display: inline-block;
  margin-right: 20px;
  margin-top: 20px;
`;

const cardDimensions = [
  { width: '156px', height: '108px' },
  { width: '600px', height: '150px' },
];

const fileIds = [
  errorFileId,
  externaBrokenlIdentifier,
  largePdfFileId,
  imageFileId,
];

export default () => {
  return (
    <Wrapper>
      <I18NWrapper>
        <MainWrapper>
          {fileIds.map((fileId, fileIdIndex) =>
            cardDimensions.map((dimensions, dimensionIndex) => (
              <CardContainer key={`${dimensionIndex}${fileIdIndex}`}>
                <Card
                  identifier={fileId}
                  mediaClientConfig={mediaClientConfig}
                  dimensions={dimensions}
                />
              </CardContainer>
            )),
          )}
        </MainWrapper>
      </I18NWrapper>
    </Wrapper>
  );
};
