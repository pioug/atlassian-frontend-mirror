/**
 * Legacy color palette sourced from: packages/design-system/theme/src/colors.tsx
 *
 * This palette should be exclusively used for backwards compatible themes
 */

import type { PaletteColorTokenSchema } from '../types';

type PaletteValues =
  | 'transparent'
  | 'R50'
  | 'R75'
  | 'R100'
  | 'R200'
  | 'R300'
  | 'R400'
  | 'R500'
  | 'Y50'
  | 'Y75'
  | 'Y100'
  | 'Y200'
  | 'Y300'
  | 'Y400'
  | 'Y500'
  | 'O800'
  | 'G50'
  | 'G75'
  | 'G100'
  | 'G200'
  | 'G300'
  | 'G400'
  | 'G500'
  | 'B50'
  | 'B75'
  | 'B100'
  | 'B200'
  | 'B300'
  | 'B400'
  | 'B500'
  | 'P50'
  | 'P75'
  | 'P100'
  | 'P200'
  | 'P300'
  | 'P400'
  | 'P500'
  | 'T50'
  | 'T75'
  | 'T100'
  | 'T200'
  | 'T300'
  | 'T400'
  | 'T500'
  | 'N0'
  | 'N10'
  | 'N20'
  | 'N30'
  | 'N40'
  | 'N50'
  | 'N60'
  | 'N70'
  | 'N80'
  | 'N90'
  | 'N100'
  | 'N200'
  | 'N300'
  | 'N400'
  | 'N500'
  | 'N600'
  | 'N700'
  | 'N800'
  | 'N900'
  | 'N10A'
  | 'N20A'
  | 'N30A'
  | 'N40A'
  | 'N50A'
  | 'N60A'
  | 'N70A'
  | 'N80A'
  | 'N90A'
  | 'N100A'
  | 'N200A'
  | 'N300A'
  | 'N400A'
  | 'N500A'
  | 'N600A'
  | 'N700A'
  | 'N800A'
  | 'DN900'
  | 'DN800'
  | 'DN700'
  | 'DN600'
  | 'DN500'
  | 'DN400'
  | 'DN300'
  | 'DN200'
  | 'DN100'
  | 'DN90'
  | 'DN80'
  | 'DN70'
  | 'DN60'
  | 'DN50'
  | 'DN40'
  | 'DN30'
  | 'DN20'
  | 'DN10'
  | 'DN0'
  | 'DN800A'
  | 'DN700A'
  | 'DN600A'
  | 'DN500A'
  | 'DN400A'
  | 'DN300A'
  | 'DN200A'
  | 'DN100A'
  | 'DN90A'
  | 'DN80A'
  | 'DN70A'
  | 'DN60A'
  | 'DN50A'
  | 'DN40A'
  | 'DN30A'
  | 'DN20A'
  | 'DN10'
  | 'DN10A';

export type BaseToken =
  keyof PaletteColorTokenSchema<PaletteValues>['color']['palette'];

const palette: PaletteColorTokenSchema<PaletteValues> = {
  value: {
    opacity: {
      Opacity20: {
        value: 0.2,
        attributes: {
          group: 'palette',
          category: 'opacity',
        },
      },
      Opacity40: {
        value: 0.4,
        attributes: {
          group: 'palette',
          category: 'opacity',
        },
      },
    },
  },
  color: {
    palette: {
      transparent: {
        value: 'transparent',
        attributes: {
          group: 'palette',
          category: 'red',
        },
      },
      R50: {
        value: '#FFEBE6',
        attributes: {
          group: 'palette',
          category: 'red',
        },
      },
      R75: {
        value: '#FFBDAD',
        attributes: {
          group: 'palette',
          category: 'red',
        },
      },
      R100: {
        value: '#FF8F73',
        attributes: {
          group: 'palette',
          category: 'red',
        },
      },
      R200: {
        value: '#FF7452',
        attributes: {
          group: 'palette',
          category: 'red',
        },
      },
      R300: {
        value: '#FF5630',
        attributes: {
          group: 'palette',
          category: 'red',
        },
      },
      R400: {
        value: '#DE350B',
        attributes: {
          group: 'palette',
          category: 'red',
        },
      },
      R500: {
        value: '#BF2600',
        attributes: {
          group: 'palette',
          category: 'red',
        },
      },
      Y50: {
        value: '#FFFAE6',
        attributes: {
          group: 'palette',
          category: 'yellow',
        },
      },
      Y75: {
        value: '#FFF0B3',
        attributes: {
          group: 'palette',
          category: 'yellow',
        },
      },
      Y100: {
        value: '#FFE380',
        attributes: {
          group: 'palette',
          category: 'yellow',
        },
      },
      Y200: {
        value: '#FFC400',
        attributes: {
          group: 'palette',
          category: 'yellow',
        },
      },
      Y300: {
        value: '#FFAB00',
        attributes: {
          group: 'palette',
          category: 'yellow',
        },
      },
      Y400: {
        value: '#FF991F',
        attributes: {
          group: 'palette',
          category: 'yellow',
        },
      },
      Y500: {
        value: '#FF8B00',
        attributes: {
          group: 'palette',
          category: 'yellow',
        },
      },
      O800: {
        value: '#974F0C',
        attributes: {
          group: 'palette',
          category: 'orange',
        },
      },
      G50: {
        value: '#E3FCEF',
        attributes: {
          group: 'palette',
          category: 'green',
        },
      },
      G75: {
        value: '#ABF5D1',
        attributes: {
          group: 'palette',
          category: 'green',
        },
      },
      G100: {
        value: '#79F2C0',
        attributes: {
          group: 'palette',
          category: 'green',
        },
      },
      G200: {
        value: '#57D9A3',
        attributes: {
          group: 'palette',
          category: 'green',
        },
      },
      G300: {
        value: '#36B37E',
        attributes: {
          group: 'palette',
          category: 'green',
        },
      },
      G400: {
        value: '#00875A',
        attributes: {
          group: 'palette',
          category: 'green',
        },
      },
      G500: {
        value: '#006644',
        attributes: {
          group: 'palette',
          category: 'green',
        },
      },
      B50: {
        value: '#DEEBFF',
        attributes: {
          group: 'palette',
          category: 'blue',
        },
      },
      B75: {
        value: '#B3D4FF',
        attributes: {
          group: 'palette',
          category: 'blue',
        },
      },
      B100: {
        value: '#4C9AFF',
        attributes: {
          group: 'palette',
          category: 'blue',
        },
      },
      B200: {
        value: '#2684FF',
        attributes: {
          group: 'palette',
          category: 'blue',
        },
      },
      B300: {
        value: '#0065FF',
        attributes: {
          group: 'palette',
          category: 'blue',
        },
      },
      B400: {
        value: '#0052CC',
        attributes: {
          group: 'palette',
          category: 'blue',
        },
      },
      B500: {
        value: '#0747A6',
        attributes: {
          group: 'palette',
          category: 'blue',
        },
      },
      P50: {
        value: '#EAE6FF',
        attributes: {
          group: 'palette',
          category: 'purple',
        },
      },
      P75: {
        value: '#C0B6F2',
        attributes: {
          group: 'palette',
          category: 'purple',
        },
      },
      P100: {
        value: '#998DD9',
        attributes: {
          group: 'palette',
          category: 'purple',
        },
      },
      P200: {
        value: '#8777D9',
        attributes: {
          group: 'palette',
          category: 'purple',
        },
      },
      P300: {
        value: '#6554C0',
        attributes: {
          group: 'palette',
          category: 'purple',
        },
      },
      P400: {
        value: '#5243AA',
        attributes: {
          group: 'palette',
          category: 'purple',
        },
      },
      P500: {
        value: '#403294',
        attributes: {
          group: 'palette',
          category: 'purple',
        },
      },
      T50: {
        value: '#E6FCFF',
        attributes: {
          group: 'palette',
          category: 'teal',
        },
      },
      T75: {
        value: '#B3F5FF',
        attributes: {
          group: 'palette',
          category: 'teal',
        },
      },
      T100: {
        value: '#79E2F2',
        attributes: {
          group: 'palette',
          category: 'teal',
        },
      },
      T200: {
        value: '#00C7E6',
        attributes: {
          group: 'palette',
          category: 'teal',
        },
      },
      T300: {
        value: '#00B8D9',
        attributes: {
          group: 'palette',
          category: 'teal',
        },
      },
      T400: {
        value: '#00A3BF',
        attributes: {
          group: 'palette',
          category: 'teal',
        },
      },
      T500: {
        value: '#008DA6',
        attributes: {
          group: 'palette',
          category: 'teal',
        },
      },
      N0: {
        value: '#FFFFFF',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N10: {
        value: '#FAFBFC',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N20: {
        value: '#F4F5F7',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N30: {
        value: '#EBECF0',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N40: {
        value: '#DFE1E6',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N50: {
        value: '#C1C7D0',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N60: {
        value: '#B3BAC5',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N70: {
        value: '#A5ADBA',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N80: {
        value: '#97A0AF',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N90: {
        value: '#8993A4',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N100: {
        value: '#7A869A',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N200: {
        value: '#6B778C',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N300: {
        value: '#5E6C84',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N400: {
        value: '#505F79',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N500: {
        value: '#42526E',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N600: {
        value: '#344563',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N700: {
        value: '#253858',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N800: {
        value: '#172B4D',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N900: {
        value: '#091E42',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N10A: {
        value: '#091e4205',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N20A: {
        value: '#091e420a',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N30A: {
        value: '#091e4214',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N40A: {
        value: '#091e4221',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N50A: {
        value: '#091e423f',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N60A: {
        value: '#091e424f',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N70A: {
        value: '#091e425b',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N80A: {
        value: '#091e426b',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N90A: {
        value: '#091e427a',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N100A: {
        value: '#091e4289',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N200A: {
        value: '#091e4299',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N300A: {
        value: '#091e42a8',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N400A: {
        value: '#091e42b5',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N500A: {
        value: '#091e42c4',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N600A: {
        value: '#091e42d1',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N700A: {
        value: '#091e42e2',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      N800A: {
        value: '#091e42f2',
        attributes: {
          group: 'palette',
          category: 'light mode neutral',
        },
      },
      DN900: {
        value: '#E6EDFA',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN800: {
        value: '#DCE5F5',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN700: {
        value: '#CED9EB',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN600: {
        value: '#B8C7E0',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN500: {
        value: '#ABBBD6',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN400: {
        value: '#9FB0CC',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN300: {
        value: '#8C9CB8',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN200: {
        value: '#7988A3',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN100: {
        value: '#67758F',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN90: {
        value: '#56637A',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN80: {
        value: '#455166',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN70: {
        value: '#3B475C',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN60: {
        value: '#313D52',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN50: {
        value: '#283447',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN40: {
        value: '#202B3D',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN30: {
        value: '#1B2638',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN20: {
        value: '#121A29',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN10: {
        value: '#0E1624',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN0: {
        value: '#0D1424',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN800A: {
        value: '#0d1424f',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN700A: {
        value: '#0d142423',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN600A: {
        value: '#0d14242d',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN500A: {
        value: '#0d142449',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN400A: {
        value: '#0d14245b',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN300A: {
        value: '#0d142466',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN200A: {
        value: '#0d142477',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN100A: {
        value: '#0d142487',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN90A: {
        value: '#0d1424a0',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN80A: {
        value: '#0d1424ba',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN70A: {
        value: '#0d1424c6',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN60A: {
        value: '#0d1424ce',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN50A: {
        value: '#0d1424d8',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN40A: {
        value: '#0d1424e2',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN30A: {
        value: '#0d1424ea',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN20A: {
        value: '#0d1424f2',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
      DN10A: {
        value: '#0d1424f7',
        attributes: {
          group: 'palette',
          category: 'dark mode neutral',
        },
      },
    },
  },
};

export default palette;
