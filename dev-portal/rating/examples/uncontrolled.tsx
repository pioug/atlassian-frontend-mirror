import React from 'react';

import { RatingGroup, Star } from '../src';

export default () => {
  return (
    <div style={{ textAlign: 'center', marginTop: 8 }}>
      <RatingGroup
        groupName="rating--uncontrolled"
        testId="uncontrolled-rating"
      >
        <Star label="Terrible" value="one" />
        <Star label="Meh" value="two" />
        <Star label="Good" value="three" />
        <Star label="Great" value="four" />
        <Star label="Fantastic!" value="five" />
      </RatingGroup>
    </div>
  );
};
