import React, { useState } from 'react';

import { RatingGroup, Star } from '../src';

export default () => {
  const [value, setValue] = useState<string | undefined>('two');

  return (
    <div style={{ textAlign: 'center', marginTop: 8 }}>
      <RatingGroup
        value={value}
        onChange={setValue}
        groupName="rating--controlled"
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
