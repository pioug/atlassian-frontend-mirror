/**@jsx jsx */
import { css, jsx } from '@emotion/react';
import {
  I18NWrapper,
  externaBrokenlIdentifier,
  errorFileId,
  largePdfFileId,
  imageFileId,
  createStorybookMediaClientConfig,
} from '@atlaskit/media-test-helpers';
import { token } from '@atlaskit/tokens';
import { Card } from '../src';
import { MainWrapper } from '../example-helpers';

const mediaClientConfig = createStorybookMediaClientConfig();

const wrapperStyles = css`
  max-width: 800px;
  margin: ${token('space.250', '20px')} auto;
`;

const cardContainerStyles = css`
  display: inline-block;
  margin-right: ${token('space.250', '20px')};
  margin-top: ${token('space.250', '20px')};
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
    <div css={wrapperStyles}>
      <I18NWrapper>
        <MainWrapper>
          {fileIds.map((fileId, fileIdIndex) =>
            cardDimensions.map((dimensions, dimensionIndex) => (
              <div
                css={cardContainerStyles}
                key={`${dimensionIndex}${fileIdIndex}`}
              >
                <Card
                  identifier={fileId}
                  mediaClientConfig={mediaClientConfig}
                  dimensions={dimensions}
                />
              </div>
            )),
          )}
        </MainWrapper>
      </I18NWrapper>
    </div>
  );
};
