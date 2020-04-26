import { B500, DN10, DN500, N0, N800 } from '@atlaskit/theme/colors';

import modeGenerator from './modeGenerator';

export const light = modeGenerator({
  product: {
    text: N0,
    background: B500,
  },
});

export const dark = modeGenerator({
  product: {
    text: DN500,
    background: DN10,
  },
});

export const settings = modeGenerator({
  product: {
    text: N0,
    background: N800,
  },
});
