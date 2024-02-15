import React from 'react';
import { StoryList } from '@atlaskit/media-test-helpers';
import { MainWrapper } from '../example-helpers';
import {
  apiCards,
  cardWithContextId,
  collectionConfigCards,
  errorCards,
  lazyLoadCards,
  menuCards,
  noHoverStateCards,
  noThumbnailCards,
  standardCards,
} from '../example-helpers/cards';

export default () => {
  return (
    <MainWrapper>
      <div>
        <h1 style={{ margin: '10px 20px' }}>File cards</h1>
        <div style={{ margin: '20px 40px' }}>
          <h3>Standard</h3>
          <StoryList>{standardCards}</StoryList>
          <StoryList>{cardWithContextId}</StoryList>

          <h3>Error</h3>
          <StoryList>{errorCards}</StoryList>

          <h3>Menu</h3>
          <StoryList>{menuCards}</StoryList>

          <h3>API Cards</h3>
          <StoryList>{apiCards}</StoryList>

          <h3>Thumbnail not available</h3>
          <StoryList>{noThumbnailCards}</StoryList>

          <h3>Lazy load</h3>
          <StoryList>{lazyLoadCards}</StoryList>

          <h3>Collection configurations</h3>
          <StoryList>{collectionConfigCards}</StoryList>

          <h3>Overlay disabled</h3>
          <StoryList>{noHoverStateCards}</StoryList>
        </div>
      </div>
    </MainWrapper>
  );
};
