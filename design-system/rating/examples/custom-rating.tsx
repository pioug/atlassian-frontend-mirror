import React from 'react';

import { gridSize } from '@atlaskit/theme/constants';

import { Rating, RatingGroup } from '../src';

const Emoji = ({
  children,
  isChecked,
}: {
  isChecked: boolean;
  children: React.ReactNode;
}) => (
  <div
    style={{
      // Setting font size is important here as it's set to ZERO in the parent Rating to work around inline-block spacing issues.
      fontSize: 30,
      margin: gridSize() / 2,
      opacity: isChecked ? 1 : 0.7,
    }}
  >
    {children}
  </div>
);

export default () => {
  return (
    <div
      style={{
        margin: `${gridSize() * 2}px 0 ${gridSize()}px`,
        textAlign: 'center',
      }}
    >
      <RatingGroup groupName="rating--custom">
        <Rating
          render={(props) => (
            <Emoji {...props}>
              <span role="img" aria-label="Crying Emoji">
                😭
              </span>
            </Emoji>
          )}
          label="OMFG"
          value="omfg"
        />
        <Rating
          render={(props) => (
            <Emoji {...props}>
              <span role="img" aria-label="Sad Emoji">
                😞
              </span>
            </Emoji>
          )}
          label="Omg.."
          value="omg"
        />
        <Rating
          render={(props) => (
            <Emoji {...props}>
              <span role="img" aria-label="Smiling Emoji">
                😬
              </span>
            </Emoji>
          )}
          label="Hmm"
          value="hmmm"
        />
        <Rating
          render={(props) => (
            <Emoji {...props}>
              <span role="img" aria-label="Happy Emoji">
                🙂
              </span>
            </Emoji>
          )}
          label="It's ok"
          value="its-ok"
        />
        <Rating
          render={(props) => (
            <Emoji {...props}>
              <span role="img" aria-label="Super Happy Emoji">
                😁
              </span>
            </Emoji>
          )}
          label="So good!"
          value="so-good"
        />
        <Rating
          render={(props) => (
            <Emoji {...props}>
              <span role="img" aria-label="In Love Emoji">
                😍
              </span>
            </Emoji>
          )}
          label="I LOVE THIS"
          value="love-it"
        />
      </RatingGroup>
    </div>
  );
};
