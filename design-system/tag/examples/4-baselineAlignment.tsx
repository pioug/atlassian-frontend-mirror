import React from 'react';
import Tag from '../src';

const cupcakeipsum =
  'Croissant topping tiramisu gummi bears. Bonbon chocolate bar danish soufflé';

export default () => (
  <Tag
    text={cupcakeipsum}
    removeButtonText="No sweets for you!"
    href="http://www.cupcakeipsum.com/"
  />
);
