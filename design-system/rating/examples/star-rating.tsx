import React, { useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import { G300 } from '@atlaskit/theme/colors';

import { RatingGroup, Star } from '../src';

const sizes = [
  'small' as const,
  'medium' as const,
  'large' as const,
  'xlarge' as const,
];

export default () => {
  const [index, setIndex] = useState(2);
  const [color, setColor] = useState<string>();
  const size = sizes[index];
  const increase = () =>
    setIndex((prev) => {
      const next = prev + 1;
      return next === sizes.length ? sizes.length - 1 : next;
    });
  const decrease = () =>
    setIndex((prev) => {
      const next = prev - 1;
      return next < 0 ? 0 : next;
    });

  return (
    <div style={{ textAlign: 'center' }}>
      <ButtonGroup>
        <Button onClick={decrease}>Smaller</Button>
        <Button
          isSelected={!!color}
          onClick={() => setColor((prev) => (prev ? undefined : G300))}
        >
          {color ? 'Reset color' : 'Use custom color'}
        </Button>
        <Button onClick={increase}>Bigger</Button>
      </ButtonGroup>

      <div style={{ margin: '16px 0 8px' }}>
        <RatingGroup groupName="rating--star">
          <Star size={size} color={color} label="Terrible" value="one" />
          <Star size={size} color={color} label="Meh" value="two" />
          <Star size={size} color={color} label="Good" value="three" />
          <Star size={size} color={color} label="Great" value="four" />
          <Star size={size} color={color} label="Fantastic!" value="five" />
        </RatingGroup>
      </div>
    </div>
  );
};
