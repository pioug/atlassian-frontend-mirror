import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { StaggeredEntrance, ZoomIn } from '@atlaskit/motion';

import { RatingGroup, Star, StarProps } from '../src';

const ZoomInStar = (props: StarProps) => (
  <ZoomIn>{(motion) => <Star {...motion} {...props} />}</ZoomIn>
);

export default () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: 8 }}>
        <Button onClick={() => setCount((prev) => prev + 1)}>Re-enter</Button>
      </div>

      <StaggeredEntrance>
        <RatingGroup key={count} groupName="rating--motion">
          <ZoomInStar label="Terrible" value="one" />
          <ZoomInStar label="Meh" value="two" />
          <ZoomInStar label="Good" value="three" />
          <ZoomInStar label="Great" value="four" />
          <ZoomInStar label="Fantastic!" value="five" />
        </RatingGroup>
      </StaggeredEntrance>
    </div>
  );
};
