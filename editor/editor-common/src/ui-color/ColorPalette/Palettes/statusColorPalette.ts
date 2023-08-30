import {
  B400,
  B50,
  G400,
  G50,
  N40,
  N400,
  P400,
  P50,
  R400,
  R50,
  Y400,
  Y75,
} from '@atlaskit/theme/colors';

import type { PaletteColor } from './type';

/** this is not new usage - old code extracted from editor-core */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
export const lightModeStatusColorPalette: PaletteColor[] = [
  { label: 'neutral', value: N40, border: N400 },
  { label: 'purple', value: P50, border: P400 },
  { label: 'blue', value: B50, border: B400 },
  { label: 'red', value: R50, border: R400 },
  { label: 'yellow', value: Y75, border: Y400 },
  { label: 'green', value: G50, border: G400 },
];

export const darkModeStatusColorPalette: PaletteColor[] = [
  { label: 'neutral', value: '#7F9BB4', border: N400 },
  { label: 'purple', value: '#282249', border: P400 },
  { label: 'blue', value: '#0C294F', border: B400 },
  { label: 'red', value: '#441C13', border: R400 },
  { label: 'yellow', value: '#413001', border: Y400 },
  { label: 'green', value: '#052E21', border: G400 },
];
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */
