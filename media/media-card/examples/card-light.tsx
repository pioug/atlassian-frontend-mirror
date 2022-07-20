import React from 'react';
import { StoryList } from '@atlaskit/media-test-helpers';
import { MainWrapper } from '../example-helpers';
import { lightDefaultCards, lightResizedCards } from '../example-helpers/cards';

export default () => (
  <MainWrapper>
    <div>
      <h3>Default size</h3>
      <StoryList>{lightDefaultCards}</StoryList>
      <h3>50x50 size</h3>
      <StoryList>{lightResizedCards}</StoryList>
    </div>
  </MainWrapper>
);
