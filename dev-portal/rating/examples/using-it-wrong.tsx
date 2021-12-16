import React from 'react';

import { RatingGroup, Star } from '../src';

export default () => {
  return (
    <>
      Look at the console for some warnings. Don't use <code>value</code> with{' '}
      <code>defaultValue</code>!
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <RatingGroup
          value="two"
          defaultValue="three"
          groupName="rating--using-it-wrong"
        >
          <Star label="one" value="one" />
          <Star label="two" value="two" />
          <Star label="three" value="three" />
          <Star label="four" value="four" />
          <Star label="five" value="five" />
        </RatingGroup>
      </div>
    </>
  );
};
