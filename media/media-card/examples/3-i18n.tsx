import React, { useState } from 'react';
import {
  I18NWrapper,
  externaBrokenlIdentifier,
  errorFileId,
  createStorybookMediaClientConfig,
} from '@atlaskit/media-test-helpers';
import { Card } from '../src';
import styled from 'styled-components';
import { Checkbox } from '@atlaskit/checkbox';

const mediaClientConfig = createStorybookMediaClientConfig();

const Wrapper = styled.div`
  max-width: 800px;
  margin: auto;
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

// externaBrokenlIdentifier is only supported by the new Media Card Experience
const fileIds = [errorFileId, externaBrokenlIdentifier];

export default () => {
  const [enableNewExp, setEnableNewExp] = useState(true);
  return (
    <Wrapper>
      <I18NWrapper>
        <Checkbox
          value="newExp"
          label="Display the new experience?"
          isChecked={enableNewExp}
          onChange={e => setEnableNewExp(e.target.checked)}
          name="isExternalImage"
        />
        {fileIds.map((fileId, fileIdIndex) =>
          cardDimensions.map((dimensions, dimensionIndex) => (
            <CardContainer key={`${dimensionIndex}${fileIdIndex}`}>
              <Card
                identifier={fileId}
                mediaClientConfig={mediaClientConfig}
                dimensions={dimensions}
                featureFlags={{ newCardExperience: enableNewExp }}
              />
            </CardContainer>
          )),
        )}
      </I18NWrapper>
    </Wrapper>
  );
};
