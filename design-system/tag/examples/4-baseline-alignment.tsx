import React from 'react';

import Tag from '../src/tag/removable-tag';

const cupcakeipsum =
  'Croissant topping tiramisu gummi bears. Bonbon chocolate bar danish soufflé';

export default () => (
  <Tag
    text={cupcakeipsum}
    removeButtonLabel="No sweets for you!"
    href="http://www.cupcakeipsum.com/"
  />
);
