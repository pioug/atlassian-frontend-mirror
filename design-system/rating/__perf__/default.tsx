import React, { useState } from 'react';

import { RatingGroup, Star } from '../src';

export default () => {
  const [value, setValue] = useState<string | undefined>('two');

  return (
    <RatingGroup
      value={value}
      onChange={setValue}
      groupName="rating--controlled"
    >
      <Star label="Terrible" value="one" />
      <Star label="Meh" value="two" />
      <Star label="Good" value="three" />
    </RatingGroup>
  );
};
