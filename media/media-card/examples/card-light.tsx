import React from 'react';
import { CardLoading, CardError } from '../src';
import { StoryList } from '@atlaskit/media-test-helpers';
import { MainWrapper } from '../example-helpers';

const divStyle = {
  width: '100px',
  height: '100px',
};
const dimensions = { height: 50, width: 50 };

const defaultCards = [
  {
    title: 'Medium Loading',
    content: (
      <div style={divStyle}>
        <CardLoading />
      </div>
    ),
  },
  {
    title: 'Medium Error',
    content: (
      <div style={divStyle}>
        <CardError />
      </div>
    ),
  },
];

const resizedCards = [
  {
    title: 'Medium Loading',
    content: <CardLoading dimensions={dimensions} />,
  },
  {
    title: 'Medium Error',
    content: <CardError dimensions={dimensions} />,
  },
];

export default () => (
  <MainWrapper>
    <div>
      <h3>Default size</h3>
      <StoryList>{defaultCards}</StoryList>
      <h3>50x50 size</h3>
      <StoryList>{resizedCards}</StoryList>
    </div>
  </MainWrapper>
);
