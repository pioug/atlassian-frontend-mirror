import React from 'react';

import { widths } from '../../../src/constants';

const DrawerWidthsDescription = () => {
  return (
    <p>
      There is a selection of preset drawer sizes to choose from. Set `width` to
      one of the following:
      {widths.map((width) => ` ${width}`)}.
    </p>
  );
};

export default DrawerWidthsDescription;
